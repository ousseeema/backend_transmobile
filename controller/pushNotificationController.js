const PushNotificationService = require("../utils/sendNotification.service");
const {ONE_SIGNAL_CONFIG} =require('../config/config.app');

// send notification for all users
exports.SendNotification = (req, res, next) => {
 var message = {
  app_id: ONE_SIGNAL_CONFIG.APP_ID,
  contents:{
    'en':"Test Push Notifications"
  },
  included_segments:["All"], 
  content_available:true,
  small_icon: "ic_notification_icon",
  data:{
    PushTitle : "Notifications",
  }



 }
 PushNotificationService.SendNotification(message, (err, result) => {
  if(err){
    return next(err);
  }
  return res.status(200).send(
    {
      message: 'success',
      data: result
    }
  )
 })

};


// push notification for single user a plus 
exports.sendNotifcationToDevice = (devices) => {
  var message = {
   app_id: ONE_SIGNAL_CONFIG.APP_ID,
   contents:{
     'en':"Notifications"
   },
   included_segments:["included_player_ids"], 
   included_playerè_ids : devices ,
   content_available:true,
   small_icon: "ic_notification_icon",
   data:{
     PushTitle : "Notifications",
   }
 
 
 
  }
  PushNotificationService.SendNotification(message, (err, result) => {
   if(err){
     return next(err);
   }
   return res.status(200).send(
     {
       message: 'success',
       data: result
     }
   )
  })
 
 };