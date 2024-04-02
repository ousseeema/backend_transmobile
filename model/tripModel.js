const mongoose = require("mongoose");


const City = mongoose.Schema({
  city:{
    type: String,
    required: true,
    trim: true,
  },
  dateofpassage: Date,
  Done:{
    type : Boolean,
    default : false,
    required : true
  }
});



const tripModel = mongoose.Schema({



  transporter :{
    type:mongoose.Schema.Types.ObjectId,
   
  ref:"transporteur"
  },
  
  
  Citys :{
    type : [City],
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
    type : Array,
    default : [],
    
  },
  isDone :{
    type: Boolean,
    default : false,
  },
  createdAt :{
    type : Date,
    default : Date.now()
  },

});


module.exports = mongoose.model('tripModel', tripModel);