const express = require('express');
const router = express.Router();
const {sign_up_1,sign_up_2, signin, forgotpassword, resetpassword, resendVerificationCode}= require('../../controller/authController')
const transporteurModel = require("../../model/transportorModel");
//working
router.route('/signin').post(signin(transporteurModel));
//working
router.route("/signup1").post(sign_up_1(transporteurModel));
//working
router.route("/signup2").post(sign_up_2(transporteurModel));
//working
router.route("/forgotpassword").put(forgotpassword(transporteurModel));
//working
router.route("/resetpassword").put(resetpassword(transporteurModel));
//working
router.route("/resendverificationcode").put(resendVerificationCode(transporteurModel));



module.exports = router;