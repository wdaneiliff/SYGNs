var myMap;
var myService;
var user;

//****** VARIABLES TO CALCULATE CURRENT DAY FOR SYGNs *********
var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var timeChecker = new Date();
var currentDay = weekday[timeChecker.getDay()];

//IMMEDIATE AJAX CALL TO GET USER INFO FOR USER MAP MARKER:
$.ajax({
  method: "get",
  url: "/users/placeholder", //WILL BE USING TOKEN TO FIND USER IN CONTROLLER
  success: function(data){
    user = data;
  }
});

//****** SEARCH FUNCTIONS TO POPULATE SEARCH MARKERS **********
function handleSearchResults(results, status) {
    for (var i = 0; i < results.length; i++) {
        var marker = new google.maps.Marker({
            map: myMap,
            position: results[i].geometry.location
            //icon: 'marker_pin.png'
        });
    }
}

function performSearch() {
    var request = {
        // GET BOUNDS OF VISISIBLE MAP;
        bounds: myMap.getBounds(),
        name: "Whole Foods"
    };
    myService.nearbySearch(request, handleSearchResults);
}

//CONVERT MILITARY TIME BACK TO STANDARD AM-PM NOTATION:
function convertTime(military){
  var meridian = "AM";
  if(military > 1300){
    military = military - 1200;
    meridian = "PM";
  }

  militarySplit = military.toString().split("");
  if(military >= 1000){
    var twoDigitHour = militarySplit[0] + militarySplit[1];
    var twoDigitMinutes = militarySplit[2] + militarySplit[3];
    return twoDigitHour + ":" + twoDigitMinutes + meridian;
  } else {
    var oneDigitHour = militarySplit[0];
    var oneDigitMinutes = militarySplit[1] + militarySplit[2];
    return(oneDigitHour + ":" + oneDigitMinutes + meridian);
  }
}

//CAPITALIIZE PROTOTYPE FOR STRINGS (USED TO CAPITALIZE DAYS):
String.prototype.capitalize = function(){
  var wordNoFirstLetter = [];
  var firstLetter = this[0].toUpperCase();
  for(i = 1; i < this.length; i+=1){
    wordNoFirstLetter.push(this[i]);
  }

  return(firstLetter + wordNoFirstLetter.join(""));
};

//DISPLAY CURRENT TIME IN AM-PM NOTATION ON USER MARKER INFO:
// function currentTime(){
//   var currentUserTime= new Date();
//   var currentHour = currentUserTime.getHours();
//   var currentMinutes = currentUserTime.getMinutes();
//   var currentMeridian = "AM";
//   if(currentHour > 13){
//     currentMeridian = "PM";
//     currentHour = currentHour - 12;
//   }
//   return(currentHour + ":" + currentMinutes + currentMeridian);
// }


