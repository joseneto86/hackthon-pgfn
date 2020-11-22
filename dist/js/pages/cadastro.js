var cadastro = true;

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

  if(ok){
  	var endereco = $("#logradouro").val()+"-"+$("#cidade").val()+"-"+$("#selectUF").val()+"-brazil";
  	getLatLongAdress(endereco);
  }
}


function animarMapa(){
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