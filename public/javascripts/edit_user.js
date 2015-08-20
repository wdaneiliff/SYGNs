$(document).ready(function() {

    var firstName = $("#firstName");
    var lastName = $("#lastName");
    var email = $("#email");
    var password = $("#key");

  $.ajax({
    method: "get",
    url: "/users/placeholder",
    success: function(data){
      console.log(data);
      firstName.val(data.firstName);
      lastName.val(data.lastName);
      email.val(data.email);
    }
  });

    //CHECK TO MAKE SURE PASSWORD CONFIRM MATCHES
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

      console.log(" first name = " + firstName.val());
      console.log(" last name = " + lastName.val());
      console.log(" email = " + email.val());
      console.log(" password = " + password.val());

      event.preventDefault();

      $.ajax({
        method: "patch",
        url: "/users/" + email.val(),
        data: JSON.stringify({  firstName: firstName.val(),
                                lastName: lastName.val(),
                                email: email.val(),
                                password: password.val()
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
    });



    $('#btn-delete').on('click',function(){
        console.log(" delete clicked ");
        event.preventDefault();

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
        });
    });

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