//****** INITIALIZE GOOGLE MAPS (INVOKED ON PAGE LOAD) **********
function initMap(location) {
    console.log(location);

    //SET CURRENT LOCATION AS GLOBAL VARIABLE (GEOLOACATION OBJECT):
    var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    //SET MAP CONFIGURATIONS:
    var mapOptions = {
        center: currentLocation,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //SET GOOGLE MAP AND RENDER IN DOM ELEMENT:
    myMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //CREATE A MARKER FOR THE USER'S CURRENT LOCATION
    var userMarker = new google.maps.Marker({
            position: currentLocation,
            map: myMap,
            icon: '/images/ping2.gif',
            optimized: false
    });

    //MAP SEARCH BOX AND AUTO COMPLETE:
    myMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(
    document.getElementById('SearchContainer'));
    var autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('searchBox'));
    autocomplete.bindTo('bounds', myMap);
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (place.geometry.viewport) {
        myMap.fitBounds(place.geometry.viewport);
      } else {
        myMap.setCenter(place.geometry.location);
        myMap.setZoom(18);
      }
    });

    myService = new google.maps.places.PlacesService(myMap);

    //REFRESH SEARCH WHEN MAP BOUNDS CHANGE / ZOOM:
    google.maps.event.addListenerOnce(myMap, 'bounds_changed', performSearch);

    //VARIABLE TO APPEND CURRENT USER INFO WHEN USER MARKER IS CLICKED:
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h5 id="firstHeading" class="firstHeading">Sygn User</h5>'+
      "Name: " + user.firstName + " " + user.lastName + "<br>" +
      "Email: " + user.email + "<br>" +
      "Location: " + currentLocation +
      '</div>'+
      '</div>';

    //POP UP WINDOW TO DISPLAY CURRENT USER INFO:
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    //EVENT LISTENER FOR CURRENT USER:
    userMarker.addListener('click', function() {
      infowindow.open(myMap, userMarker);
    });

    //NEW POLYLINE OBJECT AND CONFIGURATIONS:
    poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3.5
    });

    poly.setMap(myMap); //APPLY NEW POLYLINE TO CURRENT MAP:

    //LISTEN FOR CLICKS ON MAPS TO CREATE POLYLINE END POINTS:
    myMap.addListener('click', addLatLng);

    //LISTEN FOR CLICKS ON POLYLINE (FOR LATER USE):
    poly.addListener('click', function(event){console.log(event.latLng);});

    $('#spinner').hide(); //HIDE SPINNER WHEN MAP IS INITIALIZED

    //AJAX REQUEST TO GET ALL SYGNs FROM DATABASE:
    $.ajax({
      url:"/sygns",
      method: "get",
      success: function(data){
        var dataArray = data;
        var polyArray = [];

        //UPON SUCCESSFUL "GET", LOOP THROUGH ALL SYGNS AND DRAW THEM:
        for(i = 0; i < data.length; i+=1){

          startPoint = [data[i].point1[0]['G'],data[i].point1[0]['K']];
          endPoint = [data[i].point2[0]['G'],data[i].point2[0]['K']];

          var color; //VARIABLE TO PASS TO OUR POLYLINE CONFIG LATER

          //SET COLOR OF OUR POLYLINE (GREEN IF NO RESTRICTION TODAY):
          if(data[i][currentDay] != false){
            if(data[i]["type"] === "No Parking") color = "red";
            if(data[i]["type"] === "Permit Zone") color = "orange";
            if(data[i]["type"] === "Loading Zone") color = "yellow";
            if(data[i]["type"] === "Handicap Zone") color = "blue";
          } else {
            color = "green";
          }

          //SET AND CONFIG POLYLINE FOR DATA[i]:
          dataPoly = new google.maps.Polyline({
              strokeColor: color,
              strokeOpacity: 1.0,
              strokeWeight: 4
          });

          //SET THE MAP AND PATHING FOR THE POLYLINE:
          dataPoly.setMap(myMap);
          dataPath = dataPoly.getPath();

          //PARSE DATA[i] POINTS INTO GOOGLE LAT/LNG OBJECTS:
          var googleStartPoint = new google.maps.LatLng(parseFloat(startPoint[0]).toFixed(14), parseFloat(startPoint[1]).toFixed(14));

          var googleEndPoint = new google.maps.LatLng(parseFloat(endPoint[0]).toFixed(14), parseFloat(endPoint[1]).toFixed(14));

          //PUSH START AND END POINTS FOR CURRENT POLYLINE PATH:
          dataPath.push(googleStartPoint);
          dataPath.push(googleEndPoint);

          //PUSH NEW POLY LINE INTO ARRAY OF ALL POLY LINES AND ADD ID FOR MODAL INFO:
          polyArray.push(dataPoly); //STORE AN ARRAY OF ALL POLYLINE OBJECTS
          polyArray[i].modalID = i; //APPEND AN ID TO POLYLINE TO REFER TO IN ALL SYGNS

          console.log("----end of polyline draw function for data[i]----");

          //ADD EVENT LISTENER ON POLYLINE TO BRING UP THE SYGN SHOW MODAL:
          google.maps.event.addListener(polyArray[i],"click",function(evt){

              $('#sign-modal').modal('show');
              currentPoly = this; //"THIS" REFERS TO THE POLYLINE CLICKED:

              $('.mb2').children('p').remove(); //CLEAR SYGN MODAL
              $('.mb2').append('<p><strong>'+ dataArray[currentPoly.modalID].type+'</strong></p>');
              console.log(dataArray[currentPoly.modalID]);

              //LOOP THROUGH EACH DAY IN SYGN TO DISPLAY RESTRICTION:
              for(j = 0; j < weekday.length; j += 1){
                if(dataArray[currentPoly.modalID][weekday[j]] != false){

                $('.mb2').append('<p>' + [weekday[j]].toString().capitalize() + ': ' + convertTime(dataArray[currentPoly.modalID][weekday[j]][0]) + ' - '+ convertTime(dataArray[currentPoly.modalID][weekday[j]][1]) + '</p>');
                }
              }
          }); //END MAP LISTENER FOR EACH POLYLINE
        } //END FOR LOOP FOR EACH SYGN POLYLINE
      } //END AJAX SUCCESSION FUNCTION
    }); //END AJAX CALL
} //END INITIALIZE MAP

