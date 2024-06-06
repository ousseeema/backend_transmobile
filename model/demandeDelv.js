const mongoose = require("mongoose");
const requestbody = mongoose.Schema({
 
 
  numberofkg :{
    type : Number, 
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

  Pickupaddress :{
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
    
  },
  



});
const  demande = mongoose.Schema({
  Client :{
    type : mongoose.Schema.ObjectId,
    ref:"user",
    required : true,
    

  }, 
  transporter :{

    type : mongoose.Schema.ObjectId,
    ref: 'transporteur',
    required : true ,
    

  }, 

  
 
  
  message : {
    type :requestbody,
    required : true , 
  },
  accepted:{
    type : Boolean,
    default : false,
  },
  refused:{
    type : Boolean,
    default : false,
   
  },
   
  createdAt : {
    type : Date,
    default : Date.now(),

  },


});



module.exports = mongoose.model('demande', demande)