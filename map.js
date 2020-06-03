// lets create a map with set origin austin
//use HTML5 to find user geolocation
//// bounds is a rectangle option from Map object
// add nearby search
//add markers to nerarby search

let map;
let coord;
let bounds;
let infoWindow;
let currentWindow;
let service;
    //STEP 1
//finding user current loc
function createMap(){
    // coord= {lat:30.267,lng:-97.743};
    // map= new google.maps.Map(document.getElementById('map'),{
    //     center: coord,
    //     zoom: 14
    // });
    // console.log(google);
    // console.log(navigator);
    // console.log(navigator.geolocation.getCurrentPosition)

    //setting bounds to Lat and Long (rectangle) 
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
            lng:position.coords.longitude
        };
        //calling a new google map result
        map= new google.maps.Map(document.getElementById('map'),{
            center: coord,
            zoom:15
        });

        console.log(google.maps.places);
        bounds.extend(coord);
        infoWindow.setPosition(coord);
        infoWindow.setContent('You are here');
        infoWindow.open(map);
        map.setCenter(coord);
        
        getNearbyPlaces(coord)
        });
       
    }
    //setting up error code
    // else {
        
    //     navigator.geolocation.setCurrentPosition(function showPosition (position) {
    //     coord= {lat:30.267,lng:-97.743};
    //         map= new google.maps.Map(document.getElementById('map'),{
    //             center: coord,
    //             zoom: 14
    
    //     })
    //     bounds.extend(coord);
    //     infoWindow.setPosition(coord);
    //     infoWindow.setContent('HQ: Refresh Browser and trun on Your GPS to use this app');
    //     infoWindow.open(map); 
        
    // })
    
    // }
    

}


    ////STEP 2
// making a nearby search call- nearbySearch takes 2 parameter (request, callback) request= to location,
// callback - is a function that takes 2 para(result, status)- status initiate the result
function getNearbyPlaces(position){
    let request={
        locations: position,
        // radius: '500',
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: 'park'
    };
// setting the target location for (the places result) inside my current map location
service= new google.maps.places.PlacesService(map);
// calling the google nearbySearch function takes 2 parameter (request, callback)
service.nearbySearch(request, callBack)
    
}  

//the callback parameter is a function that takes two parameter(result, status)
function callBack(result, status){
    if (status == google.maps.places.PlacesServiceStatus.OK){
        //if true we create marker for each
    createMarkers(result);
    }
}
//setting up the marker function
function createMarkers(places){
    places.forEach(function place(){
        let marker= new google.maps.Marker({
            position: place.geometry.locations,
            map: map,
            title: place.name
        });
        // change rectangle or frame of map per result
    bounds.extend(place.geometry.locations);
    })
    //adjust map to show all visible markers
    map.fitBounds(bounds);

}

