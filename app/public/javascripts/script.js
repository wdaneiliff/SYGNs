
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

$( document ).ready(function() {

  console.log("jquery loaded");

  var loginButton = $('#btn-login');
  var email = $('#email');
  var password = $('#key');

  loginButton.on('click', function(){
    console.log("log in" + email.val() + password.val());

  //   $.ajax({
  //     type: "post",
  //     url: "/login",
  //
  //   });
  });


});
