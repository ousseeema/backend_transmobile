const OneSignal = require('onesignal-node');
const envapp = require('..//config/config.app');
const client = new OneSignal.Client({
  userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY,
  app: { appAuthKey: envapp.ONE_SIGNAL_CONFIG.API_KEY, appId: envapp.ONE_SIGNAL_CONFIG.APP_ID }
});

// Endpoint to send notification
exports.sendNotif = async (req, res) => {
  const { title, message, userIds } = req.body;
  try {
    const notification = {
      contents: { en: message },
      headings: { en: title },
      include_player_ids: userIds,
    };

    const response = await client.createNotification(notification);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send('Error sending notification');
  }
};
 