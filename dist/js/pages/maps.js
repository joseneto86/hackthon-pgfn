var principal = {latitude: -5.873076, longitude: -35.179377}
var mapa = carregarMapa(principal);
var currentMarkers = Array();
var flying = false;
var dataSet = Array();

function carregarDataSetImoveis(latitude, longitude, callback){
   var url = "http://139.64.244.144:3000/anuncio/"+latitude+"/"+longitude;
   dataSet = Array();
   $.ajax({
        type: "GET",
        //headers: {"Access-Control-Allow-Origin": "*"},
        url: url,
        async:false,
        success: function (result) {
           dataSet = result;
           if(callback)
             callback();
        }
    });
}

function getValorMedioMetroQuadrado(){
    var totalValorImoveis = 0;
    var totalMetros = 0;
    
    dataSet.forEach(function(processo, index){
      if( ! isNaN(parseFloat(processo.price)) &&  ! isNaN(parseInt(processo.totalareas))){
        totalValorImoveis += parseFloat(processo.price);
        totalMetros += parseInt(processo.totalareas);
      }
    });

    return totalValorImoveis/totalMetros;
  }

function getList(){
	return dataSet;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}




function plotar(){
    var imoveis = getList();
    for(var i = 0; i < imoveis.length; i++){
        var obj = imoveis[i];
        if(obj.image == undefined || obj.image == ''){
            obj["image"] = "dist/img/sem_foto.png"
        }
        var marker = new mapboxgl.Marker()
        .setLngLat([imoveis[i].longitude, imoveis[i].latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(getHtmlPopUp(obj.latitude, obj.longitude, "bg-primary", obj.image , obj.price, obj.businesstype, obj.totalareas, obj.bedrooms, obj.bathrooms, obj.suites)))
        .addTo(mapa);

        currentMarkers.push(marker);
    }
    
}

function plotarImoveisPgfn(imoveis){
    for(var i = 0; i < imoveis.length; i++){
        var obj = imoveis[i];
        if(obj.image == undefined || obj.image == ''){
            obj["image"] = "dist/img/sem_foto.png"
        }
        var marker = new mapboxgl.Marker({ "color": "#FF0000" })
        .setLngLat([imoveis[i].longitude, imoveis[i].latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(getHtmlPopUp(obj.latitude, obj.longitude, "bg-warning", obj.image , obj.price, obj.businesstype, obj.usableareas, obj.bedrooms, obj.bathrooms, obj.suites)))
        .addTo(mapa);

        currentMarkers.push(marker);
    }
}


function carregarMapa(principal){
    var idmap = "mapbox"+Math.random();
    var divMapa = document.createElement("div");
    divMapa.id= idmap
    divMapa.style.width = "100%";
    divMapa.style.height = "100%";
    $("#map_container").append(divMapa);

    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zZW5lb3Q4NiIsImEiOiJja2hya2s0MTQwNDJ2MnhtdG40cG04a2N6In0.psvtQBLB4cxYDsEv7pW16Q';

    var map = new mapboxgl.Map({
        container: idmap,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [principal.longitude, principal.latitude],
        zoom: 14
    });

    map.addControl(new mapboxgl.FullscreenControl());

    map.on('flystart', function(){
        flying = true;
    });
    
    map.on('flyend', function(){
        flying = false;
    });

    map.on('moveend', function(e){
     if(flying){
        map.fire('flyend');
        animarMapa();
     }
    });


    return map;
}



function getLatLongAdress(adress, callback){
    adress = adress.replaceAll(" ", "-");
    var retorno = null;
    $.get( "https://api.mapbox.com/geocoding/v5/mapbox.places/"+adress+".json?limit=1&access_token=pk.eyJ1IjoiY3Bhc2NvIiwiYSI6ImNraHFxdHU2NDBwcWQycHFsMmNkYXZhcGwifQ.MVjt_K2VX36okbnzXlkgPg", function( data ) {
      coord = data.features[0].center;
      var obj =  {"tamanho": 89, "tipo":"Residencial", "valor":258500.00}
      obj["latitude"] = coord[1];
      obj["longitude"] = coord[0];
      
      if(callback)
        callback(obj);
    });

    
}

function criarMarcadorPrincipal(obj){
     if(obj.image == undefined || obj.image == ''){
         obj["image"] = "dist/img/sem_foto.png"
     }
     var marker = new mapboxgl.Marker({ "color": "#FF0000" })
      .setLngLat([obj.longitude, obj.latitude])
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(getHtmlPopUp(obj.lat, obj.longitude, "bg-warning", obj.image, obj.price, obj.businesstype, obj.usableareas, obj.bedrooms, obj.bathrooms, obj.suites)))
      .addTo(mapa);

      currentMarkers.push(marker);
    
      mudarLocalizacao(mapa, obj.latitude, obj.longitude);
}

function mudarLocalizacao(map, latitude, longitude){
    map.flyTo({
        center: [
            longitude, latitude
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    map.fire('flystart');
}

function carregarInfoMapa(processo){
    $('#modalMapa').on('shown.bs.modal', function () { // chooseLocation is the id of the modal.
      mapa.resize();
    });

    $('#modalMapa').modal('show');

    removerTodosMarcadores();
  
    principal = processo;
    criarMarcadorPrincipal(processo);
    plotar(mapa);

}


function animarMapa(){
  if(typeof cadastro !== 'undefined' && cadastro){
    processoCadastrarImovel();
  }
      
}

function getHtmlPopUp(lat, lon, classe, img, valor, tipo, tamanho, quartos, banheiros, suites){
     var val = valor +"";
     if( val.indexOf("R$") == -1)
       valor = numeral(valor).format('$ 0,0.00');

     img = img.replace("{action}", "crop");
     img = img.replace("{width}x{height}", "420x236");

     var html = '<div class="row" sytle="margin-top:10px">';
         html +='  <div class="col-8">';
         html +='       <div class="position-relative">';
         html +='           <img src="'+img+'" alt="Photo 2" class="img-fluid">';
         html +='               <div class="ribbon-wrapper ribbon-xl">';
         html +='                   <div class="ribbon '+classe+' text-lg">'+valor+'</div>';
         html +='                </div>';
         html +='         </div>';
         html +='    </div>';
         html +='    <div class="col-4">';            
         html +='       <strong><i class="fas fa-expand"></i> Área</strong>';
         html +='       <p class="text-muted">'+tamanho+'</p>';
         html +='       <strong><i class="fas fa-bed"></i> Quartos</strong>';
         html +='       <p class="text-muted">'+quartos+'</p>';
         html +='       <strong><i class="fas fa-shower"></i> Banheiros</strong>';
         html +='       <p class="text-muted">'+banheiros+'</p>';
         html +='       <strong><i class="fas fa-bath"></i> Suítes</strong>';
         html +='       <p class="text-muted">'+suites+'</p>';
         html +='     </div>';
         html +='</div>';
         return html;
}



function removerTodosMarcadores(){
  if(currentMarkers.length > 0){
    for (var i = currentMarkers.length - 1; i >= 0; i--) {
      currentMarkers[i].remove();
    }
  }
}















