$(document).ready(function() {app.inicia();});

var app = {

	imagens: ['img/facebook.png','img/android.png','img/chrome.png','img/firefox.png','img/html5.png','img/googleplus.png','img/twitter.png','img/windows.png'],
	divsSelecionadas: [], cartasViradas: 0,	tempoJogada: 0, primeiraJogada: true,

	inicia: function () {
		$("#inicia").click(function(){app.ressetaJogada();});
		$("#abretempos").click(function(){app.mostraTempos();});
		$("#tempos button").click(function(){$('#tempos').slideUp('slow');});
		$('div').on('dragstart', function(event) {event.preventDefault();});
		let i=1, j=0;
		while (i<16) {
			$("#div" + i + ", #div" + (i+1)).html("<img src='" + this.imagens[j] + "'>").slideDown("slow");
			i += 2; j++;
		}
		if (localStorage["jogoMemoriaTempos"]==undefined) {localStorage["jogoMemoriaTempos"] = JSON.stringify([]);}
	},

    ressetaJogada: function() {
    	$("#inicia").animate({opacity: ".5"},50).animate({opacity: "1"},200);
		this.divsSelecionadas = [];
		this.bloquearDesbloquearJogo();
		for (let i=1; i<17; i++) {
			if (this.primeiraJogada) {$("#div" + i).slideUp("slow");}
			else if (this.cartasViradas!=0) {$("#div" + i).fadeTo("slow",0);}	
		}
		setTimeout(function() {app.embaralhaCartas();}, (this.primeiraJogada || (this.cartasViradas!=0)) ? 600 : 0);
    },

	embaralhaCartas: function() {
		var sorteio = this.imagens.concat(this.imagens), divContent, rndCard;
		app.tempoJogada = new Date().getTime();
		for (let i=1; i<17; i++) {
			rndCard = Math.round(Math.random()*(sorteio.length-1));
			divContent = "<img src='" + sorteio[rndCard] + "'>";
			$("#div" + i).html(divContent).delay((i-1)*25).fadeTo('slow',1).delay(2000+((i-1)*25)).fadeTo('slow',0).unbind('click').click(function(){app.avaliaJogada("#div" + i);});	
			sorteio.splice(rndCard,1);
		}
		setTimeout(function() {app.bloquearDesbloquearJogo()}, 3600);
		this.primeiraJogada = false;
		this.cartasViradas = 0;
	},

	avaliaJogada: function(div) {
		this.divsSelecionadas.push(div);
		this.cartasViradas += 1;
		$(div).fadeTo('slow',1).unbind('click');
		if (this.divsSelecionadas.length==2) {
			app.bloquearDesbloquearJogo(); 
			setTimeout(function() {app.checaCartas()}, 400);
		}
	},	

	checaCartas: function() {
		var divA = this.divsSelecionadas[0], divB = this.divsSelecionadas[1];
		if ($(divA).html() != $(divB).html()) {
			$(divA).fadeTo('slow',0).click(function(){app.avaliaJogada(divA);});
			$(divB).fadeTo('slow',0).click(function(){app.avaliaJogada(divB);});
			this.cartasViradas -= 2;
			setTimeout(function() {app.bloquearDesbloquearJogo();}, 600);
		}
		else {this.bloquearDesbloquearJogo();}
		this.divsSelecionadas = [];
		if (this.cartasViradas == 16) {app.declaraVitoria();}
	},

	bloquearDesbloquearJogo: function() {
		($("#gameblocker").css("z-index") < 0) ? $("#gameblocker").css("z-index","10") : $("#gameblocker").css("z-index","-1")
	},

	declaraVitoria: function () {
		app.tempoJogada = new Date().getTime() - app.tempoJogada;
		$("#vitoria").slideDown('slow');
	},

	atualizaTempos: function() {
		var recuperaTempos = JSON.parse(localStorage["jogoMemoriaTempos"]);
		var novoResultado = {nome: $("#nomevencedor").val(), tempo: this.tempoJogada};
		for (let i=0; i<recuperaTempos.length; i++) {
			if (this.tempoJogada<recuperaTempos[i].tempo) {recuperaTempos.splice(i,0,novoResultado); break;}
		}
		if (recuperaTempos.length==0 || this.tempoJogada>=recuperaTempos[recuperaTempos.length-1].tempo) {recuperaTempos.push(novoResultado);}
		localStorage["jogoMemoriaTempos"] = JSON.stringify(recuperaTempos);		
		$("#vitoria").slideUp('slow');
		this.mostraTempos();
	},

    mostraTempos: function() {
    	$("#abretempos").animate({opacity: ".5"},50).animate({opacity: "1"},200);
 		var recuperaTempos = JSON.parse(localStorage["jogoMemoriaTempos"]), tableMiddle = "";
		for (let i=0; (recuperaTempos.length<15) ? i<recuperaTempos.length : i<15; i++) {
			displayTempo = Math.floor(recuperaTempos[i].tempo/60000) + " m " + ((recuperaTempos[i].tempo%60000)/1000).toFixed(2) + " s";
			tableMiddle += "<tr><td class='pos'>" + (i+1) + "</td><td>" + recuperaTempos[i].nome + "</td><td>" + displayTempo + "</td></tr>";
		} 
		$("#temposBody").html(tableMiddle);
		$("#tempos").slideDown('slow');
    }
};