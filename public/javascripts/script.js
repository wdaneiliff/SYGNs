
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
  var flash = $('.flash');
  flash.slideDown("slow", function(){
    setTimeout(function(){flash.slideUp('slow');},2500);
  });

  console.log("jquery loaded");

  var loginButton = $('#btn-login');
  var email = $('#email');
  var password = $('#key');


  $('form').on('submit',function(evt){
    console.log("log in" + email.val() + password.val());

  //CHECK FOR VALUE IN FIRST NAME INPUT
    event.preventDefault();

    $.ajax({
      method: "post",
      url: "/authenticate",
      data: JSON.stringify({email: email.val(), password: password.val()}),
      contentType: 'application/json; charset=UTF-8',
      dataType : 'json',
      success: function(data){
        console.log(data);
        localStorage.setItem('userToken', data.access_token);
        $.ajaxSetup({
            headers: { 'x-access-token': localStorage['userToken'] }
        });
        if(data.redirect){
          window.location.href = data.redirect;
        }
      }
    });
  });

});
