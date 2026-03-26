const { db } = require('../config/firebase');
const { sendNotificationToAllUsers } = require('../utils/notificationHelper');

const createAnnonce = async (req, res) => {
  try {
    const { nom, description } = req.body;

    // Vérifier que les champs sont remplis
    if (!nom || !description) {
      return res.status(400).json({
        error: 'Nom et description sont requis'
      });
    }

    // Créer l'objet annonce
    const annonceData = {
      nom: nom,
      description: description,
      dateCreation: new Date()
    };

    // Sauvegarder dans Firestore
    const docRef = await db.collection('annonces').add(annonceData);

    // Envoyer une notification push à tous les utilisateurs
    try {
      await sendNotificationToAllUsers({
        title: '📢 Nouvelle annonce',
        body: nom,
        data: {
          id: docRef.id,
          type: 'annonce',
          annonceId: docRef.id,
        },
        type: 'annonce',
      });
    } catch (notifError) {
      console.error('Erreur envoi notification annonce:', notifError);
      // Ne pas bloquer la réponse si la notification échoue
    }

    res.status(201).json({
      id: docRef.id,
      message: 'Annonce créée avec succès',
      data: annonceData
    });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'annonce',
      details: error.message
    });
  }
};

const getAllAnnonces = async (req, res) => {
  try {
    const annoncesSnapshot = await db.collection('annonces').get();
    const annonces = [];

    annoncesSnapshot.forEach(doc => {
      annonces.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(annonces);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des annonces'
    });
  }
};

module.exports = {
  createAnnonce,
  getAllAnnonces
};