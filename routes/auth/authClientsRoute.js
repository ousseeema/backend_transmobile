const express = require('express');
const router = express.Router();
const {sign_up_1,sign_up_2, signin,forgotpassword}= require('../../controller/authController')
const ClientModel = require("../../model/userModel");
router.route('/signin').post(signin(ClientModel));
router.route("/signup1").post(sign_up_1(ClientModel));
router.route("/signup2").post(sign_up_2(ClientModel));
router.route("/forgotpassword").post(forgotpassword(ClientModel));
router.route("/resetpassword").post();


module.exports = router;