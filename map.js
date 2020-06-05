// lets create a map with set origin austin
//use HTML5 to find user geolocation
//// bounds is a rectangle option from Map object
// add nearby search
//add markers to nerarby search

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
            lng:position.coords.longitude
        };
        //calling a new google map result
        map= new google.maps.Map(document.getElementById('map'),{
            center: coord,
            zoom:12,
           
        });

        console.log(google.maps.places);
        bounds.extend(coord);
        infoWindow.setPosition(coord);
        infoWindow.setContent('You are here!');
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
        //position = coord our gps location
        location: position,
        //radius number is per meter 10000= 6 miles (approx)
        radius: '5000',
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
        //if true we create marker for each
    createMarkers(result);
    }
}
//step 4
//setting up the marker function
function createMarkers(park){
   
    park.forEach(function (place){
        marker= new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            icon:"https://img.icons8.com/plasticine/100/000000/dog-bone.png",
            title: place.name

        });
        // change rectangle or frame of map per result
    bounds.extend(place.geometry.location);
    //calling click event function
    clickEv(marker,place)

    })
    //adjust map to show all visible markers
    map.fitBounds(bounds);

    

};


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
createRating.textContent='Rating:'+place.rating;
parkInfo.appendChild(createRating);
}else{
    let createRating= document.createElement('h4');
let styleRating= createRating.classList.add('styleRating');
createRating.textContent='Rating:N/A';
parkInfo.appendChild(createRating);
}




    }
})    

   }) 

}

