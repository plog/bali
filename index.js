// Open places and get categories and initialize "overlays" by Category
// https://react-leaflet.js.org/docs/example-events/
// https://github.com/jazzband/geojson#feature

var overlays = {}
var geoData = {};

const xhr = new XMLHttpRequest()
xhr.onreadystatechange = () => {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    const res = JSON.parse(xhr.responseText)
    for (const key in res) {
        $("#buttons").append('<button class="btn btncat btn-sm categories btn-outline-secondary" data-layer="'+key+'" type="button">'+key+'</button>');
        //$("#buttons").append('<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"><label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label></div>');
        overlays[key]=L.layerGroup();
    }
  }
}
xhr.open("GET", "places.json", true)
xhr.setRequestHeader("Accept", "application/json")
xhr.send(null)

function getPin(latlng,color){
  // let color = '#008000';
  let icon = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><g id='layer1'><g transform='matrix(.18403 0 0 .17534 214.35 -157.87)'><path d='m-995.72 1225.8c-0.2729-0.7794-1.645-6.0275-3.049-11.662-4.441-17.823-12.122-36.988-22.546-56.255-5.9844-11.061-7.0667-12.824-24.551-40-28.252-43.911-33.217-56.241-32.173-79.89 0.9573-21.672 8.2717-37.909 24.149-53.61 13.179-13.032 27.807-20.549 45.601-23.432 44.097-7.1446 86.878 21.883 95.546 64.828 2.0208 10.012 1.5723 27.243-0.95271 36.604-2.77 10.269-13.883 31.045-29.589 55.315-28.348 43.807-39.082 65.687-47.119 96.05-3.1117 11.755-4.3985 14.673-5.3161 12.052z' style='stroke:#5a0000;stroke-width:5.7;fill:"+color+"'/><path style='stroke-width:0;fill:#ffffff' d='m-962.86 1042.4c0 16.568-14.071 30-31.429 30-17.357 0-31.429-13.432-31.429-30 0-16.569 14.071-30 31.429-30s31.429 13.431 31.429 30z' transform='matrix(1.0955 0 0 1.0955 94.909 -88.07)'/></g ></g></svg>";
  let svgURL = "data:image/svg+xml;base64," + btoa(icon);
  let customIcon = L.icon( {
    iconUrl: svgURL,
    iconSize: [40, 40],
    shadowSize: [12, 10],
    iconAnchor: [20, 40],
    popupAnchor: [5, -5]
  } );
  let markerOptions = { title: "Here", clickable: false, draggable: false, icon: customIcon }
  return L.marker(latlng, markerOptions)
}

function onLocationFound(e) {
  var newCustomIcon = L.icon({ iconUrl: "here.png", iconSize: [35, 35], iconAnchor: [22, 50] })
  var markerOptions = { title: "Here", clickable: false, draggable: false, icon: newCustomIcon }
  L.marker(e.latlng, markerOptions).addTo(map)
}

function getCategory(props) {
  if (props.category) {
    for (const key in overlays) {
      if (props.category == key) return overlays[key]
    }
  }
}

function onLocationError(e) {
  console.log(e.message)
}

function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    let link = feature.properties.link
    let linkTxt = '<br><br><center><a href="' + link + '" target="_blank"><img src="map.png" width="30"></a></center>'
    let title = "<h2>" + feature.properties.popupContent + "</h2>"
    let cat = getCategory(feature.properties)
    //console.log(feature.properties, cat)
    layer.bindPopup(title + linkTxt, { permanent: true, className: "class-tool" })
    layer.bindTooltip(feature.properties.name, { permanent: true, className: "tooltip" })
    layer.addTo(cat)
  }
}

// Creating map options
var mapOptions = { center: [-8.45, 115.1], zoom: 10 }
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
var mbUrl = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"

var grayscale   = L.tileLayer(mbUrl, { id: "mapbox/light-v9", tileSize: 512, zoomOffset: -1, attribution: mbAttr })
var streets     = L.tileLayer(mbUrl, { id: "mapbox/streets-v11", tileSize: 512, zoomOffset: -1, attribution: mbAttr })
var satellite   = L.tileLayer(mbUrl, { id: "mapbox/satellite-v9", tileSize: 512, zoomOffset: -1, attribution: mbAttr })
var baseLayers  = { Grayscale: grayscale, Streets: streets }
var map = L.map("map", { center: [-8.45, 115.1], zoom: 9, layers: [streets] })
var layerControl = L.control.layers(baseLayers).addTo(map)
layerControl.addBaseLayer(satellite, "Satellite")

map.on("locationfound", onLocationFound)
map.on("locationerror", onLocationError)
map.locate({ setView: false, maxZoom: 14 })

map.on('click', function(e){
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    //console.log(lng + "," + lat);
    });


//Geo
let url = "features.geojson";
$.getJSON(url, function (data) {
  let x = L.geoJson(data, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      let color = feature.properties.color
      return getPin(latlng,color)
    },
  })
})

//Events
$("body").on("click", "#Btn1", function(event){ $(".leaflet-tooltip-pane").toggle();})

$("body").on("click", "#Btn2", function(event){ $("#Modal").modal("show"); })

$("body").on("click", "#Btn3", function(event){
    $("#map").toggleClass('expanded', 500);
    setTimeout(function(){map.invalidateSize(false);}, 700); //I know...
});

$("body").on("change", ".placelist", function(event){
  const lat = $(this).data("lat");
  const lng = $(this).data("lng");
  if($(this).is(':checked')){
    map.setView(new L.LatLng(lat,lng), 14);
  }
});

$("body").on("click", ".categories", function(event){
  var layer = $(this).data("layer")
  layer = overlays[layer]
  if (map.hasLayer(layer)) {
    $(this).removeClass("active")
    map.removeLayer(layer)
    layer.eachLayer(function(p){
      const key = p.feature.geometry.coordinates[0]+'|'+p.feature.geometry.coordinates[1]
      delete geoData[key]
    });
  } else {
    map.addLayer(layer)
    $(this).addClass("active")
    layer.eachLayer(function(p){
      const key = p.feature.geometry.coordinates[0]+'|'+p.feature.geometry.coordinates[1]
      geoData[key]=p.feature
    });
  }
  console.log(geoData)

  $("#fixaccordion").html('');
  for (const key in geoData) {
    const marker = geoData[key];
    const cat = marker.properties.category;
    const content = marker.properties.popupContent;
    const lat = marker.geometry.coordinates[1]
    const lng = marker.geometry.coordinates[0]
    const swtch = '<div class="placelistcontainer form-check form-switch"><input data-lat='+lat+' data-lng='+lng+' class="form-check-input placelist" type="checkbox"/><label class="form-check-label" for="flexSwitchCheckDefault">' + cat + ' - ' + content + '</label></div>'
    $("#fixaccordion").append(swtch)
  }

})

$(window).on('load', function(){ 
  // do something
});