//CONTROL VARIABLES TO STORE NEW SYGN:
var count = 0;
var sygn = {};
var midPoint;
var point1;
var point2;

//****** MAP FUNCTION FOR SMALLER MAP IN MODAL WINDOW ************
function smallMap() {
    //SET CURRENT LOCATION AS MIDPOINT OF NEWLY CREATED SYGN:
    var sygnMidPoint = new google.maps.LatLng(midPoint[0], midPoint[1]);

    //SMALL MAP CONFIGURATIONS
    var smallMapOptions = {
        center: sygnMidPoint,
        zoom: 23,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //SET SMALL GOOGLE MAP AND RENDER IN MODAL WINDOW:
    modalMap = new google.maps.Map(document.getElementById('modalMap'),smallMapOptions);

    // POLYLINE OBJECT FOR SMALL MAP:
    var smallPoly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 6.3
    });

    smallPoly.setMap(modalMap); //PLACE SMALL POLYLINE ON MODAL MAP

    //SET PATHING FOR SMALL MAP POLYLINE AND PUSH START + END POINTS:
    var smallPath = smallPoly.getPath();

    function drawSmallLine(){
        //PARSE SMALL LINE START AND END POINTS INTO GOOGLE LAT/LNG OBJECTS:
        smallStartPoint = new google.maps.LatLng(parseFloat(point1[0]).toFixed(14), parseFloat(point1[1]).toFixed(14));

        smallEndPoint = new google.maps.LatLng(parseFloat(point2[0]).toFixed(14), parseFloat(point2[1]).toFixed(14));

        // PUSH START AND END POINTS INTO POLYLINE PATH:
        smallPath.push(smallStartPoint);
        smallPath.push(smallEndPoint);

        //PARSE START AND END POINTS INTO GOOGLE LAT/LNG OBJECTS:
        var startBound = new google.maps.LatLng(point1[0], point1[1]);
        var endBound = new google.maps.LatLng(point2[0], point2[1]);

        //ZOOM MAP INTO START AND END POINTS BY EXPANDING SMALL MAP BOUNDS:
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(startBound);
        bounds.extend(endBound);
        modalMap.fitBounds(bounds);
      }

  //DELAY SMALL POLYLINE DRAW TO RENDER THE MAP FIRST
  setTimeout(drawSmallLine,300);
} //CLOSE SMALL MAP FUNCTION

