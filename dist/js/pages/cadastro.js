var cadastro = true;

 $(document).ready(function(){
    $("#valorDeclarado").inputmask('decimal', {
                'alias': 'numeric',
                'groupSeparator': '.',
                'autoGroup': true,
                'digits': 2,
                'radixPoint': ",",
                'digitsOptional': false,
                'allowMinus': false,
                'placeholder': ''
    });
  });

$( window ).on('load', function() {
  $( "#selectTipo" ).on('change', function() {
	  var valor = $( "#selectTipo" ).val();
	  if(valor == 'residencial'){
	  	 $("#cadResidencial").css("display", "");
	  }else{
	  	 $("#cadResidencial").css("display", "none");
	  }
  });
});


function cadastrarImovel(){
  var ok = true;
  if( $("#cidade").val() == ""){
    ok = false;
    $("#cidade").addClass("is-invalid");
  }else{
  	$("#cidade").removeClass("is-invalid");
  }

  if( $("#logradouro").val() == ""){
    ok = false;
    $("#logradouro").addClass("is-invalid");
  }else{
  	$("#logradouro").removeClass("is-invalid");
  }
  
  if( $("#bairro").val() == ""){
    ok = false;
    $("#bairro").addClass("is-invalid");
  }else{
    $("#bairro").removeClass("is-invalid");
  }

  if( $("#nome").val() == ""){
    ok = false;
    $("#nome").addClass("is-invalid");
  }else{
    $("#nome").removeClass("is-invalid");
  }

  if( $("#valorDeclarado").val() == ""){
    ok = false;
    $("#valorDeclarado").addClass("is-invalid");
  }else{
    $("#valorDeclarado").removeClass("is-invalid");
  }

   if( $("#tamanho").val() == ""){
      ok = false;
      $("#tamanho").addClass("is-invalid");
    }else{
      $("#tamanho").removeClass("is-invalid");
    }

     if( maskToNumber($("#valorDeclarado").val()) == 0){
      ok = false;
      $("#valorDeclarado").addClass("is-invalid");
    }else{
      $("#valorDeclarado").removeClass("is-invalid");
    }

  if( $( "#selectTipo" ).val() == "residencial"){
   
    if( $("#suites").val() == ""){
      ok = false;
      $("#suites").addClass("is-invalid");
    }else{
      $("#suites").removeClass("is-invalid");
    }
    if( $("#quartos").val() == ""){
      ok = false;
      $("#quartos").addClass("is-invalid");
    }else{
      $("#quartos").removeClass("is-invalid");
    }
    if( $("#banheiros").val() == ""){
      ok = false;
      $("#banheiros").addClass("is-invalid");
    }else{
      $("#banheiros").removeClass("is-invalid");
    }
  }

  

  

  if(ok){
  	var endereco = encodeURI($("#logradouro").val())+"-"+encodeURI($("#cidade").val())+"-"+encodeURI($("#bairro").val())+"-"+$("#selectUF").val()+"-Brazil";
    getLatLongAdress(endereco, processarMapa);
    
  }

}

function processoCadastrarImovel(){
  modalLoad();
}

function modalClose(){
	$('#modal-load').modal('hide');
	$('#modal-corretor').modal('show');
}

function modalLoad(){
       $('#modal-load').modal('show');
       	 setTimeout(function () {
         modalClose();
       }, 3000);
}


function processarMapa(objImovel){
  
  var preco = corretorIA(parseInt($("#banheiros").val()),
                       parseInt($("#quartos").val()),
                       parseInt($("#tamanho").val()),
                       objImovel.latitude,
                       objImovel.longitude,
                       parseInt($("#suites").val()));
  
  //$("#numeroProcesso").html(processo.id_imoveis);
  
  objImovel["nome"] = $("#nome").val();

  objImovel["street"] = $("#logradouro").val();

  objImovel["businesstype"] = $("#selectTipo").val();
  
  objImovel["declared_price"] =  maskToNumber($("#valorDeclarado").val());

  objImovel["divida"] =  maskToNumber($("#valorDeclarado").val());
  
  objImovel["city"] = $("#cidade").val();

  objImovel["state"] = $("#selectUF").val();

  objImovel["price"] = preco;

  objImovel["createdat"] = new Date();

  objImovel["final_date"] = new Date();

  objImovel["totalareas"] = parseInt($("#tamanho").val());

  objImovel["suites"] = parseInt($("#suites").val());

  objImovel["bedrooms"] = parseInt($("#quartos").val());

  objImovel["bathrooms"] = parseInt($("#banheiros").val());

  objImovel["parkingspaces"] = parseInt($("#vagas").val());

  
  carregarDataSetImoveis(objImovel.latitude, objImovel.longitude);
  objImovel["price_m2"] = getValorMedioMetroQuadrado();
  principal = objImovel;
  criarMarcadorPrincipal(objImovel);
  plotar(mapa);

  $("#precoSugerido").html(numeral(preco).format('$ 0,0.00'));

  $("#valorMetroQuadrado").html(numeral(objImovel.price_m2).format('$ 0,0.00'));

  cadastrarImovelService(objImovel);
}

function corretorIA(banheiros,quartos,tamanho,latitude,longitude,suites){
  var retorno = null;
  var obj = {
      "instances":[
        [banheiros,quartos,tamanho,latitude,longitude,suites]
      ]
    }
    $.ajax({
        url: 'http://173.255.203.115/api',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        async:false,
        dataType: 'json',
    }).done(function(data) {
      retorno = data.predictions[0];
    });
    return retorno;
}

function cadastrarImovelService(objImovel){
  var send = {
    "nome": objImovel.nome,
    "divida": objImovel.divida,
    "city": objImovel.city,
    "state": objImovel.state,
    "street": objImovel.street,
    "latitude": objImovel.latitude,
    "longitude": objImovel.longitude,
    "businesstype": "RESIDENTIAL",
    "declared_price": objImovel.declared_price,
    "price": objImovel.price,
    "usableareas": objImovel.totalareas,
    "bedrooms": objImovel.bedrooms,
    "bathrooms": objImovel.bathrooms,
    "suites": objImovel.suites,
    "parkingspaces": objImovel.parkingspaces,
    "rate": getRandomInt(27,83),
    "createdat": "2010-11-16",
    "final_date": "2022-12-01",
    "price_m2": objImovel.price_m2
  }

   var url = "http://139.64.244.144:3000/imoveis";
    $.ajax({
          type: "POST",
          url: url,
          data: send,
      }).done(function(data){
        console.log(data);
      });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function maskToNumber(text){
  text = text.replaceAll(".", "");
  text = text.replaceAll(",", ".");
  return parseFloat(text);
}