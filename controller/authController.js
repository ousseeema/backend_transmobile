const jwt = require("jsonwebtoken");

const asynchandler = require("../middleware/asynchandller");
const sendemail = require("../utils/mailtrapper");
const crypto = require("crypto");
const secret = "zui87fze69f8z9f7zef74ef";
const clientmodel=  require("../model/userModel");
const transportermodel =require("../model/transportorModel");
exports.sign_up_1 = (model) =>
  asynchandler(async (req, res, next) => {

    if(!req.body.data){
      return res.status(404).send({
        message : "please enter your info",
        success : false,
        data:[]
      })
    }
  let request = JSON.parse(req.body.data);
   
   if(req.body.data.password){
    return res.status(400).send({
      success : false ,
      message : "You can't update password from here",
      data : []
    });
   }


   
  const file = req.files.file;
  if(!file){
    return res.status(400).send({
      success : false ,
      message : "Please upload a photo",
      data : []
    });
  }

  if(file.size> 1000000){
    return res.status(400).send({
      success : false ,
      message : "File size should not exceed 1MB",
      data : []
    });

  }
    let who ;
  if(model ===clientmodel ){
   who = "users"
  }
  else if(model=== transportermodel){
    who="transporteurs";
  }

  file.name = `${who}_${req.user.id}${path.parse(file.name).ext}`;
   request.profilePicture = file.name;
   file.mv(`./Images/private/${who}/${file.name}`);



     


    const user = await model.create(request);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "unable to create user due to invalid data",
        data: [],
        token: null,
      });
    }

    // sending a verification email to the user

    //creating a random number from 15 octets then converting it to hexadecimal and hashing it to sha256 then converting it to hexadecimal
    const random = crypto.randomBytes(2);
    // to create a random number bettween 1000 and 9999
    const verification_code = (random.readUInt16BE(0) % 9000) + 1000;

    // options to pass to the sendemail function
    const options = {
      emailto: req.body.email,
      subject: "Account Verification",
      text: `dear ${req.body.fullname} enter this code to verifie your email ${verification_code}`,
    };

    // sending the email
    await sendemail(options).catch((err) => {
      return res.status(500).send({
        status: "fail",
        success: false,
        message: "unable to send verification code",
        data: [],
        token: null,
      });
    });

    // updating the user with the verification code and time to expire
    user.verification_code = verification_code;
    user.verification_code_expire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({
      validateBeforeSave: false,
    });

    // if all of the work is done successfully then send a response to the user
    return res.status(200).send({
      message: "Check your email to verify your account",
      success: true,
      data: [],
      token: null,
    });
  });

exports.sign_up_2 = (model) =>
  asynchandler(async (req, res, next) => {
    const user = await model.findOne({
      verification_code: req.body.verification_code,
    });

    // if verification code is not valid the user will have the chance to re enter the code
    if (!user) {
      return res.status(400).send({
        status: "fail",

        success: false,
        message: "invalid verification code, try again",
        data: [],
        token: null,
      });
    }

    // if verification code is correct but the time has passedout delete the user and
    // send a response back to the user to create another account

    if (user.verification_code_expire < Date.now()) {
    
      return res.status(400).send({
        status: "fail",
        success: false,
        message:
          "verification code expired, try sending another code",
        data: [],
        token: null,
      });
    }

    //creating jwt token for the logged user
    const token = jwt.sign({ id: user._id }, secret);
    // if the verification code is correct and the time has not expired then  remove the verification code and the
    // time to expire from the account info
    const newuser = await model.findOneAndUpdate(
      user._id,
      {
        $unset: { verification_code: 1, verification_code_expire: 1 },
      },
      { new: true }
    );

    return res.status(200).send({
      status: "success",
      success: true,
      message: "You are verified successfully",
      data: newuser,
      token: token,
    });
  });

