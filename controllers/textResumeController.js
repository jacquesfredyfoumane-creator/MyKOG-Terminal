const { db } = require('../config/firebase');
const cloudinary = require('../config/cloudinary');
const { sendNotificationToAllUsers } = require('../utils/notificationHelper');

// Créer un texte résumé (PDF)
const createTextResume = async (req, res) => {
  try {
    const { title, speaker, description, category, tags, mois, annee, typeCulte } = req.body;

    // Vérifier que le fichier PDF a été uploadé
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({
        error: 'Fichier PDF requis'
      });
    }

    const pdfFile = req.files.pdf[0];

    // Vérifier que c'est bien un PDF
    if (!pdfFile.mimetype.includes('pdf')) {
      return res.status(400).json({
        error: 'Le fichier doit être un PDF'
      });
    }

    // Vérifier les champs requis
    if (!title || !speaker || !category) {
      return res.status(400).json({
        error: 'Title, speaker et category sont requis'
      });
    }

    // Uploader le PDF vers Cloudinary
    const pdfResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'textes_resumes/pdfs',
          resource_type: 'raw', // Pour les PDFs
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(pdfFile.buffer);
    });

    // Uploader une image de couverture si fournie, sinon utiliser une image par défaut
    let coverImageUrl = '';
    if (req.files.image && req.files.image[0]) {
      const imageResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'textes_resumes/covers' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.files.image[0].buffer);
      });
      coverImageUrl = imageResult.secure_url;
    }

    // Générer les dates
    const now = new Date();
    const publishedAt = now;

    // Créer l'objet texte résumé
    const textResumeData = {
      title: title,
      speaker: speaker,
      description: description || '',
      category: category,
      pdfUrl: pdfResult.secure_url,
      coverImageUrl: coverImageUrl || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      viewCount: 0,
      rating: 0.0,
      isNew: true,
      isFeatured: false,
      publishedAt: publishedAt,
      createdAt: now,
      updatedAt: now,
      mois: mois?.toString() || (now.getMonth() + 1).toString(),
      annee: annee?.toString() || now.getFullYear().toString(),
      typeCulte: typeCulte || 'Culte de Louange',
      pdfPublicId: pdfResult.public_id,
      fileSize: pdfResult.bytes, // Taille du fichier en bytes
      pageCount: 0, // Peut être calculé plus tard si nécessaire
    };

    // Sauvegarder dans Firestore
    const docRef = await db.collection('textes_resumes').add(textResumeData);

    // Envoyer une notification push à tous les utilisateurs
    try {
      await sendNotificationToAllUsers({
        title: '📄 Nouveau texte résumé disponible',
        body: `${title} - ${speaker || 'Nouveau contenu'}`,
        data: {
          id: docRef.id,
          type: 'text_resume',
          textResumeId: docRef.id,
        },
        imageUrl: coverImageUrl,
        type: 'text_resume',
      });
    } catch (notifError) {
      console.error('Erreur envoi notification texte résumé:', notifError);
      // Ne pas bloquer la réponse si la notification échoue
    }

    res.status(201).json({
      id: docRef.id,
      message: 'Texte résumé créé avec succès',
      data: textResumeData
    });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du texte résumé',
      details: error.message
    });
  }
};

// Récupérer tous les textes résumés
const getAllTextResumes = async (req, res) => {
  try {
    const { category, mois, annee, typeCulte, sortBy = 'publishedAt', order = 'desc' } = req.query;
    
    let query = db.collection('textes_resumes');

    // Appliquer les filtres
    if (category && category !== 'All') {
      query = query.where('category', '==', category);
    }
    if (mois && mois !== 'All') {
      query = query.where('mois', '==', mois);
    }
    if (annee && annee !== 'All') {
      query = query.where('annee', '==', annee);
    }
    if (typeCulte && typeCulte !== 'All') {
      query = query.where('typeCulte', '==', typeCulte);
    }

    // Trier
    const sortField = sortBy === 'title' ? 'title' : 
                     sortBy === 'speaker' ? 'speaker' :
                     sortBy === 'viewCount' ? 'viewCount' :
                     'publishedAt';
    
    query = query.orderBy(sortField, order === 'asc' ? 'asc' : 'desc');

    const snapshot = await query.get();
    const textResumes = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const textResumeData = {
        id: doc.id,
        title: data.title || 'Titre non disponible',
        speaker: data.speaker || 'Auteur non disponible',
        description: data.description || '',
        category: data.category || 'Non classé',
        pdfUrl: data.pdfUrl || '',
        coverImageUrl: data.coverImageUrl || '',
        tags: data.tags || [],
        viewCount: data.viewCount || 0,
        rating: data.rating || 0.0,
        isNew: data.isNew || false,
        isFeatured: data.isFeatured || false,
        publishedAt: data.publishedAt?.toDate()?.toISOString() || new Date().toISOString(),
        createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
        mois: data.mois?.toString() || (new Date().getMonth() + 1).toString(),
        annee: data.annee?.toString() || new Date().getFullYear().toString(),
        typeCulte: data.typeCulte?.toString() || 'Culte de Louange',
        fileSize: data.fileSize || 0,
        pageCount: data.pageCount || 0,
      };

      textResumes.push(textResumeData);
    });

    res.json(textResumes);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des textes résumés'
    });
  }
};

