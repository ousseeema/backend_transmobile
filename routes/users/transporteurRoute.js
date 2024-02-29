const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const transporteur= require("../../model/transportorModel")

const {addTrip,updateUserDetails,uploadProfilePicture, acceptDemande, refusedemande,getAllPackage_forSingleTrip, getAlldemande }= require("../../controller/transporteurController")

//working
router.route("/updateTransporteurDetails").put(protect(transporteur), updateUserDetails);
//working
router.route("/uploadProfilePicture").post(protect(transporteur), uploadProfilePicture);

router.route("/getAllPackage").get(protect(transporteur), getAllPackage_forSingleTrip);
//
router.route("/acceptDemande").put(protect(transporteur), acceptDemande);
//
router.route("/refuseDemande").put(protect(transporteur), refusedemande);
//working
router.route("/getAllDemande").get(protect(transporteur), getAlldemande);
//
router.route("/addtrip").all(protect(transporteur), addTrip);


module.exports = router ;


