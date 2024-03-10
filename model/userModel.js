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
  Phone_Number:{
     type : String ,
      required : false ,
      trim : true ,
      maxlength : [20,'Phone number can not be longer than 20 characters'],
      minlength:[8,'Phone number can not be longer than 8 characters'],
  },

  password : {
    type : String,
    required : [true, "Please enter your password"] ,
    trim : true ,
    unique : false,
    minlength:[8, "Password must be at least 8 characters long"],
    select : false,
  },
  Role:{
    type : String,
    default : 'Client',
    },

    fulladdress :{
      type : String ,
      trim: true ,
      
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
 
  country : {
    type : String,
    default : "",
    required : false,
    trim : true ,
    unique : false,
  },
  profilePicture :{
    type: String, 
    default : "default.jpg"
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
  },
  Historique :{
    type : [
      {
        type : Map, 
        of : mongoose.Schema.Types.Mixed
      }
    ]
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