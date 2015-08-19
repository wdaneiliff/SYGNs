//console.log("edit user script");
$(document).ready(function() {

    var firstName = $("#firstName");
    var lastName = $("#lastName");
    var email = $("#email");
    var password = $("#key");

    $('#btn-login').on('click',function(){

        event.preventDefault();
        console.log(" first name = " + firstName.val());
        console.log(" last name = " + lastName.val());
        console.log(" email = " + email.val());
        console.log(" password = " + password.val());

        /*
        //CONFIRM PASSWORD CHECK
       if( $('#key').val() != $('#pwkey').val() ){
           alert('Password does not match');
            event.preventDefault();
           return false;
       }
       */

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
        console.log(" first name = " + firstName.val());
        console.log(" last name = " + lastName.val());
        console.log(" email = " + email.val());
        console.log(" password = " + password.val());

        //CONFIRM PASSWORD CHECK
       if( $('#key').val() != $('#pwkey').val() ){
           alert('Password does not match');
            event.preventDefault();
           return false;
       }


        $.ajax({
            method: "delete",
            url: "/users/" + email.val(),

            success: function(data){
                console.log(data);
                if(data.redirect){
                    window.location.href = data.redirect;
                }
            }
        });

    });




});
