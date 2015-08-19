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
};

function performSearch() {
    var request = {
        // get bounds of visible box of myMap:
        bounds: myMap.getBounds(),
        name: "Whole Foods"
    }
    //                              a callback
    myService.nearbySearch(request, handleSearchResults);
};


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

    // traffic button on/off:---------------------------------------------------
    var trafficLayer = new google.maps.TrafficLayer();
    $('#toggle_traffic').click(function() {
        // if map has traffic layer visible, trun off
        if (trafficLayer.getMap()) {
            trafficLayer.setMap(null);
        } else {
            trafficLayer.setMap(myMap);
        }
    });

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      '<p>Attribution: Uluru,<a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      "Latitude, Longitude: " + currentLocation +
      '</div>'+
      '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });


      var marker = new google.maps.Marker({
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
};

//HANDLE CLICK COUNTS TO LIMIT AT 2 PER SESSION
var clickCount = 0;

// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
    console.log('clicked');
  if(clickCount == 2) return null;

  var path = poly.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  path.push(event.latLng);
  console.log(event.latLng);
  // Add a new marker at the new plotted point on the polyline.
  var marker = new google.maps.Marker({
    position: event.latLng,
    title: '#' + path.getLength(),
    map: myMap
    //icon: 'marker_pin.png'
  });

  clickCount +=1;

}


$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(initMap);

    function delete_cookie( name ) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    var ul = $('ul');
    if(document.cookie.indexOf("token") >= 0) {
      console.log("cookie here");
      ul.append('<li> <a href="/login" class="logout"> Logout </a> <li>');

      var cookie = $('.logout');
      cookie.on('click', function(){
        delete_cookie('token');
      });
    }



});
