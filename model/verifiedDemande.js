const mongoose = require("mongoose");



const verified = mongoose.Schema({
 
  userId :{
    type: mongoose.Schema.Types.ObjectId , 
    required : true, 
  
  },
  
  
  passport_image : {
    type : String ,
    required : true,
  },
  message : {
    type : String , 
    required : true ,

  },
  approved :{
    type: Boolean ,
    default : false
  },
  createdAt :{
    type : Date ,
    default : Date.now()
  }

});

module.exports = mongoose.model("verifi",verified);