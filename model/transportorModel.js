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
    max :5,
    min: 0,
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
    required : true ,   
    maxlength : 20,
    minlength : 10,
  } , 
  PhoneNumber_B :{
    type : String,
    required : true ,
    
    
    maxlength : 20,
    minlength :8,

  },

  DestinationAddress: {
    type: {
      type: String,
      required: [true, 'please enter location ']
    },
   
  },
  localAddress: {
    type: {
      type: String,
      
     required: [true, 'please enter location ']
    },
    
  },


  Car_Brand :{
    type : String,
    required : true ,
    trim : true ,
  },
  Car_SerieNumber:{
    type : String,
    required : true ,
    trim : true ,
  },
  ListCountry_1:{
    type : [String],
    
    required : true,
    enum :[ "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands",  "Switzerland", "United Kingdom", "Ireland", "Denmark", "Norway", "Sweden"],
    trim : true ,
    unique : false,
  },
  
  ListCountry_2:{
    type : [String],
    
    required : true,
    enum:["Algeria", "Tunisia", "Morocco","Libya"],
    trim : true ,
    unique : false,
  },

  HomePickUps :{
    type : Boolean,
    required : true,
   
  },
  HomeDelivery :{

    type : Boolean,
    required :true,
   
    

  },
  price_kg :{
   type : Number,
   required : true , 
   default: 0, 

  },
  Parsols:{

    type : Boolean,
    required : true,

  },
  Parsols_Site:{
    required : false,
    type: [String],
    enum:["Amazon", "Ebay","Ali Express","Shein","temu" ,"Autres"],
  },
  Adresse_Parsols: {
    type: {
      type: String,
     required: false
    },
     },
  profilePicture : {
  type : String,
  required : true,
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
    type :[comment]
  },
  

 





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