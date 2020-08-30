'use strict'

const fs = require("fs");
const express = require('express');
const path = require('path')
const { fork } = require('child_process');
const StreamCache = require('stream-cache');
//const wav  = require('wav');
//const readder = new wav.Reader();
const wavefile = require('wavefile');
let wav = new wavefile.WaveFile();

//const RtlSdr = require('./lib/stream/sdr-rtl-stream');
const Streamer = require('./lib/stream/streamer.js');
let streamer = new Streamer();

const PORT = process.env.PORT||5000;
const URL_ADDR = '127.0.0.1:'+PORT;
const AUDIO_FILE = './public/audios/raw.dat';

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.get('/audio*', async (req, res) => {

	let new_band = {};
	req.url.split('?')[1].split('&').forEach((eqtn) => {
		let cfg = eqtn.split('=');
		new_band[cfg[0]] = Number(cfg[1]);
	});
	console.log(new_band);

	res.writeHead(200, {
		'Content-Type': 'audio/wav',
	});

	let streamBuffer = fs.createReadStream(AUDIO_FILE);
	//streamBuffer.pipe(res);

	//wav.fromScratch(2, 150e3, '32', [0, 0, 0, 0]);
	//res.write(Buffer.from(wav.toBuffer()));

	let center_frq = new_band.frq + (new_band.bnddr-new_band.bndeq)/2;
	let streamCache = new StreamCache();
	/*
	streamer.sdr.start();
	streamer.sdr.setCenterFreq(center_frq);
	streamer.sdr.stream.pipe(streamer.u8_to_f.stdin)
	*/

	streamBuffer.pipe(streamer.u8_to_f.stdin)
	streamer.u8_to_f.stdout.pipe(streamer.decimator.stdin)
	streamer.decimator.stdout.pipe(res);
	/*
	const streamCache = new StreamCache();
	mySdr.start()
	mySdr.stream
	//.pipe(demodulate)
	.pipe(u8_to_f.stdin)
	u8_to_f.stdout.pipe(dem.stdin)
	dem.stdout.pipe(decimator.stdin)
	decimator.stdout.pipe(f_to_s16.stdin)
	f_to_s16.stdout.pipe(process.stdout)
	*/

	/*
	const forked = fork('./lib/stream/continuous-stream.js');
	console.log('audio')
	forked.on('message', msg => {
		//console.log(msg);
		res.write(Buffer.from(msg.data));
	}); */
});

app.get('/test', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/html/test.html'));
});

app.listen(PORT, () => {
	console.log('Server working at port ' + PORT);
	console.log('Check it at the address ' + URL_ADDR);
});
