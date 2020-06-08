//---------plan of action (stage 1)----
// lets create a map with set origin austin
//use HTML5 to find user geolocation
//// bounds is a rectangle option from Map object
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
    //STEP 1
//finding user current loc
function createMap(){
    
   bounds= new google.maps.LatLngBounds();
    //infow Window is a text box
    infoWindow=new google.maps.InfoWindow;

    currentInfoWindow= infoWindow;

    //using HTML5 to find user current location and setting the result as Latitude and longitude
    // geolocation returns result as (coords.latitude and coords.longitude )
    if (navigator.geolocation){
        // console.log('gps')
        navigator.geolocation.getCurrentPosition(function (position) {
        coord= {
            lat: position.coords.latitude,
            lng:position.coords.longitude,
            accuracy:position.coords.accuracy
        };
        //calling a new google map result
        map= new google.maps.Map(document.getElementById('map'),{
            center: coord,
            zoom:12,

        //json style from mapstyle.withgoogle.com
        styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#242f3e"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#746855"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#242f3e"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#d59563"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#d59563"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#263c3f"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#6b9a76"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#38414e"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#212a37"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9ca5b3"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#746855"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#1f2835"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#f3d19c"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#2f3948"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#d59563"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#17263c"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#515c6d"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#17263c"
                }
              ]
            }
          ]
        
           
        });

        let icon1={
            url:"https://img.icons8.com/fluent/96/000000/dog.png",
            scaledSize: new google.maps.Size(60,60),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        }

        let user= new google.maps.Marker({
            position:coord,
            map:map,
            icon:icon1,
            title: "Your location"

        })

        console.log(google.maps.places);
        bounds.extend(coord);
        infoWindow.setPosition(user.position);
        infoWindow.setContent('You are here!');
        infoWindow.open(map);
        map.setCenter(coord);
        
        getNearbyPlaces(coord)
        
        },function(error){
            if (error.code ==1){
            let errorM= document.getElementById('error');
            errorM.textContent=error.message+', Turn on your geolocation to use this app!!'
            
            }
        // console.log(error)
        });

       
    }
    //setting up error code
    else {
    
    navigator.geolocation.setCurrentPosition(function showPosition (position) {
    coord= {lat:30.267,lng:-97.743};
        map= new google.maps.Map(document.getElementById('map'),{
            center: coord,
            zoom: 14
            
    })
    bounds.extend(coord);
    infoWindow.setPosition(coord);
    infoWindow.setContent('HQ: Geolocation is not supported in your device');
    infoWindow.open(map); 
            
    })
   
    }
    

}

    ////STEP 2
// making a nearby search call- nearbySearch takes 2 parameter (request, callback) request= to location,
// callback - is a function that takes 2 para(result, status)- status initiate the result
function getNearbyPlaces(position){
    let request={
        //position = coord our gps location
        location: position,
        //radius number is per meter 10000= 6 miles (approx)
        radius: '10000',
        keyword: 'dog park'
    };
// setting the target location for (the places result) inside my current map location
service= new google.maps.places.PlacesService(map);
// calling the google nearbySearch function takes 2 parameter (request, callback)
service.nearbySearch(request, callBack)
    
}  
//step 3
//the callback parameter is a function that takes two parameter(result, status)
function callBack(result, status){
    if (status == google.maps.places.PlacesServiceStatus.OK){
        //if true we create marker for each result
    createMarkers(result);
    
    //showing how many rersults there are
    display(result);
    }
}
//step 4
//setting up the marker function
function createMarkers(park){
//    console.log(park[0])

    park.forEach(function (place){
        //place= for each marker/result we are creating a marker
        marker= new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            icon:"https://img.icons8.com/plasticine/100/000000/dog-bone.png",
            title: place.name

        });
        // change rectangle or frame of map per result
    bounds.extend(place.geometry.location);
    //calling click event function
    clickEv(marker,place);
    
    
    })
    //adjust map to show all visible markers
    map.fitBounds(bounds);
        

};

//create the click event function passing two parameters (dot=marker and place)
function clickEv(dot,place){
   google.maps.event.addListener(dot,'click',function(){
    let request={
        placeId: place.place_id,
        fields:['name','photos','formatted_address','rating','website','adr_address']
    }
    //setting up event listener for each markers
service.getDetails(request, function(place,status){
if (status == google.maps.places.PlacesServiceStatus.OK){
    // console.log(google.maps);
    // console.log(place.rating);
parkInfo= document.getElementById('parkInfo');
parkInfo.innerHTML='<h1>'+place.name+'</h1>';

if(place.photos){
let createPhoto= document.createElement('img');
let stylePhoto= createPhoto.classList.add('stylePhoto');
createPhoto.src= place.photos[0].getUrl();
parkInfo.appendChild(createPhoto);
}else{
    let notAva= document.createElement('p');
    notAva.textContent= 'No photos available';
    parkInfo.appendChild(notAva);
}
if (place.rating){
let createRating= document.createElement('h4');
let styleRating= createRating.classList.add('styleRating');
createRating.textContent='Rating: '+place.rating+' Stars';
parkInfo.appendChild(createRating);
}else{
    let createRating= document.createElement('h4');
let styleRating= createRating.classList.add('styleRating');
createRating.textContent='Rating:N/A';
parkInfo.appendChild(createRating);
}
if (place.website){
let createLink= document.createElement('a');
let styleLink= createLink.classList.add('styleLink');
createLink.href= place.website;
createLink.textContent= 'See our Website for more information';
parkInfo.appendChild(createLink);
}
if(place.formatted_address){
let createAddress= document.createElement('p');
let createStyle= createAddress.classList.add('address');
createAddress.innerHTML='<strong>Address: </strong>'+place.formatted_address;
parkInfo.appendChild(createAddress);
}
if(place.formatted_address){
let createDir= document.createElement('a');
let addressStyle= createDir.classList.add('direct');``
createDir.href='https://www.google.com/maps/search/?api=1&query='+place.name;
createDir.textContent='Get direction to '+place.name;
parkInfo.appendChild(createDir);
}

//creating an infowindow for each marker
markerInfoWindow(place,dot);
}
})    

 
   }) 

}
//showing an info pane for each marker after a click event
function markerInfoWindow(place,dot){
if(place.name){
let markerInfoWindow= new google.maps.InfoWindow();
markerInfoWindow.setContent('<div><strong>'+place.name+'</strong></div>');
currentInfoWindow.close();
markerInfoWindow.open(dot,dot);
currentInfoWindow= markerInfoWindow;

}

}
function display(result){
let display= document.getElementById('display');
display.innerHTML= '<strong>There are '+result.length+ ' dog parks within ...</strong>'

}



