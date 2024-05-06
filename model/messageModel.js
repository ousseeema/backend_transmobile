const mongoose = require("mongoose");


const messageModel = mongoose.Schema({

   clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required: true
   },
   transporteur:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'transporteur',
    required: true
   },

   messages: {
    type :  [Map], 
   }


});

module.exports = mongoose.model('Message',messageModel)