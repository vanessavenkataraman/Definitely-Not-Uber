const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const cors = require('cors');
//javascript library that can generate fake addresses
const faker = require('faker');

const PORT = process.env.PORT || 5001


//generates car array
const generateCars = () => {
  return [
    { _id: "car1", username: "Chris", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car2", username: "Suzie", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car3", username: "Alex", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car4", username: "Daniel", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car5", username: "David", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car6", username: "Marcelo", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car7", username: "Rayana", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car8", username: "Danielle", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car9", username: "Kayla", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
    { _id: "car10", username: "Guillerme", lat: getRandomLat(), lng: getRandomLng(), created_at: new Date().toISOString() },
  ];
}

// function generates a random latitude
function getRandomLat() {
  return Number(faker.address.latitude());
}

// function generates a random longitude
function getRandomLng() {
  return Number(faker.address.longitude());
}

//checks that each object in the array has all required fields
const validateCars = (cars) => {
  const requiredFields = ['username', 'lat', 'lng'];
  for (const car of cars) {
    for (const field of requiredFields) {
      //if there is a field missing, returns error message
      if (!car[field]) {
        return {"error":"Whoops, something is wrong with your data!"};
      }
    }
  }
  //if all fields are present there is no error
  return null;
}

express()
  .use(cors()) //enables CORS
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .post('/rides', (req, res) => {
    const cars = generateCars();
    const error = validateCars(cars);
    //if and else statement to either return error message or cars array
    if (error) {
      res.json(error);
    } else {
      res.json(cars); 
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
