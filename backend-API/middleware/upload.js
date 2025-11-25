
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configuration pour les images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'enseignements/images',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `enseignement_image_${timestamp}`;
    },
  },
});

// Configuration pour les audios
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'enseignements/audios',
    resource_type: 'video', // Cloudinary traite les audios comme des vidéos
    format: async (req, file) => 'mp3',
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `enseignement_audio_${timestamp}`;
    },
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    console.log('File received:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Accepter tout fichier pour le moment pour débugger
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

module.exports = { upload };