//$(function (){
//});

function isChecked(){
  if(!document.getElementById('chk1').checked) {
    $("#ContactMethod").append('<input name="ContactMail" value="false" hidden/>');
  }
  if(!document.getElementById('chk2').checked) {
    $("#ContactMethod").append('<input name="ContactPhone" value="false" hidden/>');
  }
  if(!document.getElementById('chk3').checked) {
    $("#ContactMethod").append('<input name="ContactEmai" value="false" hidden/>');
  }
}
// First Name                 (String)
// Last Name                 (String)
// Street                         (String)
// City                         (String)
// State                         (String)
// Zip                         (String)
// Phone                         (String)
// Email                         (String)
// Mr./Mrs./Ms./Dr.         (String)
// Contact By Mail        (Boolean)
// Contact By Phone        (Boolean)
// Contact BY Email         (Email)
