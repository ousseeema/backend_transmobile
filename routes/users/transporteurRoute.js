const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const transporteur= require("../../model/transportorModel")

const {updateUserDetails,uploadProfilePicture, acceptDemande,searchForTrip, refusedemande,getAllPackage_forSingleTrip, getAlldemande }= require("../../controller/transporteurController")


router.route("/updateTransporteurDetails").put(protect(transporteur), updateUserDetails);
router.route("/uploadProfilePicture").post(protect(transporteur), uploadProfilePicture);
router.route("/getAllPackage").get(protect(transporteur), getAllPackage_forSingleTrip);
router.route("/acceptDemande").put(protect(transporteur), acceptDemande);
router.route("/refuseDemande").put(protect(transporteur), refusedemande);
router.route("/getAllDemande").get(protect(transporteur), getAlldemande);



module.exports = router ;


