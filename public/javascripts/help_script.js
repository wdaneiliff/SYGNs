//****** JQUERY FUNCTIONS AND FUNCTION CALL AT PAGE LOAD ********
$(document).ready(function() {

  // DELETE COOKIE FUNCTION UPON LOGGING :
  function delete_cookie( name ) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  //*** APPEND SIGNUP OR LOG OUT BUTTON TO NAV DEPENDING IF COOKIES PRESENT:
  var ul = $('.nav-tabs');
  if(document.cookie.indexOf("token") >= 0) {
    console.log("cookie here");
    ul.append('<li> <a href="/login" class="logout"> Logout </a> <li>');

    //CREATE LOG OUT LISTENER FOR APPENDED LOGOUT TAB IN NAVBAR:
    $('.logout').on('click', function(){
      delete_cookie('token');
    });
  } else{
    ul.append('<li> <a href="/signup" class="logout"> Sign up </a> <li>');
  }

}); //CLOSE JQUERY ON PAGE LOAD FUNCTION
