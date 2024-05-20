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
    type :  [{
      user: mongoose.Schema.Types.ObjectId,
      message: String,
      
      CreatedAt:{
         type:Date,
         default: Date.now()
      }
    }], 
   },
   createdAt:{
      type: Date,
      default: Date.now()
      
   }


});

module.exports = mongoose.model('Message',messageModel)