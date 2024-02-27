const express = require('express');
const router = express.Router();
const {sign_up_1,sign_up_2, signin,forgotpassword,resetpassword, 
resendVerificationCode,
}= require('../../controller/authController');
//user model 
const ClientModel = require("../../model/userModel");
//working
router.route('/signin').post(signin(ClientModel));
//working
router.route("/signup1").post(sign_up_1(ClientModel));
//working
router.route("/signup2").post(sign_up_2(ClientModel));
//working
router.route("/forgotpassword").post(forgotpassword(ClientModel));
//working
router.route("/resetpassword").post(resetpassword(ClientModel));
//working
router.route("/resendverificationcode").post(resendVerificationCode(ClientModel));

module.exports = router;