// Récupérer un texte résumé par ID
const getTextResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('textes_resumes').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        error: 'Texte résumé non trouvé'
      });
    }

    const data = doc.data();
    const textResumeData = {
      id: doc.id,
      title: data.title || 'Titre non disponible',
      speaker: data.speaker || 'Auteur non disponible',
      description: data.description || '',
      category: data.category || 'Non classé',
      pdfUrl: data.pdfUrl || '',
      coverImageUrl: data.coverImageUrl || '',
      tags: data.tags || [],
      viewCount: data.viewCount || 0,
      rating: data.rating || 0.0,
      isNew: data.isNew || false,
      isFeatured: data.isFeatured || false,
      publishedAt: data.publishedAt?.toDate()?.toISOString() || new Date().toISOString(),
      createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
      mois: data.mois?.toString() || (new Date().getMonth() + 1).toString(),
      annee: data.annee?.toString() || new Date().getFullYear().toString(),
      typeCulte: data.typeCulte?.toString() || 'Culte de Louange',
      fileSize: data.fileSize || 0,
      pageCount: data.pageCount || 0,
    };

    // Incrémenter le compteur de vues
    await db.collection('textes_resumes').doc(id).update({
      viewCount: (data.viewCount || 0) + 1,
      updatedAt: new Date(),
    });

    res.json(textResumeData);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du texte résumé'
    });
  }
};

// Mettre à jour un texte résumé
const updateTextResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, speaker, description, category, tags, isNew, isFeatured, viewCount, rating } = req.body;

    const textResumeRef = db.collection('textes_resumes').doc(id);
    const textResumeDoc = await textResumeRef.get();

    if (!textResumeDoc.exists) {
      return res.status(404).json({
        error: 'Texte résumé non trouvé'
      });
    }

    // Mettre à jour seulement les champs fournis
    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (speaker !== undefined) updateData.speaker = speaker;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (isNew !== undefined) updateData.isNew = isNew;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (viewCount !== undefined) updateData.viewCount = viewCount;
    if (rating !== undefined) updateData.rating = rating;

    // Gérer l'upload d'un nouveau PDF si fourni
    if (req.files && req.files.pdf) {
      const pdfFile = req.files.pdf[0];
      if (!pdfFile.mimetype.includes('pdf')) {
        return res.status(400).json({
          error: 'Le fichier doit être un PDF'
        });
      }

      // Supprimer l'ancien PDF de Cloudinary
      const oldData = textResumeDoc.data();
      if (oldData.pdfPublicId) {
        try {
          await cloudinary.uploader.destroy(oldData.pdfPublicId, { resource_type: 'raw' });
        } catch (error) {
          console.error('Erreur suppression ancien PDF:', error);
        }
      }

      // Uploader le nouveau PDF
      const pdfResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'textes_resumes/pdfs', resource_type: 'raw' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(pdfFile.buffer);
      });

      updateData.pdfUrl = pdfResult.secure_url;
      updateData.pdfPublicId = pdfResult.public_id;
      updateData.fileSize = pdfResult.bytes;
    }

    // Gérer l'upload d'une nouvelle image de couverture si fournie
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      const imageResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'textes_resumes/covers' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(imageFile.buffer);
      });
      updateData.coverImageUrl = imageResult.secure_url;
    }

    await textResumeRef.update(updateData);

    const updatedData = textResumeDoc.data();
    Object.assign(updatedData, updateData);
    updatedData.id = id;
    updatedData.updatedAt = new Date();

    res.json({
      id: id,
      message: 'Texte résumé mis à jour avec succès',
      data: updatedData
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du texte résumé',
      details: error.message
    });
  }
};

// Supprimer un texte résumé
const deleteTextResume = async (req, res) => {
  try {
    const { id } = req.params;
    const textResumeDoc = await db.collection('textes_resumes').doc(id).get();

    if (!textResumeDoc.exists) {
      return res.status(404).json({
        error: 'Texte résumé non trouvé'
      });
    }

    const data = textResumeDoc.data();

    // Supprimer le PDF de Cloudinary
    if (data.pdfPublicId) {
      try {
        await cloudinary.uploader.destroy(data.pdfPublicId, { resource_type: 'raw' });
      } catch (error) {
        console.error('Erreur suppression PDF Cloudinary:', error);
      }
    }

    // Supprimer l'image de couverture si elle existe
    if (data.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(data.coverImagePublicId);
      } catch (error) {
        console.error('Erreur suppression image Cloudinary:', error);
      }
    }

    // Supprimer de Firestore
    await db.collection('textes_resumes').doc(id).delete();

    res.json({
      message: 'Texte résumé supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du texte résumé',
      details: error.message
    });
  }
};

module.exports = {
  createTextResume,
  getAllTextResumes,
  getTextResumeById,
  updateTextResume,
  deleteTextResume,
};

