const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { createEnseignement, getAllEnseignements, updateEnseignement, deleteEnseignement } = require('../controllers/enseignementController');

/**
 * @openapi
 * /api/enseignements:
 *   get:
 *     summary: Récupérer tous les enseignements
 *     tags: [Enseignements]
 *     responses:
 *       200:
 *         description: Liste des enseignements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enseignement'
 */
router.get('/', getAllEnseignements);

/**
 * @openapi
 * /api/enseignements:
 *   post:
 *     summary: Créer un nouvel enseignement
 *     tags: [Enseignements]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - audio
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'enseignement
 *               description:
 *                 type: string
 *               preacher:
 *                 type: string
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Fichier audio (max 2GB)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image de couverture
 *     responses:
 *       201:
 *         description: Enseignement créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enseignement'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
  createEnseignement
);

/**
 * @openapi
 * /api/enseignements/{id}:
 *   put:
 *     summary: Mettre à jour un enseignement
 *     tags: [Enseignements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'enseignement
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               preacher:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Enseignement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enseignement'
 *       404:
 *         description: Enseignement non trouvé
 */
router.put('/:id', 
  upload.fields([{ name: 'image', maxCount: 1 }]),
  updateEnseignement
);

/**
 * @openapi
 * /api/enseignements/{id}:
 *   delete:
 *     summary: Supprimer un enseignement
 *     tags: [Enseignements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'enseignement
 *     responses:
 *       200:
 *         description: Enseignement supprimé
 *       404:
 *         description: Enseignement non trouvé
 */
router.delete('/:id', deleteEnseignement);

module.exports = router;
