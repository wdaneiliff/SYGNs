$( document ).ready(function() {

//CHECK TO MAKE SURE PASSWORD CONFIRM MATCHES
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
  if( !$('#password').val()){
      event.preventDefault();
      return alert('Please Enter a Password');
  }

//CONFIRM PASSWORD CHECK
   if( $('#key').val() != $('#pwkey').val() ){
       alert('Password does not match');
        event.preventDefault();
       return false;
   }
   return true;


});









});
