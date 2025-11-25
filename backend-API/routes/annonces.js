const express = require('express');
const router = express.Router();
const { createAnnonce, getAllAnnonces } = require('../controllers/annonceController');

// Route pour créer une annonce
router.post('/', createAnnonce);

// Route pour récupérer toutes les annonces
router.get('/', getAllAnnonces);

module.exports = router;