exports.signin = (model) =>
  asynchandler(async (req, res, next) => {
    const { email, password } = req.body;
    // testing if the client/transporteur already has typed information
    if (!email || !password) {
      return res.status(400).send({
        status: "fail",
        success: false,
        message: "Invalid credentials",
        data: [],
        token: null,
      });
    }

    const user = await model.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(400).send({
        status: "fail",
        success: false,
        message: "invalid creadentials",
        data: [],
        token: null,
      });
    }

    const isMatched = await user.matchPassword(password);

    if (!isMatched) {
      return res.status(400).send({
        status: "fail",
        success: false,
        message: "invalid creadentials",
        data: [],
        token: null,
      });
    }
    try {
      const Token = jwt.sign({ id: user._id }, secret);
      return res.status(200).send({
        status: "success",
        success: true,
        message: "you are logged in",
        data: user,
        token: Token,
      });
    } catch (err) {
      return res.status(500).send({
        status: "fail",
        success: false,
        message: "unable to create account due to server error",
        data: [],
        token: null,
      });
    }
  });

// api end point for sending reset password token to the email of the user 
exports.forgotpassword = (model) =>
  asynchandler(async (req, res, next) => {
    const { email } = req.body;
        
    const user = await model.findOne({ email: email });

    if (!user) {
      return res.status(400).send({
        status: "fail",
        success: false,
        message: "invalid creadentials",
        data: [],
        token: null,
      });
    }
    const random = crypto.randomBytes(2);
    // to create a random number bettween 1000 and 9999
    const resetToken = (random.readUInt16BE(0) % 9000) + 1000;

    const message = {
      emailto: email,
      subject: "Password Reset",
      text: `Your password reset token is ${resetToken}`,
    };

    try {
      await sendemail(message);
      user.resetToken = resetToken;
      user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
      user.save({
        validateBeforeSave: false,
      });

      return res.status(200).send({
        status: "success",
        success: true,
        message: "reset token sent to your email",
        data: [],
        token: null,
      });
    } catch (err) {
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).send({
        status: "fail",
        success: false,
        message: "unable to send email",
        data: [],
        token: null,
      });
    }
  });


  // api end point for resetpassword with the new password 
exports.resetpassword = (model) =>
  asynchandler(async (req, res, next) => {
    const { newpassword, resettoken } = req.body;
    const user = await model
      .findOne({ resetToken: resettoken })
      .select("+password");
    if (!user) {
      return res.status(404).send({
        status: "fail",
        success: false,
        message: "invalid token",
        data: [],
        token: null,
      });
    }

    if (user.resetTokenExpire < Date.now()) {
      return res.status(404).send({
        status: "fail",
        success: false,
        message: "token expired",
        data: [],
        token: null,
      });
    }

    try {
      user.password = newpassword;
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      const logedToken = await jwt.sign({ id: user._id, secret });
      await user.save({
        validateBeforeSave: true,
      });

      return res.status(200).send({
        status: "success",
        success: true,
        message: "password reset successfully",
        data: user,
        token: logedToken,
      });
    } catch (err) {
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).send({
        status: "fail",
        success: false,
        message: "unable to reset password",
        data: [],
        token: null,
      });
    }
  });

// api end point to resend a verification code to the email addresse of the user

exports.resendVerificationCode = (model) =>
  asynchandler(async (req, res, next) => {
    const user = await model.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).send({
        status: "fail",
        success: false,
        message: "user not found",
        data: [],
        token: null,
      });
    }
    try {
      const random = crypto.randomBytes(2);
      // to create a random number bettween 1000 and 9999
      const randomNumber = (random.readUInt16BE(0) % 9000) + 1000;
      // content of the email
      const message = {
        emailto: req.body.email,
        subject: "re-send verification code",
        text: `Your verification code is ${randomNumber}`,
      };
      // sending the email
      await sendemail(message);
      // saving the new verification code to the client model
      user.verification_code = randomNumber;
      user.verification_code_expire = new Date(Date.now() + 10 * 60 * 1000);
      await user.save({
        validateBeforeSave: false,
      });

      return res.status(200).send({
        success: true,
        status: "success",
        message: "code has been sent to your email",
        data: [],
      });
    } catch (err) {
      return res.status(400).send({
        success: false,
        status: "fail",
        message: "Error while sending verification code",
        data: [],
      });
    }
  });


