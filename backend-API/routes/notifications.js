const express = require('express');
const router = express.Router();
const {
  registerToken,
  unregisterToken,
  sendNotificationToAll,
  sendNotificationToUser,
  sendNotificationToTopic,
} = require('../controllers/notificationController');

// Route pour enregistrer un token FCM
router.post('/tokens', registerToken);

// Route pour supprimer un token FCM
router.delete('/tokens', unregisterToken);

// Route pour envoyer une notification à tous les utilisateurs
router.post('/send/all', sendNotificationToAll);

// Route pour envoyer une notification à un utilisateur spécifique
router.post('/send/user', sendNotificationToUser);

// Route pour envoyer une notification à un topic
router.post('/send/topic', sendNotificationToTopic);

module.exports = router;

