//Live updated 0612 07:43

/* -----IDcode s, classes and srcs requiride for the UI team----
1) <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdDGKlptg7pjd38E_q0AHjP8uREM5ng90E&libraries=places&callback=createMap" async defer></script>

2)<p id="display" ></p> shows the count (14 parks near ..) of the search result
    2a) (for css only) class= styleDisplay 
3) <div id="map"></div> This div holds the map (to be use also in css for map size)
      3a) add css height (optional: add width)
4) <div id=parkInfo></div> this div hold the details information
    4a) (for css only) class=stylePhoto (the photo destails)
    4b) (for css only) class= styleRating (the park rating)
    4c) (for css only) class= styleLink (the website link)
    4d) (for css only) class= address (the address result)
    4e) (for css only) class= showStyle (the open hours result)
    4f) (for css only) class= direct  (direction link)

*/

//---------plan of action (stage 1)----
// lets create a map with set origin austin
//use HTML5 to find user geolocation
//// bounds is a rectangle/frame option from Map object
// add nearby search
//add markers to nerarby search
//---------plan of action (stage 1)----

let map;
let coord;
let bounds;
let infoWindow;
let infoWindowText;
let currentWindow;
let service;
let marker;
let parkInfo;
let icon2;
let distance = "8050";
let switchH = false;

//STEP 1
// runining my main function "createmap"
//finding user current loc and passing it to "getNearbyPlaces"
function createMap() {
  //setting or creating new bounds(map frame/focus)
  bounds = new google.maps.LatLngBounds();
  //setting a creating a google map infow Window (is a text box)
  infoWindow = new google.maps.InfoWindow();
  //swetting info window to current in order to close current when a new one pops up after an event
  currentInfoWindow = infoWindow;

  //using HTML5 to find user current location and setting the result as Latitude and longitude
  // geolocation returns result as (coords.latitude and coords.longitude )
  if (navigator.geolocation) {
    // console.log('gps')
    navigator.geolocation.getCurrentPosition(
      function (position) {
        coord = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        //setting and calling a new google map result
        map = new google.maps.Map(document.getElementById("map"), {
          center: coord,
          zoom: 12,
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy",

          //json style from mapstyle.withgoogle.com
          styles: [
            {
              elementType: "geometry",
              stylers: [
                {
                  color: "#242f3e",
                },
              ],
            },
            {
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#746855",
                },
              ],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#242f3e",
                },
              ],
            },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#d59563",
                },
              ],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#d59563",
                },
              ],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [
                {
                  color: "#263c3f",
                },
              ],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#6b9a76",
                },
              ],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [
                {
                  color: "#38414e",
                },
              ],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#212a37",
                },
              ],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#9ca5b3",
                },
              ],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [
                {
                  color: "#746855",
                },
              ],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#1f2835",
                },
              ],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#f3d19c",
                },
              ],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [
                {
                  color: "#2f3948",
                },
              ],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#d59563",
                },
              ],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [
                {
                  color: "#17263c",
                },
              ],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#515c6d",
                },
              ],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#17263c",
                },
              ],
            },
          ],
        });

        let icon1 = {
          url: "https://img.icons8.com/fluent/96/000000/dog.png",
          scaledSize: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };

        icon2 = {
          url: "https://img.icons8.com/plasticine/100/000000/dog-bone.png",
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };

        let user = new google.maps.Marker({
          position: coord,
          map: map,
          icon: icon1,
          title: "Your location",
        });

        console.log(google.maps.places);
        bounds.extend(coord);
        infoWindow.setPosition(user.position);
        infoWindow.setContent("You are here!");
        infoWindow.open(map);
        map.setCenter(coord);

        getNearbyPlaces(coord);
        // submit();
      },
      function (error) {
        if (error.code == 1) {
          let errorM = document.getElementById("error");
          errorM.textContent =
            error.message + ", Turn on your geolocation to use this app!!";
        }
        // console.log(error)
      }
    );
  }
  //setting up error code
  else {
    navigator.geolocation.setCurrentPosition(function showPosition(position) {
      coord = { lat: 30.267, lng: -97.743 };
      map = new google.maps.Map(document.getElementById("map"), {
        center: coord,
        zoom: 14,
      });
      bounds.extend(coord);
      infoWindow.setPosition(coord);
      infoWindow.setContent("HQ: Geolocation is not supported in your device");
      infoWindow.open(map);
    });
  }
}

