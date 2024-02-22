const mongoose = require("mongoose");

const  demande = mongoose.Schema({
  Client :{
    type : mongoose.Schema.ObjectId,
    required : true , 

  }, 
  transporter :{

    type : mongoose.Schema.ObjectId,
    required : true , 

  }, 
  message : {
    type :Map,
    required : true , 
  },
  accepted : {
   type : Boolean, 
   default : false 
  },
   
  createdAt : {
    type : Date,
    default : Date.now(),

  },


});



module.exports = mongoose.model('demande', demande)