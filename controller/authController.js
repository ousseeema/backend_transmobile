const jwt = require("jsonwebtoken");

const asynchandler = require("../middleware/asynchandller");
const sendemail = require("../utils/mailtrapper");
const crypto = require("crypto");
const secret ="zui87fze69f8z9f7zef74ef";
exports.sign_up_1 = (model) =>
  asynchandler(async (req, res, next) => {
    const user = await model.create(req.body);

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
    const random_number = crypto.randomBytes(5).toString("hex");
    const verification_code = crypto
      .createHash("sha256")
      .update(random_number)
      .digest("hex");

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
        status: "error in the code",

        success: false,
        message: "invalid verification code, try again",
        data: [],
        token: null,
      });
    }

    // if verification code is correct but the time has passedout delete the user and
    // send a response back to the user to create another account

    if (user.verification_code_expire < Date.now()) {
      const delete_user = await model.findOneAndDelete({
        verification_code: req.body.verification_code,
      });

      return res.status(400).send({
        status: "Date has expired",
        success: false,
        message:
          "verification code expired, try creating another account again",
        data: [],
        token: null,
      });
    }

    //creating jwt token for the logged user
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "15d",
    });
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
      const Token = jwt.sign({ id: user._id },secret);
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

// todo: implement reset passsword end point , forgotpassword end point

exports.forgotpassword = (model) => asynchandler(async (req, res, next) => {

   const {email} = req.body;


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


    const randomNumber = crypto.randomBytes(2).toString("hex");
    const resetToken = crypto.createHash("sha256").update(randomNumber).digest("hex"); 

  const message ={
    emailto: email,
    subject: "Password Reset",
    text: `Your password reset token is ${resetToken}`
  }

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



  exports.resetoassword = (model)=>asynchandler(async(req, res, next )=>{

 
     const {
      newpassword, 
      resettoken 
     } = req.body;
     const user = await model.findOne({resetToken: resettoken, 
      
    }).select("+password");
    if(!user){
      return res.status(404).send({
        status: "fail",
        success: false,
        message: "invalid token",
        data: [],
        token: null,
      
      });
    }

    if(user.resetTokenExpire<Date.now()){
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
    const logedToken = await jwt.sign({id : user._id, secret})
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
  





