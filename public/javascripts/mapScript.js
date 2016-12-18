$('document').ready(function(){

  //On cick Edit run really long call back
  $('.edit').click(function(){
    $(this).closest('div')
      .toggleClass('contactBubble editableBubble')
      .removeAttr('onclick');
    //find all child elements after li of Edit/Save/Delete Buttons
    $(this).closest('div').children().siblings().each(function () {

      //Loop through all elements and turn on content-editable
      var list = $(this).find('p');
      for (var i = 0; i < list.length; i++) {
        if(list[i].id)
          $(list[i]).replaceWith("<select style='margin-right:5px;'> <option>Mr.</option> <option>Mrs.</option> <option>Ms.</option> <option>Dr.</option> </select>");
        else
          $(list[i]).attr("contenteditable", "true");
      }
    });

    //Show Edit/Delete Button and remove Edit Button
    $(this).next().show();        //Save
    $(this).next().next().show(); //Delete
    $(this).hide();               //Edit
  });

  // On click Save commit changes to server and turn of content-editable
  $('.save').click(function(){

    var lat = $(this).closest('div').find('.geoAddress').attr('value')
    var lng = $(this).closest('div').find('.geoAddress').attr('id')
    $(this).closest('div')
      .toggleClass('editableBubble contactBubble')
      .attr('onclick','centerMap(' + lat + ',' + lng + ')');

    //Get data from Contact Bubble and send to Server
    var data = $(this).closest('div').children().siblings()
    sendData(data, $(this).closest('div')[0].id);

    //Set all contenteditable attributes to false
    $(this).closest('div').children().siblings().each(function () {
      var list = $(this).find('p');
      for (var i = 0; i < list.length; i++) {
        $(list[i]).attr("contenteditable", "false");
      }
    });

    // Replace Options Dropdown with P element
    object = $(this).closest('li').next().find('select')[0];
    if(object){ //Error handler incase Dropdown doesnt exsist
      var val = object.value;
      $(this).closest('li').next().find('select').replaceWith('<p id="pref">'+val+' </p>');
    }

    //Hide Save/Delete Buttons and show Edit button
    $(this).hide();       //Save
    $(this).next().hide();//Delete
    $(this).prev().show();//Edit
  });

  // On click delete remove contact bubble from database then
  //  remove from contactBubble from the DOM.
  $('.delete').click(function(){
    var objectID = $(this).closest('div')[0].id;
    $.post('/delete', { 'id': objectID }, function(){});
    $(this).closest('div').remove();
  });

  //--Search Radius Logic--
  $('#search').click(function(){
    //initlize by hiding all contact bubbles
    $('.contactBubble').hide();

    //Get values from user input and geocode
    var address =  document.getElementById('searchAddress').value;
    var radius = document.getElementById('radius').value;
    var jax = $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=?' + address);

    // When Geocode is finished get coords and center map
    jax.done(function(data){
      var location_json = data.results[0].geometry.location;
      centerMap(location_json.lat, location_json.lng);

      //Search each contact bubble for its Coordinates
      $( ".geoAddress" ).each(function(index){
        var lat = $(this).attr("value")
        var lng = $(this).attr("id")

        if(lat && lng){//check for valid coordinates

          // find distance between coordinates
          var dist = distance(location_json.lat, location_json.lng, lat, lng);
          if(parseInt(radius) > dist){

            //If within radius show this contact bubble
            $(this).closest('div').show();
          }
        }
      });
    });
  });

  //Search Logic -on each keystrok filter
  $(document).on('keyup', '#searchName', function(){
    var input = document.getElementById('searchName').value;

    //--if match hide non matches and show matches
    $('.searchableName:contains(' + input + ')').closest('div').show();
    $('.searchableName:not(:contains(' + input + '))').closest('div').hide();
    //If input field empty show all contactBubbles
    if(input == '')
      $('.contactBubbles').show();
  });

  $('#name').click(function(){
    $('#address').hide();
    $('#name').hide();
    $('#searchName').show();
    $('.back').show();
  });
  $('#address').click(function(){
    $('#address').hide();
    $('#name').hide();
    $('#searchAddress').show();
    $('#radius').show();
    $('#search').show();
    $('.back').show();
  });
  $('.back').click(function(){
    $(this).hide();
    $('#search').hide();
    $('#searchName').hide();
    $('#searchAddress').hide();
    $('#radius').hide();
    $('#name').show();
    $('#address').show();
    $('.contactBubble').show()
  });

});

//Make a model and send via Post to server to store in DB
function sendData(data, id, rm){
  console.log(data);
  var model = {
    'id' : id,
    'Preferance': data[1].firstElementChild.value,
    'First': data[1].firstElementChild.nextSibling.textContent,
    'Last': data[1].lastElementChild.textContent,
    'Street': data[2].firstElementChild.textContent,
    'City': data[2].lastElementChild.textContent,
    'State': data[3].firstElementChild.textContent,
    'Zip': data[3].lastElementChild.textContent,
    'Phone': data[4].firstElementChild.textContent,
    'Email': data[4].lastElementChild.textContent,
  };
  $.post('/save', model, function(results){
  });
}

//--- Init and functions for google maps API ---
var map;
function initMap(location) {
  if(!location){
    location = {lat: 41.08394699999999, lng: -74.176609}
  }
    map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 10
  });

  //Get list of contacts from contact route and add googlepins
  $.post('/contacts', function(results){
    size= results.data.length;
    for (var i = 0; i < size; i++){
      data = results.data[i];
      lat = data.Coordinates[0].lat;
      lng = data.Coordinates[1].lon;

      var contentString = '<div><h2 style="font-size:15px;">'+ data.First +' '+ data.Last +'</h2></div>'+
      '<div><p>'+data.Phone+'</br>'+data.Email+'</p></div>';
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var latLng = new google.maps.LatLng(lat, lng);
      var marker = new google.maps.Marker({
        position: latLng,
        zoom: 10,
        animation: google.maps.Animation.DROP,
        map: map,
        infowindow: infowindow
      });

      google.maps.event.addListener(marker, 'click', function() {
        console.log(this);
        console.log(google.maps);

        this.infowindow.open(map, this);
        google.maps.event.removeListener(listener);
      });
      google.maps.event.addListener(marker, 'mouseover', function() {
        this.infowindow.open(map, this);
      });
      var listener = google.maps.event.addListener(marker, 'mouseout', function() {
        this.infowindow.close(map, this);
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
// ---- End Google Maps Stuff ----


//-----Calculate Distnace between two geoPoints-----
function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}
