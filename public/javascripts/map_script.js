var myMap;
var myService;


function handleSearchResults(results, status) {
    console.log(results);

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
        // get bounds of visible box of myMap:
        bounds: myMap.getBounds(),
        name: "Whole Foods"
    };
    //                              a callback
    myService.nearbySearch(request, handleSearchResults);
}


function initMap(location) {
    console.log(location);
    // current location:
    var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    // how to display the map
    var mapOptions = {
        center: currentLocation,
        zoom: 18,
        //mapTypeId: google.maps.MapTypeId.SATELLITE
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    myMap = new google.maps.Map(document.getElementById('map-canvas'),
                                mapOptions);

    // add a marker to current location:
    var marker = new google.maps.Marker({
        position: currentLocation,
        map: myMap
    });

    myService = new google.maps.places.PlacesService(myMap);

    google.maps.event.addListenerOnce(myMap, 'bounds_changed', performSearch);

    // refresh button click:
    $('#refresh').click(performSearch);


    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">User Name</h1>'+
      "Latitude, Longitude: " + currentLocation +
      '</div>'+
      '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });


      var markerYou = new google.maps.Marker({
        position: currentLocation,
        map: myMap,
        title: '...Your Current location placeholder...'
      });
      marker.addListener('click', function() {
        infowindow.open(myMap, marker);
      });

      //--------------------------------------

    poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3.5
    });
    poly.setMap(myMap);

    // Add a listener for the click event
    myMap.addListener('click', addLatLng);
    poly.addListener('click', function(event){console.log(event.latLng);});

    $('#spinner').hide(); // hide spinner icon
}


var count = 0;
var sygn = {};
var midPoint;
var point1;
var point2;

function smallMap() {
    // current location:
    var currentLoca = new google.maps.LatLng(midPoint[0], midPoint[1]);

    // how to display the map
    var mapOpt = {
        center: currentLoca,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    myMap = new google.maps.Map(document.getElementById('map-modal'),mapOpt);
    poly.setMap(myMap);

    poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 25
    });
    var path = poly.getPath();

    path.push(point1);
    path.push(point2);

    var myLatLng = new google.maps.LatLng(point1[0], point1[1]);
    var myLatLng2 = new google.maps.LatLng(point2[0], point2[1]);

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(myLatLng);
    bounds.extend(myLatLng2);
    myMap.fitBounds(bounds);

}



// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
    console.log('clicked');

    if(count==2) return null;

    var path = poly.getPath();

    path.push(event.latLng);
    console.log(event.latLng);
    // Add a new marker at the new plotted point on the polyline.
    var marker = new google.maps.Marker({
     position: event.latLng,
     title: '#' + path.getLength(),
     map: myMap
     //icon: 'marker_pin.png'
    });

      count = count+1;

      if(count==1){
      sygn.point1 = marker.position;
      }

      if(count==2){
        sygn.point2 = marker.position;
        midPoint = [(path["j"][0]['G']+path["j"][1]['G'])/2, (path["j"][0]['K']+path["j"][1]['K'])/2 ];
        point1 = [path["j"][0]['G'],path["j"][0]['K']];
        point2 = [path["j"][1]['G'],path["j"][1]['K']];

        console.log(midPoint);
        // console.log("point1: "+ path["j"][0]);
        // console.log("point2: "+ path["j"][1]);

        setTimeout(function(){
          console.log(sygn);

          $('#mapModal').modal('show');
          setTimeout(smallMap,800);
        },2000);
      }
}

//JQUERY FUNCTIONS
$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(initMap);


    $('#spinner').show(); // show spinner icon

    var submitSygn = $('#save-sygn');
    var sygnType = $('.sygn-type');
    var startTime = $('#myList');
    var endTime = $('#myList2');

    //VARIABLES TO TEST FOR AM OR PM
    var ampm1 = $('.ampm1');
    var ampm2 = $('.ampm2');

    //VARIABLES TO ACTUAL STORE START AND END TIME
    var sygnStart;
    var sygnEnd;

    //GRAB FORM INFORMAITON AND SUBMIT SYGN BUTTON AND FUNCTION
    submitSygn.on('click',function(evt){
      console.log(sygnType.val());
      sygn.type = sygnType.val();
      console.log(sygn);

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

      if(monToggle === true){
        sygn.monday = [{sygnStart,sygnEnd}];
      }

      console.log(sygn);

    });

    // for map modal window----------------
    $('.btn-info').click(function(event) {
        $('#mapModal').modal('show');
    });
    //-------------------------------------

    $('#cancelBtn').on('click',function(){

     window.location.reload();
    });

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR MONDAY
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

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR TUESDAY
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

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR WEDNESDAY
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

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR THURSDAY
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

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR FRIDAY
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

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR SATURDAY
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

    //MODAL DAY TOGGLE AND CONTROL VARIABLE FOR SUNDAY
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

    $('#cancelBtn').on('click',function(){

      window.location.reload();
    });

});
