const express = require('express');
const router = express.Router();
const {
  createLiveStream,
  getAllLiveStreams,
  getLiveStreamById,
  getActiveLive,
  getServerInfo,
  updateLiveStream,
  updateLiveStreamStatus,
  incrementViewerCount,
  decrementViewerCount,
  getViewerCount,
  deleteLiveStream,
} = require('../controllers/liveController');

// Routes CRUD
router.post('/', createLiveStream);                    // Créer un live
router.get('/', getAllLiveStreams);                    // Récupérer tous les lives
router.get('/active', getActiveLive);                  // Récupérer le live actif
router.get('/server-info', getServerInfo);             // Informations serveur (IP/URLs)
router.get('/:id', getLiveStreamById);                 // Récupérer un live par ID
router.put('/:id', updateLiveStream);                  // Mettre à jour un live (complet)
router.put('/:id/status', updateLiveStreamStatus);      // Mettre à jour le statut
router.delete('/:id', deleteLiveStream);               // Supprimer un live

// Routes pour le compteur de viewers
router.post('/:id/join', incrementViewerCount);        // Rejoindre le live (+1 viewer)
router.post('/:id/leave', decrementViewerCount);       // Quitter le live (-1 viewer)
router.get('/:id/viewers', getViewerCount);            // Obtenir le nombre de viewers

module.exports = router;

