const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const usermodel= require("../../model/userModel")
const {
  getCurrentTrips,
  addReview, getalldemande,  sendRequest,updateUserDetails,getVerified,uploadProfilePicture, getallTransportors,searchForTrip}= require("../../controller/userControler")
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
//working
router.route("/getalldemande/:id").get(protect(usermodel),getalldemande )
//WORKING
router.route("/addreview/:id").put(protect(usermodel), addReview);
// missing testing 
router.route("/currentTrips").get(protect(usermodel), getCurrentTrips);



module.exports = router;