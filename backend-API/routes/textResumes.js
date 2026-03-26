const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createTextResume,
  getAllTextResumes,
  getTextResumeById,
  updateTextResume,
  deleteTextResume,
} = require('../controllers/textResumeController');

// Configuration Multer pour l'upload de fichiers
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max pour les PDFs
  },
  fileFilter: (req, file, cb) => {
    // Accepter les PDFs et les images
    if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
      cb(null, true);
    } else if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'), false);
    }
  },
});

// Routes
router.post(
  '/',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  createTextResume
);

router.get('/', getAllTextResumes);
router.get('/:id', getTextResumeById);

router.put(
  '/:id',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  updateTextResume
);

router.delete('/:id', deleteTextResume);

module.exports = router;

