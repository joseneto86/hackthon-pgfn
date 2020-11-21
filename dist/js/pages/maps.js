var principal = {lat: -5.873076, lon: -35.179377}
var mapa = carregarMapa(principal);
var popup = null;

function getList(dataSet, principal){
	
	for(var i =0; i < dataSet.length; i++){
		var dist = distanceInKmBetweenEarthCoordinates(principal[0], principal[1],dataSet[i][0], dataSet[i][1]);
		dist = Math.round((dist + Number.EPSILON) * 100) / 100;
		dataSet[i]["distancia"] = dist;
	}
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

function carregarDataset(){
    var dataSet = [
    	{"id": 1, "lat": -23.54434, "lon":-46.70558, "tamanho": 98, "tipo":"residencial", "valor":300263.50},
    	{"id": 2, "lat":-23.55461, "lon":-46.69541, "tamanho": 150, "tipo":"residencial", "valor":900378.00},
    	{"id": 3, "lat":-23.53252, "lon":-46.70429, "tamanho": 57, "tipo":"residencial", "valor":100922.91}
        ];
    var lista = getList(dataSet, [principal.lat,principal.lon]);

    //var imoveis = listaToMap(lista);
    return lista;
}

function buscar(id){
    var lista = carregarDataset();
    for(var i = 0; i < lista.length; i++){
        if(id == lista[i].id){
            return lista[i];
        }
    }
}


function plotar(map){
    var imoveis = carregarDataset();

    for(var i = 0; i < imoveis.length; i++){
        var obj = imoveis[i];
        var marker = new mapboxgl.Marker()
        .setLngLat([imoveis[i].lon, imoveis[i].lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(getHtmlPopUp(obj.lat, obj.lon, "bg-primary", "dist/img/photo1.png", obj.valor)))
        .addTo(map);
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
        center: [principal.lon, principal.lat],
        zoom: 14
    });

    map.addControl(new mapboxgl.FullscreenControl());

    return map;
}



function getLatLongAdress(adress){
    //adress = adress.replaceAll(" ", "-");
    var retorno = null;
    /*$.get( "https://api.mapbox.com/geocoding/v5/mapbox.places/"+adress+".json?limit=1&access_token=pk.eyJ1IjoiY3Bhc2NvIiwiYSI6ImNraHFxdHU2NDBwcWQycHFsMmNkYXZhcGwifQ.MVjt_K2VX36okbnzXlkgPg", function( data ) {
      coord = data.features[0].center;
      var obj = {}
      obj["lat"] = coord[1];
      obj["lon"] = coord[0];
      
    });*/

    var obj = {"tamanho": 89, "tipo":"Residencial", "valor":258500.00}
    obj["lat"] = -23.55091;
    obj["lon"] = -46.701344;
    principal = obj;
    ajustarElementos(obj);
}

function ajustarElementos(obj){
     var marker = new mapboxgl.Marker({ "color": "#FF0000" })
      .setLngLat([obj.lon, obj.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(getHtmlPopUp(obj.lat, obj.lon, "bg-warning", "dist/img/photo2.png", obj.valor)))
      .addTo(mapa);
      
      plotar(mapa);
      mudarLocalizacao(mapa, obj.lat, obj.lon)
}

function mudarLocalizacao(map, lat, lon){
    map.flyTo({
        center: [
            lon, lat
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
}

function carregarInfoMapa(){
    //getLatLongAdress($("#endereco").val());
    getLatLongAdress($("#endereco").val());
}


function getHtmlPopUp(lat, lon, classe, img, valor){
     var html = '<div class="row" sytle="margin-top:10px">';
         html +='  <div class="col-8">';
         html +='       <div class="position-relative">';
         html +='           <img src="'+img+'" alt="Photo 2" class="img-fluid">';
         html +='               <div class="ribbon-wrapper ribbon-lg">';
         html +='                   <div class="ribbon '+classe+' text-lg">R$'+valor+'</div>';
         html +='                </div>';
         html +='         </div>';
         html +='    </div>';
         html +='    <div class="col-4">';            
         html +='       <strong><i class="far fa-building"></i> Tipo</strong>';
         html +='       <p class="text-muted">Residencial</p>';
         html +='       <strong><i class="fas fa-expand-arrows-alt"></i> Tamanho</strong>';
         html +='       <p class="text-muted">89m2</p>';
         html +='     </div>';
         html +='</div>';
         return html;
}











