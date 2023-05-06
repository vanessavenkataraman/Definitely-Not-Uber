//variable for map
let map;
//variable for user location marker
let userMarker;
//variable for array of vehicles
let vehicleMarkers = [];

//load the maps API
const mapsScript = document.createElement('script');
mapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDaPv5Vu4W_0lVG6MGRdJ3qukLRAPG3NNA&libraries=geometry,places';
mapsScript.defer = true;
mapsScript.onload = () => {
    console.log('Maps API loaded.');
    //call map initialization function
    initMap();
};
//append map to webpage
document.body.appendChild(mapsScript);

//polyfill functionalities
const polyfillScript = document.createElement('script');
polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=default';
document.body.appendChild(polyfillScript);

//function that gets vehicles from the API and calls createMarkers function
async function getVehicles() {
    const url = 'https://vast-fjord-18474.herokuapp.com/rides';
    const username = 'yCA9BxBx';
    const position = await new Promise((resolve, reject) => {
        //console.log("the issue is here?");
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    //console.log('Retrieving user location...');
    //console.log(position.coords.latitude, position.coords.longitude);
    const { latitude, longitude } = position.coords;
    const params = `username=${username}&lat=${latitude}&lng=${longitude}`;
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            //console.log('API request successful:', data);
            //call createMarkers function to place cars on map
            createMarkers(data);
        } else {
            console.error(xhr.statusText);
        }
    };
    xhr.send(params);
}

//function that takes vehicles from API and portrays them on the map as markers
function createMarkers(data) {
    for (const vehicle of data) {
        //puts each vehicle into the vehicleMarkers array
        vehicleMarkers.push(vehicle);
        console.log('Creating marker for vehicle:', vehicle);
        const marker = new google.maps.Marker({
            position: { lat: vehicle.lat, lng: vehicle.lng },
            map: map,
            icon: 'car.png'
        });
    }
}

//function that finds the closest vehicle to the userMarker and creates a line between those locations
function showClosestVehicle() {
    //console.log("vehicleMarkers:", vehicleMarkers);
    const userLatLng = userMarker.getPosition();
    let closestVehicle = null;
    let closestDistance = Infinity;
    //loop finds closest vehicle
    for (const marker of vehicleMarkers) {
        const vehicleLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, vehicleLatLng);
        //console.log("distance:", distance);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestVehicle = marker;
        }
}
    //console.log("closestVehicle:", closestVehicle);
    if (closestVehicle) {
        const distanceMiles = (closestDistance / 1609.344).toFixed(2);
        const contentString = `Closest vehicle is ${distanceMiles} miles away.`;
        const infoWindow = new google.maps.InfoWindow({
            content: contentString,
        });
        infoWindow.open(map, userMarker);

        // create a polyline from userMarker to closestVehicle
        const closestVehicleLatLng = new google.maps.LatLng(closestVehicle.lat, closestVehicle.lng);
        const polyline = new google.maps.Polyline({
            path: [userLatLng, closestVehicleLatLng],
            //purple line
            strokeColor: "#8A2BE2",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map
        });
    } else {
        console.log('No vehicles found.');
    }
}

//function that initializes the map using Google Maps API
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps","geometry","places");
  map = new Map(document.getElementById("map"), {
    //South Station in Boston
    center: { lat: 42.352271, lng: -71.05524200000001 },
    zoom: 14,
  });
//finds user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const userLocation = new google.maps.LatLng(latitude, longitude);
      userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        icon: null,
      });
      //sets map center to user's current location
      map.setCenter(userLocation);
      //finds closest vehicles to user's location
      getVehicles();
      //shows info on closest vehicle with click
      userMarker.addListener('click', showClosestVehicle);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

//static vehicles from part 1
  const vehicles = [
    { id: "mXfkjrFw", lat: 42.3453, lng: -71.0464 },
    { id: "nZXB8ZHz", lat: 42.3662, lng: -71.0621 },
    { id: "Tkwu74WC", lat: 42.3603, lng: -71.0547 },
    { id: "5KWpnAJN", lat: 42.3472, lng: -71.0802 },
    { id: "uf5ZrXYw", lat: 42.3663, lng: -71.0544 },
    { id: "VMerzMH8", lat: 42.3542, lng: -71.0704 },
  ];

  for (const vehicle of vehicles) {
    const marker = new google.maps.Marker({
      position: { lat: vehicle.lat, lng: vehicle.lng },
      map: map,
      icon: "car.png",
    });
  }
}