//****** HANDLE CLICK ON MAIN MAP AND ADD NEW POINT TO POLYLINE ************
function addLatLng(event) {
    console.log('map was clicked');

    if(count==2) return null; //EXIT FUNCTION IF MAP WAS CLICK TWICE ALREADY

    var path = poly.getPath();

    //PUSH CLICKED COORDINATE POINT INTO POLYLINE PATH:
    path.push(event.latLng);
    console.log(event.latLng);

    //APPLY MARKERS TO POLYLINE START AND END:
    var marker = new google.maps.Marker({
     position: event.latLng,
     title: '#' + path.getLength(),
     map: myMap
    });

    //ADD ONE TO COUNT PER CLICK (LIMIT TO TWO):
    count = count+1;

    //IF COUNT == 1, ADD FIRST POINT TO SIGN OBJECT AND CONTINUE:
    if(count==1){
      sygn.point1 = marker.position;
    }

    //IF COUNT == 2, SET POINT PARAMS FOR MODAL MAP AND SHOW MODAL MAP:
    if(count==2){
        sygn.point2 = marker.position;

        //MIDPOINT WILL BE USED TO CENTER MODAL MAP LATER:
        midPoint = [(path["j"][0]['G']+path["j"][1]['G'])/2, (path["j"][0]['K']+path["j"][1]['K'])/2 ];
        point1 = [path["j"][0]['G'],path["j"][0]['K']];
        point2 = [path["j"][1]['G'],path["j"][1]['K']];

        //DELAY SHOW MODAL MAP TO DISPLAY NEW POLYLINE TO USER:
        $('.background').fadeIn('slow');
        $('.newModal').fadeIn('slow');
        smallMap();

    }//END 2ND MAP CLICK CONDITIONAL (IF)

}//END LATLNG FUNCTION

