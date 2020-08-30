'use strict'

let usr_cfg = {
    onoff: "off",
    vol: "50",
    frq: (85+110)/2,
    bndeq: 16,
    bnddr: 16,
    dmd: "nenhum",
    flt: true,
};

module.exports = {
	usr_cfg: usr_cfg,
	returnInfoText: returnInfoText,
	printAll: printAll,
	initInfo: initInfo,
	updateInfoText: updateInfoText,
	sendBandServer: sendBandServer
}

function returnInfoText(code, value) {
	let text = "";
	switch(code) {
		case "onoff":
			text = "Status: " + ((value==="on")?"Ligado":"Desligado");
			break;
		case "vol":
			text = "Volume: "+value+"%";
			break;
		case "frq":
			text = "Frequência Central: "+value+"MHz";
			break;
		case "bndeq":
			text = "Banda Esquerda: "+value+"MHz";
			break;
		case "bnddr":
			text = "Banda Direita: "+value+"MHz";
			break;
		case "dmd":
			text = "Método de Demodulação: " + ((value==="nenhum")?(value[0].toUpperCase()+value.substr(1)):value.toUpperCase());
			break;
		case "flt":
			text = "Filtro anti-ruído: "+((value==='on')?"Ligado":"Desligado");
			break;
		default:
			text = "ERRO!";
			break;
	}
	return text;
}

function printAll() {
	Object.keys(usr_cfg).forEach((key) => console.log(key + ' = ' + usr_cfg[key]));
}

function initInfo() {
	Object.keys(usr_cfg).forEach((key) => {
		document.getElementById(key+'show').innerHTML = returnInfoText(key, usr_cfg[key]);
	});
}

function updateInfoText(param) {
	document.getElementById(param.id + 'show').innerHTML = returnInfoText(param.id, param.value);
	return param.value;
}

function sendBandServer(cond) {
	let url = "/audio?frq=" + usr_cfg.frq + "&bndeq=" + usr_cfg.bndeq + "&bnddr=" + usr_cfg.bnddr;
	let ajax = new XMLHttpRequest();
	ajax.open("GET", url, true);
	ajax.setRequestHeader('Content-Type', 'charset=utf-8');
	ajax.responseType = 'arraybuffer';
	ajax.send();
}
