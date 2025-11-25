const { db } = require('../config/firebase');
const cloudinary = require('../config/cloudinary');

const createEnseignement = async (req, res) => {
  try {
    const { title, speaker, description, category, tags } = req.body;

    // Vérifier que les fichiers ont été uploadés
    if (!req.files || !req.files.image || !req.files.audio) {
      return res.status(400).json({
        error: 'Image et audio sont requis'
      });
    }

    const imageFile = req.files.image[0];
    const audioFile = req.files.audio[0];

    // Vérifier les champs requis
    if (!title || !speaker || !category) {
      return res.status(400).json({
        error: 'Title, speaker et category sont requis'
      });
    }

    // Uploader l'image vers Cloudinary
    const imageResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'enseignements/images' }, // Cloudinary détecte automatiquement le format
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(imageFile.buffer);
    });

    // Uploader l'audio vers Cloudinary
    const audioResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'enseignements/audios', resource_type: 'video' }, // Cloudinary détecte automatiquement
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(audioFile.buffer);
    });

    // Générer les dates
    const now = new Date();
    const publishedAt = now;

    // Extraire mois et année si fournis, sinon utiliser la date actuelle
    const mois = req.body.mois?.toString() || (now.getMonth() + 1).toString(); // +1 car les mois commencent à 0
    const annee = req.body.annee?.toString() || now.getFullYear().toString();

    // Créer l'objet enseignement (compatible avec le modèle Flutter)
    const enseignementData = {
      title: title,
      speaker: speaker,
      description: description || '',
      category: category,
      duration: parseInt(req.body.duration) || 0, // en secondes
      audioUrl: audioResult.secure_url,
      artworkUrl: imageResult.secure_url,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      playCount: 0,
      rating: 0.0,
      isNew: true, // Par défaut, marqué comme nouveau
      isFeatured: false, // Par défaut, pas mis en avant
      publishedAt: publishedAt,
      createdAt: now,
      updatedAt: now,
      mois: mois,
      annee: annee,
      typeCulte: req.body.typeCulte || 'Culte de Louange',
      imagePublicId: imageResult.public_id,
      audioPublicId: audioResult.public_id
    };

    // Sauvegarder dans Firestore
    const docRef = await db.collection('enseignements').add(enseignementData);

    res.status(201).json({
      id: docRef.id,
      message: 'Enseignement créé avec succès',
      data: enseignementData
    });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'enseignement',
      details: error.message
    });
  }
};

const getAllEnseignements = async (req, res) => {
  try {
    const enseignementsSnapshot = await db.collection('enseignements').get();
    const enseignements = [];

    enseignementsSnapshot.forEach(doc => {
      const data = doc.data();

      // Transformer les données pour correspondre exactement au modèle Flutter
      const teachingData = {
        id: doc.id,
        title: data.title || 'Titre non disponible',
        speaker: data.speaker || 'Orateur non disponible',
        description: data.description || '',
        category: data.category || 'Non classé',
        duration: data.duration || 0, // durée en secondes (le modèle Flutter convertit)
        audioUrl: data.audioUrl || '',
        artworkUrl: data.artworkUrl || '',
        tags: data.tags || [],
        playCount: data.playCount || 0,
        rating: data.rating || 0.0,
        isNew: data.isNew || false,
        isFeatured: data.isFeatured || false,
        publishedAt: data.publishedAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        mois: data.mois?.toString() || (new Date().getMonth() + 1).toString(), // Par défaut mois actuel
        annee: data.annee?.toString() || new Date().getFullYear().toString(), // Par défaut année actuelle
        typeCulte: data.typeCulte?.toString() || 'Culte de Louange', // Par défaut
      };

      enseignements.push(teachingData);
    });

    res.json(enseignements);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des enseignements'
    });
  }
};

const updateEnseignement = async (req, res) => {
  try {
    const { id } = req.params;
    const { playCount, rating, isNew, isFeatured, tags } = req.body;

    const enseignementRef = db.collection('enseignements').doc(id);
    const enseignementDoc = await enseignementRef.get();

    if (!enseignementDoc.exists) {
      return res.status(404).json({
        error: 'Enseignement non trouvé'
      });
    }

    // Mettre à jour seulement les champs fournis
    const updateData = {
      updatedAt: new Date(),
    };

    if (playCount !== undefined) updateData.playCount = playCount;
    if (rating !== undefined) updateData.rating = rating;
    if (isNew !== undefined) updateData.isNew = isNew;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (tags !== undefined) updateData.tags = tags;

    await enseignementRef.update(updateData);

    const updatedData = enseignementDoc.data();
    updatedData.id = id;
    updatedData.updatedAt = new Date();

    res.json({
      id: id,
      message: 'Enseignement mis à jour avec succès',
      data: updatedData
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour de l\'enseignement',
      details: error.message
    });
  }
};

module.exports = {
  createEnseignement,
  getAllEnseignements,
  updateEnseignement
};