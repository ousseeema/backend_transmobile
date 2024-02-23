const mongoose = require("mongoose");
const requestbody = mongoose.Schema({
 
  fullname : {
    type : String, 
    required : true, 
    trim: true,
    
  },
  phoneNumberof_the_sender :{
    type : String, 
    required : true , 
    trim: true,

  },
  phoneNumberof_the_receiver :{
    type : String, 
    required : true , 
    trim: true,

  },

  fulladdress :{
    type : String, 
    required : true ,
    trim: true,
  }, 
  receivedAdress :{
    type: String, 
    required : true ,
    trim : true
  }, 
  homepickup :{
    type : Boolean,
    default : false,
  },
  homedelivery :{
    type : Boolean,
    default : false,
  },
  packagephoto :{
    type : String,
    required : true,
    
  }



});
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
    type :[requestbody],
    required : true , 
  },
  accepted : {
   type : Boolean, 
  
  },
  refuse :{
    type: Boolean,
  },
   
  createdAt : {
    type : Date,
    default : Date.now(),

  },


});



module.exports = mongoose.model('demande', demande)