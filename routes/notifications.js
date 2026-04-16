const express = require('express');
const router = express.Router();
const {
  registerToken,
  unregisterToken,
  sendNotificationToAll,
  sendNotificationToUser,
  sendNotificationToTopic,
} = require('../controllers/notificationController');

/**
 * @openapi
 * /api/notifications/tokens:
 *   post:
 *     summary: Enregistrer un token FCM
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - userId
 *             properties:
 *               token:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token enregistré
 */
router.post('/tokens', registerToken);

/**
 * @openapi
 * /api/notifications/tokens:
 *   delete:
 *     summary: Supprimer un token FCM
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token supprimé
 */
router.delete('/tokens', unregisterToken);

/**
 * @openapi
 * /api/notifications/send/all:
 *   post:
 *     summary: Envoyer une notification à tous les utilisateurs
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Notification envoyée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 */
router.post('/send/all', sendNotificationToAll);

/**
 * @openapi
 * /api/notifications/send/user:
 *   post:
 *     summary: Envoyer une notification à un utilisateur spécifique
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - body
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Notification envoyée
 */
router.post('/send/user', sendNotificationToUser);

/**
 * @openapi
 * /api/notifications/send/topic:
 *   post:
 *     summary: Envoyer une notification à un topic
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - title
 *               - body
 *             properties:
 *               topic:
 *                 type: string
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Notification envoyée au topic
 */
router.post('/send/topic', sendNotificationToTopic);

module.exports = router;
