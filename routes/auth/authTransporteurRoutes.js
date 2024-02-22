const express = require('express');
const router = express.Router();
const {sign_up_1,sign_up_2, signin, forgotpassword, resetpassword, }= require('../../controller/authController')
const transporteurModel = require("../../model/transportorModel");
router.route('/signin').post(signin(transporteurModel));
router.route("/signup1").post(sign_up_1(transporteurModel));
router.route("/signup2").post(sign_up_2(transporteurModel));
router.route("/forgotpassword").post(forgotpassword(transporteurModel));
router.route("/resetpassword").post(resetpassword(transporteurModel));



module.exports = router;