$( document ).ready(function() {

  // DELETE COOKIE FUNCTION UPON LOGGING OUT
  function delete_cookie( name ) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  
  // APPEND LOG IN OR LOG OUT BUTTON TO NAV
  var ul = $('.nav-tabs');
  if(document.cookie.indexOf("token") >= 0) {
    console.log("cookie here");
    ul.append('<li> <a href="/login" class="logout"> Logout </a> <li>');

    var cookie = $('.logout');
    cookie.on('click', function(){
      delete_cookie('token');
    });
  }else{
    ul.append('<li> <a href="/signup" class="logout"> Sign up </a> <li>');
  }




});
