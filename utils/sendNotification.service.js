const { json } = require('express');
const{ONE_SIGNAL_CONFIG}= require('../config/config.app');
async function SendNotification(data, callback) {
  var headers = {
    "Content-Type" : "application/json; charset=utf-8" ,
    "Authorization" :"basic "+ONE_SIGNAL_CONFIG.API_KEY,


  }

  var options ={
    host :"onesignal.com",
    port: 443,
    path:"/api/v0/notifications",
     method: "POST",
     headers: headers
  }
  var http = require('http');
  var req =  http.request(options, function(res){
   res.on('data', function(data){
    console.log(JSON.parse(data));
    return callback(null , JSON.parse(data));
   });
  });
  req.on("error", function(err){
  return  callback({message:err.message});

  });
  req.write(json.stringify(data));
  req.end();
  
  

}
module.exports = {
  SendNotification
}