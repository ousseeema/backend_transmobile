const cron = require('node-cron');

// Fonction pour supprimer automatiquement les comptes expirés
function autoDeleteExpiredUsers(model) {
  cron.schedule('*/16 * * * *', async () => {
    try {
      // Trouver tous les comptes dont la date d'expiration est dépassée
      const expiredUsers = await model.find({
        verification_code_expire: { $lt: Date.now() }
      });

      // Supprimer chaque compte expiré
      for (const user of expiredUsers) {
        await model.findOneAndDelete({ _id: user._id });
        console.log(`User ${user._id} deleted due to expired verification code.`);
      }
    } catch (error) {
      console.error('Error occurred while deleting expired users:', error);
    }
  });
}

module.exports = autoDeleteExpiredUsers;