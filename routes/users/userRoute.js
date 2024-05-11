const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const usermodel= require("../../model/userModel")
const {
  getCurrentUser,
  getListofMessage,
  Contactadmin,
  getallverificationdemandes,
  checkemailBeforechange,
  changepasword,
  getCurrentTrips,
  getallTrips,
  addReview, getalldemande,  sendRequest,updateUserDetails,getVerified, getallTransportors,searchForTrip}= require("../../controller/userControler")
//working
  router.route("/getListOfMessage").get(protect(usermodel),getListofMessage );

  // working 
router.route("/sendReclamationRequest").post(protect(usermodel),Contactadmin );
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
router.route("/getalldemande").get(protect(usermodel),getalldemande )
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
// working
router.route("/GetverificationDemandesList").get(protect(usermodel), getallverificationdemandes);

// working 
router.route('/getcurrentuser').get(protect(usermodel), getCurrentUser);
module.exports = router;