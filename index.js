var cities      = L.layerGroup();
var temples     = L.layerGroup();
var snack       = L.layerGroup();
var breakfast   = L.layerGroup();
var coffee      = L.layerGroup();
var diner       = L.layerGroup();
var chic        = L.layerGroup();
var paysage     = L.layerGroup();
var ambiance    = L.layerGroup();
var coiffeur    = L.layerGroup();
var hotel       = L.layerGroup();
var sport       = L.layerGroup();
var shopping    = L.layerGroup(); 
var overlays = {
    'Cities'    : cities   ,
    'Temples'   : temples  ,
    'Snack'     : snack    ,
    'Breakfast' : breakfast,
    'Coffee'    : coffee   ,
    'Diner'     : diner    ,
    'Chic'      : chic     ,
    'Paysage'   : paysage  ,
    'Ambiance'  : ambiance ,
    'Coiffeur'  : coiffeur ,
    'Hotel'     : hotel    ,
    'Sport'     : sport    ,
    'Shopping'  : shopping 
};

function onLocationFound(e) {
    var radius = e.accuracy*30;
    L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
    L.circle(e.latlng, radius).addTo(map);
}

function getCategory(props){
    if (props.category) {
        for (const key in overlays) {
            if(props.category==key) return overlays[key];
        }
    }
}

function onLocationError(e) {
    console.log(e.message);
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        console.log(getCategory(feature.properties))
        let link = feature.properties.link
        let linkTxt = '<br><br><center><a href="'+link+'" target="_blank"><img src="map.png" width="30"></a></center>'
        layer.bindPopup(feature.properties.popupContent + linkTxt,{permanent: true,className: 'class-tool'});
        layer.bindTooltip(feature.properties.name,{permanent: true,className: 'class-popup'});
        layer.addTo(getCategory(feature.properties))
    }
}        

// Creating map options
var mapOptions = {center: [-8.450000, 115.1],zoom: 10}
//var mLitton = L.marker([-8.450000, 115.1]).bindPopup('This is Littleton, CO.').addTo(cities);

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
var streets   = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
var satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
var baseLayers = {'Grayscale': grayscale,'Streets': streets};
var map = L.map('map', {center: [-8.450000, 115.1],zoom: 10,layers: [grayscale, paysage]});
var layerControl = L.control.layers(baseLayers, overlays).addTo(map);
layerControl.addBaseLayer(satellite, 'Satellite');
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);    
map.locate({setView: false, maxZoom: 16});

//Geo
let url = "features.geojson";
$.getJSON(url,function(data){
    let x = L.geoJson(data,{onEachFeature: onEachFeature}).addTo(map);
    console.log(x)
})

$("#paysage").click(function(event) {
    console.log('click')
    event.preventDefault();
    if(map.hasLayer(paysage)) {
        $(this).removeClass('selected');
        map.removeLayer(paysage);
    } else {
        map.addLayer(paysage);
        $(this).addClass('selected');
    }
});
