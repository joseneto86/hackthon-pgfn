
var url = new URLSearchParams(window.location.search);
var idProcesso = url.get("processo");
var execucaoService = new ExecucaoService(preencherEmpresa);
var processo = null;
function preencherEmpresa(){
	processo = execucaoService.buscar(idProcesso);
	$("#numeroProcesso").html(processo.id);
	$("#nomeEmpresa").html(processo.nome);
	$("#endereco").html(processo.endereco);
	$("#tipoImovel").html(processo.tipoImovel);
	$("#valorDeclarado").html(numeral(processo.valorDeclarado).format('$ 0,0.00'));
	$("#valorCalculado").html(numeral(processo.valorCalculado).format('$ 0,0.00'));
	$("#valorMedioMetroQuadrado").html(numeral(processo.valorMedioMetroQuadrado).format('$ 0,0.00'));
	$("#dataCadastro").html(processo.dataCadastro);
	$("#dataPrescricao").html(processo.dataPrescricao);
	if(processo.tipoImovel == "Residencial"){
		$("#infoResidencial").css("display", "");
		$("#infoComercial").css("display", "none");
		$("#tamanhoImovel").html(processo.tamanho+"m²");
		$("#quartos").html(processo.quartos+" quartos");
		$("#banheiros").html(processo.banheiros+" banheiros");
		$("#vagas").html(processo.vagas+" vagas");
	}else{
		$("#infoResidencial").css("display", "none");
		$("#infoComercial").css("display", "");
	}

	$("#divProcesso").on("click", function(){
		window.location.href = "empresa-detalhe.html?processo="+processo.id;
	});

}	

function processoExibirImovel(){
	$('#modal-load').modal('show');
	carregarDataSetImoveis(processo.latitude, processo.longitude, finalizarMapa);
	
}

function finalizarMapa(){
	$('#modal-load').modal('hide');
    carregarInfoMapa(processo);
    plotar(mapa);
}