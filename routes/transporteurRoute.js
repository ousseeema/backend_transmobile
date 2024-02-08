const express = require('express');
const router = express.Router();
const protect = require('../middleware/authmid')
const transporteur= require("../model/transportorModel")

const {updateUserDetails,uploadProfilePicture }= require("../controller/transporteurController")



router.route("/updateTransporteurDetails").put(protect(transporteur), updateUserDetails);
router.route("/uploadProfilePicture").post(protect(transporteur), uploadProfilePicture);