//****** JQUERY FUNCTIONS AND FUNCTION CALL AT PAGE LOAD ********
$(document).ready(function() {

    //FIND CURRENT USER LOCATION AND INVOKE INITMAP:
    navigator.geolocation.getCurrentPosition(initMap);

    $('#spinner').show(); //SHOW SPINNER ICON

    //DOM VARIABLES TO GRAB SIGN INFO:
    var submitSygn = $('#save-sygn');
    var sygnType = $('.sygn-type');
    var startTime = $('#myList');
    var endTime = $('#myList2');
    var ampm1 = $('.ampm1');
    var ampm2 = $('.ampm2');

    //JS GLOBAL VARIABLES TO STORE ACTUAL START AND END TIME:
    var sygnStart;
    var sygnEnd;

    //GRAB FORM INFORMATION AND SUBMIT SYGN BUTTON LISTENER AND FUNCTION:
    submitSygn.on('click',function(evt){

      sygn.type = sygnType.val();

      //PARSE START AND END TIMES INTO INTEGERS
      sygnStart = parseInt(startTime.val().split(":").join(""));
      sygnEnd = parseInt(endTime.val().split(":").join(""));

      //CONVERT START TIME TO MILITARY TIME
      if(ampm1.val() === "PM"){
        if(sygnStart === 1200) return null;
        sygnStart += 1200;
      }

      //CONVERT END TIME TO MILITARY TIME
      if(ampm2.val() === "PM"){
        if(sygnEnd === 1200) return null;
        sygnEnd += 1200;
      }

      //**** PUSH TIMES TO SYGN OBJECT IF DAY IS TOGGLED *****
      if(monToggle === true){
        sygn.monday = [sygnStart,sygnEnd];
      }
      if(tueToggle === true){
        sygn.tuesday = [sygnStart,sygnEnd];
      }
      if(wedToggle === true){
        sygn.wednesday = [sygnStart,sygnEnd];
      }
      if(thuToggle === true){
        sygn.thursday = [sygnStart,sygnEnd];
      }
      if(friToggle === true){
        sygn.friday = [sygnStart,sygnEnd];
      }
      if(satToggle === true){
        sygn.saturday = [sygnStart,sygnEnd];
      }
      if(sunnToggle === true){
        sygn.sunday = [sygnStart,sygnEnd];
      }

      //SUBMIT AJAX POST TO SYGNS, SENDING NEW "SYGN" OBJECT:
      $.ajax({
        url:"/sygns",
        method: "post",
        data: JSON.stringify(sygn),
        contentType: 'application/json; charset=UTF-8',
        dataType : 'json',
        success: function(data){
          console.log(data);
          window.location.reload();
        }
      });
    });


    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR MONDAY:
    var mon = $('.mon');
    var monToggle = false;
    mon.on('click', function(){
      if(monToggle === false){
        monToggle = true;
        mon.css("backgroundColor","rgba(0, 0, 139, 0.80)");
      } else{
        monToggle = false;
        mon.css("backgroundColor","rgba(0, 0, 139, 0.38)");
      }
    });

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR TUESDAY:
    var tue = $('.tue');
    var tueToggle = false;
    tue.on('click', function(){
      if(tueToggle === false){
        tueToggle = true;
        tue.css("backgroundColor","rgba(0, 0, 139, 0.80)");
      } else{
        tueToggle = false;
        tue.css("backgroundColor","rgba(0, 0, 139, 0.38)");
      }
    });

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR WEDNESDAY:
    var wed = $('.wed');
    var wedToggle = false;
    wed.on('click', function(){
      if(wedToggle === false){
        wedToggle = true;
        wed.css("backgroundColor","rgba(0, 0, 139, 0.80)");
      } else{
        wedToggle = false;
        wed.css("backgroundColor","rgba(0, 0, 139, 0.38)");
      }
    });

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR THURSDAY:
    var thu = $('.thu');
    var thuToggle = false;
    thu.on('click', function(){
      if(thuToggle === false){
        thuToggle = true;
        thu.css("backgroundColor","rgba(0, 0, 139, 0.80)");
      } else{
        thuToggle = false;
        thu.css("backgroundColor","rgba(0, 0, 139, 0.38)");
      }
    });

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR FRIDAY:
    var fri = $('.fri');
    var friToggle = false;
    fri.on('click', function(){
      if(friToggle === false){
        friToggle = true;
        fri.css("backgroundColor","rgba(0, 0, 139, 0.80)");
      } else{
        friToggle = false;
        fri.css("backgroundColor","rgba(0, 0, 139, 0.38)");
      }
    });

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR SATURDAY:
    var sat = $('.sat');
    var satToggle = false;
    sat.on('click', function(){
      if(satToggle === false){
        satToggle = true;
        sat.css("backgroundColor","rgba(0, 0, 139, 0.80)");
      } else{
        satToggle = false;
        sat.css("backgroundColor","rgba(0, 0, 139, 0.38)");
      }
    });

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR SUNDAY:
    var sunn = $('.sun');
    var sunnToggle = false;
    sunn.on('click', function(){
      if(sunnToggle === false){
        sunnToggle = true;
        sunn.css("backgroundColor","rgba(0, 0, 139, 0.80)");
      } else{
        sunnToggle = false;
        sunn.css("backgroundColor","rgba(0, 0, 139, 0.38)");
      }
    });

    //DELETE COOKIE FUNCTION UPON LOGGING OUT:
    function delete_cookie( name ) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    //*** APPEND LOGIN OR LOG OUT BUTTON TO NAV DEPENDING IF COOKIES PRESENT:
    var ul = $('.navBar');
    var loginSpan = $('.login');

    if(document.cookie.indexOf("token") >= 0) {
      console.log("cookie here");

      //REMOVE LOGIN ELEMENTS IF USER IS ALREADY LOOGED IN:
      loginSpan.children(".userEmail").remove();
      loginSpan.children(".userPassword").remove();
      loginSpan.children(".loginButton").remove();

      //ADD LOGOUT BUTTON FOR LOGGED IN USERS:
      loginSpan.append('<li class="navItem"> <a href="/login" class="logout"> Logout </a> <li>');

      //CREATE LOG OUT LISTENER FOR APPENDED LOGOUT TAB IN NAVBAR:
      $('.logout').on('click', function(){
        delete_cookie('token');
      });
    }

    //NAVBAR HIGHLIGHTER:
    $(".navItem").mouseover(function(){
      $(this).css('backgroundColor',"grey");
    }).mouseout(function(){
      $(this).css('backgroundColor',"#2D3E50");
    });

    //REFRESH MAIN MAP IF USER CLOSES MODAL WINDOW:
    var exitModal = $('.exitModal');

    exitModal.on('click', function(){
      $('.background').fadeOut('fast');
      $('.newModal').fadeOut('fast');
      count = 0;

      //FIND CURRENT USER LOCATION AND INVOKE INITMAP:
      navigator.geolocation.getCurrentPosition(initMap);

    });

}); //CLOSE JQUERY ON PAGE LOAD FUNCTION
