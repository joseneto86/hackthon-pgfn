
var url = new URLSearchParams(window.location.search);
var idProcesso = url.get("processo");
var execucaoService = new ExecucaoService(preencherEmpresa);
var processo = null;
function preencherEmpresa(){
	processo = execucaoService.buscar(idProcesso);
	$("#numeroProcesso").html(processo.id_imoveis);
	$("#nomeEmpresa").html(processo.nome);
	$("#endereco").html(processo.street);
	$("#tipoImovel").html(processo.businesstype);
	$("#valorDeclarado").html(numeral(processo.declared_price).format('$ 0,0.00'));
	$("#valorCalculado").html(numeral(processo.price).format('$ 0,0.00'));
	$("#valorMedioMetroQuadrado").html(numeral(processo.price_m2).format('$ 0,0.00'));
	$("#dataCadastro").html(processo.createdat);
	$("#dataPrescricao").html(processo.final_date);
	if(processo.businesstype == "Residencial"){
		$("#infoResidencial").css("display", "");
		$("#infoComercial").css("display", "none");
		$("#tamanhoImovel").html(processo.totalareas+"m²");
		$("#quartos").html(processo.bedrooms+" quartos");
		$("#banheiros").html(processo.bathrooms+" banheiros");
		$("#vagas").html(processo.parkingspaces+" vagas");
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