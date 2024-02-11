const express = require('express');
const router = express.Router();
const {sign_up_1,sign_up_2, signin}= require('../../controller/authController')
const transporteurModel = require("../../model/transportorModel");
router.route('/signin').post(signin(transporteurModel));
router.route("/signup1").post(sign_up_1(transporteurModel));
router.route("/signup2").post(sign_up_2(transporteurModel));
router.route("/forgotpassword").post();
router.route("/resetpassword").post();


module.exports = router;