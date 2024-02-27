const NodeGeocoder = require('node-geocoder');

const options = {
  provider: "mapquest" ,
  
  apiKey:"7Ru4dMwlavU2jvhUO7Cm6qwXjrGJPVOs" , 
  httpAdapter : 'http',
  formatter: null 
};
const geocoder = NodeGeocoder(options);
module.exports= geocoder;