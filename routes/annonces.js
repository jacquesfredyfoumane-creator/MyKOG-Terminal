const express = require('express');
const router = express.Router();
const { createAnnonce, getAllAnnonces } = require('../controllers/annonceController');

/**
 * @openapi
 * /api/annonces:
 *   get:
 *     summary: Récupérer toutes les annonces
 *     tags: [Annonces]
 *     responses:
 *       200:
 *         description: Liste des annonces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Annonce'
 */
router.get('/', getAllAnnonces);

/**
 * @openapi
 * /api/annonces:
 *   post:
 *     summary: Créer une nouvelle annonce
 *     tags: [Annonces]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Annonce créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Annonce'
 */
router.post('/', createAnnonce);

module.exports = router;
