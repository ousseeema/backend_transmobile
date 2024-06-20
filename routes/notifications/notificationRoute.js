const express = require('express');
const router = express.router();
const {sendNotif}= require('../../controller/pushNotificationController');

router.post('/pushNotification', sendNotif);


module.exports = router;