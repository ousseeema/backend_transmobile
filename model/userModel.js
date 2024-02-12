const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = mongoose.Schema({







  fullname : 
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
  Phoen_Number:{
     type : String ,
      required : [true, "Please enter your phone number"] ,
      trim : true ,
      maxlength : [20,'Phone number can not be longer than 20 characters'],
      minlength:[8,'Phone number can not be longer than 8 characters'],
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
  numberofPackagesSended : {
    type : Number,
    default : 0,
    required : false,
    trim : true ,
    unique : false,
  }, 
  numberofPackagesDelivred : {
    type : Number,
    default : 0,
    required : false,
    trim : true ,
    unique : false,
  },
  destine_City:{
    type : String,

    required : true,
    trim : true ,
    unique : false,
  },
  country : {
    type : String,
    default : "",
    required : false,
    trim : true ,
    unique : false,
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
    default : Date.now()
   },
  verification_code :{
    type : String , 
    
    
  }
  ,
  verification_code_expire :{
    type : Date, 
  }


});


userModel.pre("save", async function(next){


  if(!this.isModified("password")) return next();
  const gensalt =await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,gensalt);
  next();
});

userModel.methods.matchPassword = function(password){
  return bcrypt.compare(password, this.password);

}

module.exports = mongoose.model("user", userModel);