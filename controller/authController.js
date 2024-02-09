 const jwt = require("jsonwebtoken");
  const bcrypt = require("bcryptjs");
  const asynchandler = require("../middleware/asynchandller")
  const sendemail= require('../utils/mailtrapper');
  const crypto = require('crypto');

  exports.sign_up_1 = (model)=> asynchandler(async(req, res, next )=>{
     

    if(!(req.fullname && req.password&& req.email)){


      return res.status(400).json({
        status : "fail",
        message : "please provide username, password and email address", 
        data :[],
        token : null
      });
    }


    const user = await model.create(req.body);

    if(!user){

      return res.status(400).json({
        status : "fail",
        message : "unable to create user due to invalid data", 
        data :[],
        token : null
      });
    }

        // sending a verification email to the user 

        //creating a random number from 15 octets then converting it to hexadecimal and hashing it to sha256 then converting it to hexadecimal
        const random_number= crypto.randomBytes(15).toString("hex");
        const verification_code = crypto.createHash("sha256").update(random_number).digest("hex");


        
          // options to pass to the sendemail function
        const options = {
          emailto : req.email,
          subject : "Account Verification",
          text : `dear ${req.fullname} enter this code to verifie your email ${verification_code}`
        }

        // sending the email 
        sendemail(options).catch((err)=>{

          console.log(err);
          return res.status(500).send({
            status : "fail",
            success : false,
            message : "unable to send verification email", 
            data :[],
            token : null
          });
        });

        // updating the user with the verification code 
        user.verification_code = verification_code;
       await user.save({
          validateBeforeSave : false
        });


    // if all of the work is done successfully then send a response to the user
    return res.status(200).send({
      message : "check your email to verify your account",
      success : true, 
      data :[],
      token : null

    });

  });

  exports.sign_up_2 = (model)=>(asynchandler(async(req, res, next )=>{

    





  }))