////STEP 2
// making a nearby search call- nearbySearch takes 2 parameter (request, callback) request= to location,
// callback - is a function that takes 2 para(result, status)- status initiate the result
function getNearbyPlaces(position) {
  let request = {
    //position = coord our gps location
    location: position,
    //radius number is per meter 10000= 6 miles (approx)
    radius: distance,
    keyword: "dog park",
  };
  // setting the target location for (the places result) inside my current map location
  service = new google.maps.places.PlacesService(map);
  // calling the google nearbySearch function takes 2 parameter (request, callback)
  service.nearbySearch(request, callBack);
}
//step 3
//the callback parameter is a function that takes two parameter(result, status)
function callBack(result, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //if true we create marker for each result
    createMarkers(result);

    //showing how many rersults there are
    display(result);
    createTag(result);
  }
}
//step 4
//setting up the marker function
function createMarkers(park) {
  //    console.log(park[0])

  park.forEach(function (place) {
    //place= for each marker/result we are creating a marker
    marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      icon: icon2,
      title: place.name,
    });
    // change rectangle or frame of map per result
    bounds.extend(place.geometry.location);
    //calling click event function
    clickEv(marker, place);
    sendEv(marker);
  });
  //adjust map to show all visible markers
  map.fitBounds(bounds);
}

//create the click event function passing two parameters (dot=marker and place)
function clickEv(dot, place) {
  google.maps.event.addListener(dot, "click", function () {
    let request = {
      placeId: place.place_id,
      fields: [
        "name",
        "photos",
        "formatted_address",
        "rating",
        "website",
        "adr_address",
        "opening_hours",
      ],
    };
    //setting up event listener for each markers
    service.getDetails(request, function (place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // console.log(google.maps);
        // console.log(place.opening_hours);
        parkInfo = document.getElementById("parkInfo");
        parkInfo.innerHTML = "<h3>" + place.name + "</h3>";

        if (place.photos) {
          let createPhoto = document.createElement("img");
          let stylePhoto = createPhoto.classList.add("stylePhoto");
          createPhoto.src = place.photos[0].getUrl();
          parkInfo.appendChild(createPhoto);
        } else {
          let createPhoto = document.createElement("img");
          let stylePhoto = createPhoto.classList.add("stylePhoto");
          createPhoto.src =
            "https://img.icons8.com/doodle/96/000000/national-park.png";
          parkInfo.appendChild(createPhoto);
        }
        if (place.rating) {
          let createRating = document.createElement("h4");
          let styleRating = createRating.classList.add("styleRating");
          createRating.textContent = "Rating: " + place.rating + " Stars";
          parkInfo.appendChild(createRating);
        } else {
          let createRating = document.createElement("h4");
          let styleRating = createRating.classList.add("styleRating");
          createRating.textContent = "Rating:N/A";
          parkInfo.appendChild(createRating);
        }
        if (place.website) {
          let createLink = document.createElement("a");
          let styleLink = createLink.classList.add("styleLink");
          createLink.href = place.website;
          createLink.textContent = "Visit park website for more information";
          parkInfo.appendChild(createLink);
        }
        if (place.formatted_address) {
          let createAddress = document.createElement("p");
          let createStyle = createAddress.classList.add("address");
          createAddress.innerHTML =
            "<strong>Address: </strong>" + place.formatted_address;
          parkInfo.appendChild(createAddress);
        }
        if (place.opening_hours) {
          let showOpen = document.createElement("p");
          let showStyle = showOpen.classList.add("showStyle");
          showOpen.innerHTML =
            "<strong>Open Hours: </strong>" + place.opening_hours.weekday_text;
          parkInfo.appendChild(showOpen);
        }
        if (place.formatted_address) {
          let createDir = document.createElement("a");
          let addressStyle = createDir.classList.add("styleLink");
          ``;
          createDir.href =
            "https://www.google.com/maps/search/?api=1&query=" + place.name;
          createDir.textContent = "Get directions to " + place.name;
          parkInfo.appendChild(createDir);
        }

        //creating an infowindow for each marker
        markerInfoWindow(place, dot);
      }
    });
  });
}
//showing an info pane for each marker after a click event
function markerInfoWindow(place, dot) {
  if (place.name) {
    let markerInfoWindow = new google.maps.InfoWindow();
    markerInfoWindow.setContent(
      "<div><strong>" + place.name + "</strong></div>"
    );
    currentInfoWindow.close();
    markerInfoWindow.open(dot, dot);
    currentInfoWindow = markerInfoWindow;
  }
}
function display(result) {
  let display = document.getElementById("display");
  let distance = document.getElementById("distance");
  let styleDisplay = display.classList.add("styleDisplay");
  display.innerHTML = `<strong>There are ${result.length} dog parks within the selected radius </strong>`;
}

