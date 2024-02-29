const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const usermodel= require("../../model/userModel")
const {sendRequest,updateUserDetails,getVerified,uploadProfilePicture, getallTransportors,searchForTrip}= require("../../controller/userControler")
//working
router.route("/getAllTransporteur").get(protect(usermodel), getallTransportors);
//working
router.route("/updateUserDetails").put(protect(usermodel), updateUserDetails);
//working
router.route("/uploadProfilePicture").put(protect(usermodel), uploadProfilePicture);
//todo  not done yet messing testing 
router.route("/searchtrip").get(protect(usermodel), searchForTrip);
//working
router.route("/sendrequest").post(protect(usermodel), sendRequest);
//working 
router.route("/getverified").post(protect(usermodel), getVerified);




module.exports = router;