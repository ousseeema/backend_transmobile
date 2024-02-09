const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asynchandler = require("../middleware/asynchandller");
const sendemail = require("../utils/mailtrapper");
const crypto = require("crypto");

exports.sign_up_1 = (model) =>
  asynchandler(async (req, res, next) => {
    if (!(req.fullname && req.password && req.email)) {
      return res.status(400).json({
        status: "fail",
        message: "please provide username, password and email address",
        data: [],
        token: null,
      });
    }

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
    const random_number = crypto.randomBytes(15).toString("hex");
    const verification_code = crypto
      .createHash("sha256")
      .update(random_number)
      .digest("hex");

    // options to pass to the sendemail function
    const options = {
      emailto: req.email,
      subject: "Account Verification",
      text: `dear ${req.fullname} enter this code to verifie your email ${verification_code}`,
    };

    // sending the email
    sendemail(options).catch((err) => {
      console.log(err);
      return res.status(500).send({
        status: "fail",
        success: false,
        message: "unable to send verification email",
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
      message: "check your email to verify your account",
      success: true,
      data: [],
      token: null,
    });
  });

 exports.sign_up_2 = (model) =>
  asynchandler(async (req, res, next) => {
    const valide_user = model.findOne({
      verification_code: req.body.verification_code,
    });

    // if verification code is not valid the user will have the chance to re enter the code
    if (!valide_user) {
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

    if(valide_user.verification_code_expire < Date.now()) {

      const delete_user = await model.findOneAndDelete({
        verification_code: req.body.verification_code
      });
      
      return res.status(400).send({
        status: "Date has expired",
        success: false,
        message: "verification code expired, try creating another account again",
        data: [],
        token: null,
      });
    }

    // if the verification code is correct and the time has not expired then  create a token for the user

    try {
    user.verification_code = undefined;
    user.verification_code_expire = undefined;
    user.save({
      validateBeforeSave: false
    });

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "15d"
    });

    return res.status(200).send({
      status: "success",
      success: true,
      message: "You are verified successfully",
      data: user,
      token: token
    });
    } catch (err) {
      return res.status(500).send({
        status: "fail",
        success: false,
        message: "unable to create account due to server error",
        data: [],
        token: null
      });
      
    }




  });
