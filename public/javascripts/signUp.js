//***** JQUERY LOAD FUNCTIONS ON PAGE LOAD ****
$( document ).ready(function() {

  //DOM FORM VARIABLES:
    var firstName = $('#firstName');
    var lastName = $('#lastName');
    var email = $('#email');
    var password = $('#key');
    var confirmPass = $('#pwkey');

  //SUBMIT FORM LISTENER AND FUNCTION:
  $('form').on('submit',function(){

    //CHECK FOR VALUE IN FIRST NAME INPUT
      if( !$('#firstName').val()){
          event.preventDefault();
          return alert('Please Enter Your First Name');
      }

    //CHECK FOR VALUE IN LAST NAME INPUT
      if( !$('#lastName').val()){
          event.preventDefault();
          return alert('Please Enter Your Last Name');
      }

    //CHECK FOR VALUE IN EMAIL INPUT
      if( !$('#email').val()){
          event.preventDefault();
          return alert('Please Enter Your Email');
      }

    //CHECK FOR VALUE IN PASSWORD INPUT
      if( !$('#key').val()){
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

    //AJAX REQUEST TO POST NEW USER TO DATABASE:
       $.ajax({
         method: "post",
         url: "/users",
         data: JSON.stringify({firstName:firstName.val(),
                               lastName:lastName.val(),
                               email:email.val(),
                               password:password.val()
                             }),
         contentType: 'application/json; charset=UTF-8',
         dataType : 'json',
         success: function(data){
           console.log(data);
           if(data.redirect){
             window.location.href = data.redirect;
           }
         }
       });

  }); //CLOSE SUBMIT FORM LISTENER AND FUNCTION


  //DELETE COOKIE FUNCTION UPON LOGGING OUT:
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