//--------------------------------------------------//
//creating a list of result, separate from the map marker rresults
function createTag(result) {
  result.forEach(function (tag) {
    // console.log('printing');
    let frame = document.createElement("div");
    frame.id = "frame" + result.indexOf(tag);
    let someImg = document.createElement("img");
    if (tag.photos) {
      someImg.src = tag.photos[0].getUrl();
    } else {
      someImg.src =
        "https://image.flaticon.com/362/png/512/3048/3048388.png?size=1200x630f";
    }
    let button = document.createElement("button");
    button.innerHTML = "<h6>" + tag.name + "</h6>";
    button.id = "buttons" + result.indexOf(tag);
    let showTag = document.getElementById("searchResult");
    showTag.appendChild(frame);
    frame.appendChild(button);
    button.appendChild(someImg);
    // console.log(tag)

    // return tag
    listEv(tag, button);
  });
}

function listEv(tag, button) {
  // console.log(tag.place_id);
  google.maps.event.addDomListener(button, "click", function () {
    let request = {
      placeId: tag.place_id,
      fields: [
        "name",
        "photos",
        "formatted_address",
        "rating",
        "website",
        "adr_address",
        "opening_hours",
      ],
    };
    service.getDetails(request, function (tag, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        parkInfo = document.getElementById("parkInfo");
        parkInfo.innerHTML = "<h3>" + tag.name + "</h3>";
      }
      if (tag.photos) {
        let createPhoto = document.createElement("img");
        let stylePhoto = createPhoto.classList.add("stylePhoto");
        createPhoto.src = tag.photos[0].getUrl();
        parkInfo.appendChild(createPhoto);
      } else {
        let createPhoto = document.createElement("img");
        let stylePhoto = createPhoto.classList.add("stylePhoto");
        createPhoto.src =
          "https://img.icons8.com/doodle/96/000000/national-park.png";
        parkInfo.appendChild(createPhoto);
      }
      if (tag.rating) {
        let createRating = document.createElement("h4");
        let styleRating = createRating.classList.add("styleRating");
        createRating.textContent = "Rating: " + tag.rating + " Stars";
        parkInfo.appendChild(createRating);
      } else {
        let createRating = document.createElement("h4");
        let styleRating = createRating.classList.add("styleRating");
        createRating.textContent = "Rating:N/A";
        parkInfo.appendChild(createRating);
      }
      if (tag.website) {
        let createLink = document.createElement("a");
        let styleLink = createLink.classList.add("styleLink");
        createLink.href = tag.website;
        createLink.textContent = "Visit park website for more information";
        parkInfo.appendChild(createLink);
      }
      if (tag.formatted_address) {
        let createAddress = document.createElement("p");
        let createStyle = createAddress.classList.add("address");
        createAddress.innerHTML =
          "<strong>Address: </strong>" + tag.formatted_address;
        parkInfo.appendChild(createAddress);
      }
      if (tag.opening_hours) {
        let showOpen = document.createElement("p");
        let showStyle = showOpen.classList.add("showStyle");
        showOpen.innerHTML =
          "<strong>Open Hours: </strong>" + tag.opening_hours.weekday_text;
        parkInfo.appendChild(showOpen);
      }
      if (tag.formatted_address) {
        let createDir = document.createElement("a");
        let addressStyle = createDir.classList.add("styleLink");
        ``;
        createDir.href =
          "https://www.google.com/maps/search/?api=1&query=" + tag.name;
        createDir.textContent = "Get directions to " + tag.name;
        parkInfo.appendChild(createDir);
      }
    });
  });
}

// adding click event for distance form and clearing list result in html
let send = document.getElementById("distance");
let submitB = document.getElementById("submit");
// console.log(remove);

function sendEv(marker) {
  send.addEventListener(
    "change",
    function (ev) {
      ev.preventDefault();
      let removeS = document.getElementById("searchResult");
      let removechild = removeS.children;
      let num = removechild.length;

      marker.setMap(null);
      // remove.innerHTML=' ';

      distance = ev.target.value;
      if (removechild[0]) {
        removechild[0].remove();
        switchH = true;
      }

      //Eliminates the need for a "submit" button
      if (switchH) {
        console.log(distance);
        getNearbyPlaces(coord);
        switchH = false;
      }
    }

    // function submit(){
    //   submitB.addEventListener('click',function(ev){
    //     ev.preventDefault();
    //     console.log(switchH);
    //     if(switchH){
    //       console.log(distance);
    //       getNearbyPlaces(coord);
    //       switchH=false
    //     }

    //   })

    // }
  );
}

//Live
