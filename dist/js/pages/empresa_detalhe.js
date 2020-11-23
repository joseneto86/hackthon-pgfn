
var url = new URLSearchParams(window.location.search);
var idProcesso = url.get("processo");
var execucaoService = new ExecucaoService(preencherEmpresa);
var processo = null;
function preencherEmpresa(){
	processo = execucaoService.buscar(idProcesso);
	$("#numeroProcesso").html(processo.id_imoveis);
	$("#breadProcesso").html(processo.id_imoveis);
	$("#nomeEmpresa").html(processo.nome);
	$("#endereco").html(processo.street);
	
	$("#valorDeclarado").html(numeral(processo.declared_price).format('$ 0,0.00'));
	$("#valorCalculado").html(numeral(processo.price).format('$ 0,0.00'));
	$("#valorMedioMetroQuadrado").html(numeral(processo.price_m2).format('$ 0,0.00'));
	$("#dataCadastro").html(formatarData(processo.createdat));
	$("#valorDivida").html(numeral(processo.divida).format('$ 0,0.00'));
	if(processo.businesstype == "Residencial" || processo.businesstype == "RESIDENTIAL"){
		$("#tipoImovel").html("Residencial");
		$("#infoResidencial").css("display", "");
		$("#infoComercial").css("display", "none");
		$("#tamanhoImovel").html(processo.usableareas+"m²");
		$("#quartos").html(processo.bedrooms+" quartos");
		$("#suites").html(processo.suites+" suites");
		$("#banheiros").html(processo.bathrooms+" banheiros");
		$("#vagas").html(processo.parkingspaces+" vagas");
	}else{
		$("#infoResidencial").css("display", "none");
		$("#infoComercial").css("display", "");
		$("#tipoImovel").html("Comercial");
	}

	$("#divProcesso").on("click", function(){
		window.location.href = "empresa-detalhe.html?processo="+processo.id;
	});

}	

function processoExibirImovel(){
	carregarDataSetImoveis(processo.latitude, processo.longitude, finalizarMapa);
}

function finalizarMapa(){
	$('#modal-load').modal('hide');
    carregarInfoMapa(processo);
    plotar(mapa);
}

function formatarData(data){
	var today = new Date(data);
	var dd = today.getDate();

	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	if(dd<10) 
	{
	    dd='0'+dd;
	} 

	if(mm<10) 
	{
	    mm='0'+mm;
	} 

	return dd+'/'+mm+'/'+yyyy;
}