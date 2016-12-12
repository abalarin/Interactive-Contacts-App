var map;
function initMap(location) {
  if(!location){
    location = {lat: 41.08394699999999, lng: -74.176609}
  }
    map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 10
  });

  $.post('/contacts', function(results){
    console.log(results);
    size= results.data.length;
    for (var i = 0; i < size; i++){
      lat = results.data[i].Coordinates[0].lat;
      lng = results.data[i].Coordinates[1].lon;
      var latLng = new google.maps.LatLng(lat, lng);
      var marker = new google.maps.Marker({
        position: latLng,
        zoom: 10,
        animation: google.maps.Animation.DROP,
        map: map
      });
    }
  });
}
function centerMap(lat, lon) {
    var location = {
      'lat': lat,
      'lng': lon
    }
    map.setCenter(location);
}
