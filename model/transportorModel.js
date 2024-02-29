const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const geocoder= require('../utils/geocoder');

const comment = mongoose.Schema({
  fullname :{
    type : String , 
    required : [true, "please enter your name first"],
    trim : true , 

  },
  comment :{
    type : String ,
    required : [true, "Please enter a comment "],
    trim : true ,

  },
  rating :{
    type : Number , 
    default : 0,
    required : [true , "please add a rating to the transporter"]
  },
  createdAt :{
    type : Date ,
    default : Date.now()
  }

});

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
  PhoneNumber_A :{
    type : String,
    required : false ,
    trim : true ,
    unique : true,
    maxlength : 20,
    minlength : 10,
  } , 
  PhoneNumber_B :{
    type : String,
    required : false ,
    trim : true ,
    unique : true,
    maxlength : 20,
    minlength :8,

  },

  Place_A: {
    type: {
      type: String,
      enum: ["Point"],
     //required: [true, 'please enter location ']
    },
    coordinates: {
      type: [Number],
       // required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    Street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  Place_B: {
    type: {
      type: String,
      enum: ["Point"],
     //required: [true, 'please enter location ']
    },
    coordinates: {
      type: [Number],
       // required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    Street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },


  Car_Brand :{
    type : String,
    required : false ,
    trim : true ,
    unique : false,
  },
  Car_SerieNumber:{
    type : String,
    required : false ,
    trim : true ,
    unique : true,
  },
  ListCountry_1:{
    type : [String],
    
    required : false,
    enum :[ "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands",  "Switzerland", "United Kingdom", "Ireland", "Denmark", "Norway", "Sweden"],
    trim : true ,
    unique : false,
  },
  
  ListCountry_2:{
    type : [String],
    
    required : false,
    enum:["Algeria", "Tunisia", "Morocco","Libya"],
    trim : true ,
    unique : false,
  },

  HomePickUps :{
    type : Boolean,
    required : false,
   
  },
  HomeDelivery :{

    type : Boolean,
    required :false,
   
    

  },
  price_kg :{
   type : Number,
   required : false , 
   default: 0, 

  },
  Parsols:{

    type : Boolean,
    required : false,

  },
  Parsols_Site:{
    type: [String],
    enum:["Amazon", "Ebay","Ali Express","Shein","temu" ,"Autre"],
  },
  Adresse_Parsols: {
    type: {
      type: String,
      enum: ["Point"],
     required: false
    },
    coordinates: {
      type: [Number],
       // required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    Street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  profilePicture : {
  type : String,
  default : "default.jpg",
  required : false,
  unique : false,
},
  numberofTrips : {
    type : Number,
    default : 0,
    required : false,
   
},

  numberofClients : {
    type : Number,
    default : 0,
    required : false,
   
  },
  numberofPackages : {
    type : Number,
    default : 0,
    required : false,
 
  },
  LocalAdresse : {
    type : String,
    default : "",
    required : false,
    trim : true ,
    unique : false,
  },


  Role:{
  type : String,
  default : 'Transporter',
  },

  totalRevenue : {
    type : Number,
    default : 0,
    required : false,
   
  },
  verified :{
    type : Boolean,
    default : false,
  },
  pro:{
    type: Boolean,
    default : true ,
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
  }, 
  comments :{
    type :[{
      type : [comment], 
      required : false , 
     
    }]
  },
  //demandeOfDelivery:

 





});
TransporteurModel.pre("save", async function(next){


  if(!this.isModified("password")) return next();
   const  gensalt =await bcrypt.genSalt(3)
  this.password = await bcrypt.hash(this.password,gensalt );
  next();
});
TransporteurModel.methods.matchPassword = function(password){
  return bcrypt.compare(password, this.password);

}

module.exports = mongoose.model("transporteur", TransporteurModel);