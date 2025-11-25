const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { createEnseignement, getAllEnseignements, updateEnseignement } = require('../controllers/enseignementController');

// Route pour créer un enseignement
router.post('/',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
  createEnseignement
);

// Route pour récupérer tous les enseignements
router.get('/', getAllEnseignements);

// Route pour mettre à jour un enseignement
router.put('/:id', updateEnseignement);

module.exports = router;