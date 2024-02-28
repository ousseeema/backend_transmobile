const mongoose = require("mongoose");



const verified = mongoose.Schema({
 
  demander_id :{
    type: mongoose.Schema.ObjectId,
  required: true
},
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