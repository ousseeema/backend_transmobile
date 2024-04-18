const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const usermodel= require("../../model/userModel")
const {
  checkemailBeforechange,
  changepasword,
  getCurrentTrips,
  getallTrips,
  addReview, getalldemande,  sendRequest,updateUserDetails,getVerified, getallTransportors,searchForTrip}= require("../../controller/userControler")
//working
router.route("/getAllTransporteur").get(protect(usermodel), getallTransportors);
//working
router.route("/updateUserDetails").put(protect(usermodel), updateUserDetails);

//working 
router.route("/searchtrip").get(protect(usermodel), searchForTrip);
//working
router.route("/sendrequest").post(protect(usermodel), sendRequest);
//working
router.route("/getverified").post(protect(usermodel), getVerified);
//working
router.route("/getalldemande/:id").get(protect(usermodel),getalldemande )
//WORKING
router.route("/addreview/:id").put(protect(usermodel), addReview);
// working
router.route("/currentTrips").get(protect(usermodel), getCurrentTrips);
// working 
router.route("/getalltrips").get(protect(usermodel),getallTrips);
// working
router.route("/changeuseremail").put(protect(usermodel), checkemailBeforechange);
// working
router.route("/changepassword").put(protect(usermodel), changepasword);



module.exports = router;