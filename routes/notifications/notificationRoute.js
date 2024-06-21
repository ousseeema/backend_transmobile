const express = require('express');
const router = express.Router();
const {sendNotif}= require('../../controller/pushNotificationController');

router.post('/pushNotification', sendNotif);


module.exports = router;