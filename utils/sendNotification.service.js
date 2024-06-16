const{ONE_SIGNAL_CONFIG}= require('../config/config.app');
async function SendNotification(data, callback) {
  var header = {
    "Content-Type" : "application/json; charset=utf-8" ,
    "Authorization" :"basic "+ONE_SIGNAL_CONFIG.API_KEY,


  }

  var options ={
    host :"onesignal.com",
    port: 443,
    
    
  }
  

}