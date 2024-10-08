const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authmid");
const transporteur = require("../../model/transportorModel");

const {
  
  checkemailBeforechange,
  changepasword,
  getAllVerifiedDemande,
  getVerified,
  Contactadmin,
  getListofMessage,
  getCurrentTrip,
  getCurrentTransporter,
  gethistorylist,
  addTrip,
  addTripToHistory,
  updateTrip,
  deleteTrip,
  addSinglePackage,
  updateUserDetails,
  uploadProfilePicture,
  acceptDemande,
  refusedemande,
  getAllPackage_forSingleTrip,
  getAlldemande,
} = require("../../controller/transporteurController");
// working
router
  .route("/transsendreclamation")
  .put(protect(transporteur), updateUserDetails);
//working
router
  .route("/updateTransporteurDetails")
  .put(protect(transporteur), updateUserDetails);
//working
router
  .route("/uploadProfilePicture")
  .post(protect(transporteur), uploadProfilePicture);
//working
router
  .route("/getAllPackage")
  .get(protect(transporteur), getAllPackage_forSingleTrip);
// working
router.route("/acceptDemande/:id").put(protect(transporteur), acceptDemande);
//working
router.route("/refuseDemande/:id").put(protect(transporteur), refusedemande);
//working
router.route("/getAllDemande").get(protect(transporteur), getAlldemande);
//working
router.route("/addtrip").post(protect(transporteur), addTrip);
// working
router.route("/updateTrip/:id").put(protect(transporteur), updateTrip);
//working
router.route("/deleteTrip/:id").delete(protect(transporteur), deleteTrip);
//working
router
  .route("/addSinglepackage/:id")
  .put(protect(transporteur), addSinglePackage);
//working
router.route("/getAlltrips").get(protect(transporteur), gethistorylist);
// working
router
  .route("/addtriptohistory/:id")
  .put(protect(transporteur), addTripToHistory);


// working
router
  .route("/getCurrentTransporter")
  .get(protect(transporteur), getCurrentTransporter);
//working
router.route("/getCurrentTrip").get(protect(transporteur), getCurrentTrip);
// working
router.route("/getListofMessage").get(protect(transporteur), getListofMessage);
// working
router.route("/contactAdmin").post(protect(transporteur), Contactadmin);
//working
router.route("/Getverified").post(protect(transporteur), getVerified);
//working
router
  .route("/getallverifictionDemande")
  .get(protect(transporteur), getAllVerifiedDemande);
//working
router
  .route("/changepassword")
  .put(protect(transporteur), changepasword);
  //working
router
.route("/changeemail")
.put(protect(transporteur), checkemailBeforechange);


module.exports = router;
