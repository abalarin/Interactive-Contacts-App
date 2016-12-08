var map;
function initMap(location) {
  if(!location){
    location = {lat: 41.08394699999999, lng: -74.176609}
  }
    map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 10
  });
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
}
function centerMap(lat, lon) {
    var location = {
      'lat': lat,
      'lng': lon
    }
    map.setCenter(location);
}

function addPoint(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
}
