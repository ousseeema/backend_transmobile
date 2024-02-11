const express = require('express');
const router = express.Router();
const {protect} = require('../../middleware/authmid')
const usermodel= require("../../model/userModel")
const {updateUserDetails,uploadProfilePicture, getallTransportors}= require("../../controller/userControler")

router.route("/getAllTransporteur").get(protect(usermodel), getallTransportors)
router.route("/updateUserDetails").put(protect(usermodel), updateUserDetails);
router.route("/uploadProfilePicture").post(protect(usermodel), uploadProfilePicture);



module.exports = router;