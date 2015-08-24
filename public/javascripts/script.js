//BOOTSTRAP TOGGLE HIDE/SHOW PASSWORD FIELD FUNCTION:
function showPassword() {
    var key_attr = $('#key').attr('type');

    if(key_attr != 'text') {
        $('.checkbox').addClass('show');
        $('#key').attr('type', 'text');
    } else {
        $('.checkbox').removeClass('show');
        $('#key').attr('type', 'password');
    }
}

//******* JQUERY ON PAGE LOAD FUNCTION ********
$(document).ready(function() {

  //FLASH MESSAGE TO USER "LOG IN TO CONTINUE":
  var flash = $('.flash');
  flash.slideDown("slow", function(){
    setTimeout(function(){flash.slideUp('slow');},2500);
  });

  //DOM VARIABLES FOR LOG IN FORM:
  var loginButton = $('#btn-login');
  var email = $('#email');
  var password = $('#key');

  //SUBMIT FORM LISTENER AND FUNCTION:
  $('form').on('submit',function(evt){
    //NOTES: BOOTSTRAP WILL MAKE SURE FORM IS FILLED*
    event.preventDefault();

    //AJAX REQUEST TO AUTHENTICATE USER AND BE RE-ROUTED:
    $.ajax({
      method: "post",
      url: "/authenticate",
      data: JSON.stringify({email: email.val(), password: password.val()}),
      contentType: 'application/json; charset=UTF-8',
      dataType : 'json',
      success: function(data){
        console.log(data);
        //NOTES: TOKEN WILL COME BACK IN FORM OF COOKIE -SEE SERVER.JS

        //OTHER TOKEN HANDLERS NOT BEING USED IN THIS APP:
        // localStorage.setItem('userToken', data.access_token);
        // $.ajaxSetup({
        //     headers: { 'x-access-token': localStorage['userToken'] }
        // });

        //REDIRECT IF SERVER RESPONSE HAS REDIRECT KEY IN JSON:
        if(data.redirect){
          window.location.href = data.redirect;
        }
      }
    });
  });

  // DELETE COOKIE FUNCTION UPON LOGGING OUT:
  function delete_cookie( name ) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  //*** APPEND LOG IN OR LOG OUT BUTTON TO NAV DEPENDING IF COOKIES PRESENT:
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
