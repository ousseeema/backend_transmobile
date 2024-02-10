const express = require('express');
const router = express.Router();
const {sign_up_1,sign_up_2}= require('../controller/authController')

router.route('/signin').post();
router.route("signup_1").post(sign_up_1);
router.route("signup_2").post(sign_up_2);
router.route("/forgotpassword").post();
router.route("/resetpassword").post();