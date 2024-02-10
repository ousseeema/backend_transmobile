const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const TransporteurModel = mongoose.Schema({

  fullName : 
  {
  type : String,
   required : [true, "Please enter your full name"] ,
   trim : true ,
   unique : false,

  }, 
  email :{
    type : String,
    required : [true, "Please enter your email"] ,
    trim : true ,
    unique : true, 
    match : [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ], 
    maxlength : 150,
    minlength : 10,


  },

  password : {
    type : String,
    required : [true, "Please enter your password"] ,
    trim : true ,
    unique : false,
    select : false,
  },

  numberofClients : {
    type : Number,
    default : 0,
    required : false,
    trim : true ,
    unique : false,
  },
  numberofPackages : {
    type : Number,
    default : 0,
    required : false,
    trim : true ,
    unique : false,
  },
  LocalAdresse : {
    type : String,
    default : "",
    required : false,
    trim : true ,
    unique : false,
  },

  Clients : {
    type : Array,
    default : [],
    required : false,
    trim : true ,
    unique : false,
  },

  totalRevenue : {
    type : Number,
    default : 0,
    required : false,
    trim : true ,
    unique : false,
  },
  CarteNumber : {
    type : String,
    required :false ,
    trim : true ,
    unique : true,
    maxlength : 16,
    minlength : 16,

  },
  


  resetToken : {
    type : String,
    required : false,
   default : undefined,
  },


  resetTokenExpire : {
    type : Date,
    required : false,
    default : undefined,
  },


  createdAt:{
    type: Date,
    default : Date.now
   },
    verification_code :{
    type : String , 
    default : undefined,
    required : false ,
  },
  verification_code_expire :{
    type : Date, 
    default : undefined,
  }
 





});
TransporteurModel.pre("save", async function(next){


  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, "westudySG");
  next();
});

module.exports = mongoose.model("transporteur", TransporteurModel);