const OneSignal = require('onesignal-node');
const envapp = require('..//config/config.app');
const admin = require('../utils/firebase');
const client = new OneSignal.Client(
  {
       // This should be your OneSignal User Auth Key
    app: { appId: '5176e766-14cd-4237-a7ee-23274f8d56ed', 
      appAuthKey:'MjNhODU4OGQtZDQ3MS00M2I5LWI3YjYtYmI5MGE5OWU3ODg2'
     },      // This should be your OneSignal App ID
  }
);

exports.sendNotif = async (req, res) => {

  const { title, message, userIds } = req.body;
  try {
    console.log(userIds);
    const notification = {
      app_id: '5176e766-14cd-4237-a7ee-23274f8d56ed', // Your OneSignal App ID
      contents: {
        en: message,
      },
      headings: {
        en: title,
      },
      include_subscription_ids: userIds, // Array of OneSignal player IDs
    };



    const response = await client.createNotification(notification);
    res.status(200).send(response);
  } catch (error) {
    console.error('Error sending notification:', error);

    res.status(500).send('Error sending notification');
  }
};
