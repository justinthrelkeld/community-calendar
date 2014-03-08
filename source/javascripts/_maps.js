function initMap(geoJson){
  var map = L.mapbox.map('map', 'justinthrelkeld.gi35hf5n');
  map.featureLayer.setGeoJSON(geoJson);
  
  window.eventClicked = function (e) {
    map.featureLayer.eachLayer(function(marker){
      var content = "<h1>" + marker.feature.properties.title + "</h1>" +
        "<p>" + marker.feature.properties.description + "</p>";
      
      marker.bindPopup(content);

  		if ('e' + marker.feature.properties.hash === e.id) {
  			map.panTo(marker.getLatLng());
  			marker.openPopup();
  		}
  	})
  }
}

