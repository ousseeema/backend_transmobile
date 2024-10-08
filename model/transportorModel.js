const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const geocoder= require('../utils/geocoder');

const comment = mongoose.Schema({
 
  user: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "user"
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
    maxlength : 15,
    minlength : 5,
  } , 
  PhoneNumber_B :{
    type : String,
    required : true ,
    
    
    maxlength : 20,
    minlength :5,

  },

  DestinationAddress: {
   type: String,
   required : true ,
   
  },
  localAddress: {
    type: String,
    required : true ,
    
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

    type :String,
    
    required : true,
    enum :[ "Österreich", "België", "Danmark", "France", "Deutschland", "Éire", "Italia",  "Nederland", "Norge", "Portugal", "España", "Sverige", "Schweiz","United Kingdom"],
    trim : true ,
    unique : false,
  },
  
  ListCountry_2:{
    type : String,
    
    required : true,
    enum:["Algeria", "Tunisie", "Morocco","Libya"],
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
   double: true

  },
  Parsols:{

    type : Boolean,
    required : true,

  },
  Parsols_Site:{
    required : false,
    type: [String],

    enum:["Amazon", "Ebay","Ali Express","Shein","Temu" ,"Autres"],
  },
  Adresse_Parsols: {
    
      type: String,
     required: false
    
     },
  profilePicture : {
  type : String,
  required : false,
},
  numberofTrips : {
    type : Number,
    default : 0,
    required : false,
    double: true
},

  numberofClients : {
    type : Number,
    default : 0,
    required : false,
    double: true
  },
  numberofPackages : {
    type : Number,
    default : 0,
    required : false,
    double: true
 
  },
  
  Role:{
  type : String,
  default : 'Transporter',
  },


  totalRevenue : {
    type : Number,
    default : 0,
    required : false,
    double: true
   
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
   pushNotificationId :{
    type :String,
    required : false ,
   }

 





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
transporteur = mongoose.model("transporteur", TransporteurModel)

module.exports = transporteur;