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

    $(this).closest('div')
      .toggleClass('editableBubble contactBubble')
      .attr('onclick');

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

  $('.delete').click(function(){
    $.post('/delete', { 'id': $(this).closest('div')[0].id }, function(){
    });
    $(this).closest('li').next().remove();
    $(this).closest('div').remove();
  });


});

//Make a model snd send via Post to server to store in DB
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

  $.post('/contacts', function(results){
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
// ---- End Google Maps Stuff ----
