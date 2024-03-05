const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const transporteur= require("../../model/transportorModel")

const {addTrip,addTripToHistory, updateTrip,deleteTrip,addSinglePackage , updateUserDetails,uploadProfilePicture, acceptDemande, refusedemande,getAllPackage_forSingleTrip, getAlldemande }= require("../../controller/transporteurController")

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
// working
router.route('/updateTrip/:id').put(protect(transporteur), updateTrip);
//working
router.route("/deleteTrip/:id").delete(protect(transporteur), deleteTrip);
//working 
router.route("/addSinglepackage/:id").put(protect(transporteur), addSinglePackage);
//working
router.route("/getAlltrips/:id").get(protect(transporteur), );
// working
router.route("/addtriptohistory/:id").put(protect(transporteur),addTripToHistory);
module.exports = router ;


