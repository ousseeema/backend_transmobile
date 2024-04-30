const mongoose = require("mongoose");


const mmessageModel = mongoose.Schema({

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