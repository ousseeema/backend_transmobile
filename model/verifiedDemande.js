const mongoose = require("mongoose");



const verified = mongoose.Schema({
 
  demander_id : mongoose.Schema.ObjectId,
  fullname :{
    type: String , 
    required : true, 
    trim : true,
  },
  passport_image : {
    type : String ,
    required : true,
  },
  message : {
    type : String , 
    required : true ,

  },
  createdAt :{
    type : Date ,
    default : Date.now()
  }

});

module.exports = mongoose.model("verified", verified);