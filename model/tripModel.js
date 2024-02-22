const mongoose = require("mongoose");


const tripModel = mongoose.Schema({

  transporter :{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  
  City :{
    type : [{
      type : Map , 
      of : mongoose.Schema.Types.Mixed
    }],
    required : true ,
    minlength : 2,
  },
  Home_pick_up :{
    type : Boolean,
    default : false,  

  },
  Home_delivery :{
    type : Boolean,
    default : false,

  },
  packages :{
    type : [{
      type :Map,
      of :  mongoose.Schema.Types.Mixed
    }],
    default : [],
    required : false,
    select: false
  },
  isDone :{
    type: Boolean,
    default : false,
  }

});


module.exports = mongoose.model('tripModel', tripModel);