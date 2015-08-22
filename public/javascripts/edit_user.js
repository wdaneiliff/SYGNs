//****** JQUERY FUNCTIONS AND FUNCTION CALLS AT PAGE LOAD ********
$(document).ready(function() {

  //DOM VARIABLES TO UPDATE USER INFO:
    var firstName = $("#firstName");
    var lastName = $("#lastName");
    var email = $("#email");
    var password = $("#key");

  //IMMEDIATE AJAX CALL TO FILL USER ACCOUNT INFO:
  $.ajax({
    method: "get",
    url: "/users/placeholder", //WILL BE USING TOKEN TO FIND USER IN CONTROLLER
    success: function(data){
      console.log(data);
      firstName.val(data.firstName);
      lastName.val(data.lastName);
      email.val(data.email);
    }
  });

  //CHECK TO MAKE SURE FORM IS COMPLETED & PASSWORD CONFIRM MATCHES:
  $('form').on('submit',function(){

      //CHECK FOR VALUE IN FIRST NAME INPUT
      if(!firstName.val()){
          event.preventDefault();
          return alert('Please Enter Your First Name');
      }

      //CHECK FOR VALUE IN LAST NAME INPUT
      if(!lastName.val()){
          event.preventDefault();
          return alert('Please Enter Your Last Name');
      }

      //CHECK FOR VALUE IN EMAIL INPUT
      if(!email.val()){
          event.preventDefault();
          return alert('Please Enter Your Email');
      }

      //CHECK FOR VALUE IN PASSWORD INPUT
      if(!password.val()){
          event.preventDefault();
          return alert('Please Enter a Password');
      }

      //CONFIRM PASSWORD CHECK
      if( $('#key').val() != $('#pwkey').val() ){
          alert('Password does not match');
          event.preventDefault();
          return false;
      }

      event.preventDefault();

      //AJAX REQUEST TO PATCH USER:
      $.ajax({
        method: "patch",
        url: "/users/" + email.val(), //WILL BE USING TOKEN TO FIND USER
        data: JSON.stringify({  firstName: firstName.val(),
                                lastName: lastName.val(),
                                email: email.val(),
                                password: password.val()
                            }),
        contentType: 'application/json; charset=UTF-8',
        dataType : 'json',
        success: function(data){
            console.log(data);

            //REDIRECT IF SERVER RESPONSE HAS REDIRECT KEY:
            if(data.redirect){
                window.location.href = data.redirect;
            }
        }
      });
    }); //CLOSE FORM SUBMIT LISTENER AND FUNCTION


  //DELETE BUTTON LISTENER AND AJAX REQUEST TO DELETE USER
  $('#btn-delete').on('click',function(){
      event.preventDefault();

      //AJAX REQUEST TO DELETE USER:
      $.ajax({
          method: "delete",
          url: "/users/" + email.val(),
          success: function(data){
            delete_cookie('token');
            console.log(data);
            if(data.redirect){
              window.location.href = data.redirect;
              }
            }
        }); //CLOSE AJAX DELETE REQUEST
  }); //CLOSE DELETE USER LISTENER AND FUNCTION


  // DELETE COOKIE FUNCTION UPON LOGGING OUT:
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
