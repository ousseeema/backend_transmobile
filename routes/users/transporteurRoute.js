const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const transporteur= require("../../model/transportorModel")

const {addTrip,updateUserDetails,uploadProfilePicture, acceptDemande, refusedemande,getAllPackage_forSingleTrip, getAlldemande }= require("../../controller/transporteurController")

//working
router.route("/updateTransporteurDetails").put(protect(transporteur), updateUserDetails);
//working
router.route("/uploadProfilePicture").post(protect(transporteur), uploadProfilePicture);
//working
router.route("/getAllPackage").get(protect(transporteur), getAllPackage_forSingleTrip);
// working 
router.route("/acceptDemande/:id").put(protect(transporteur), acceptDemande);
//working
router.route("/refuseDemande/:id").put(protect(transporteur), refusedemande);
//working
router.route("/getAllDemande").get(protect(transporteur), getAlldemande);
//working
router.route("/addtrip").post(protect(transporteur), addTrip);
// 
router.route('/updateTrip').put(protect(transporteur), updateTrip);

module.exports = router ;


