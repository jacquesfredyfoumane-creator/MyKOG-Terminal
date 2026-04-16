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

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
      cb(null, true);
    } else if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'), false);
    }
  },
});

/**
 * @openapi
 * /api/text-resumes:
 *   get:
 *     summary: Recuperer tous les resumes textuels
 *     tags: [Textes]
 *     responses:
 *       200:
 *         description: Liste des resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TextResume'
 */
router.get('/', getAllTextResumes);

/**
 * @openapi
 * /api/text-resumes/{id}:
 *   get:
 *     summary: Recuperer un resume par ID
 *     tags: [Textes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume trouve
 */
router.get('/:id', getTextResumeById);

/**
 * @openapi
 * /api/text-resumes:
 *   post:
 *     summary: Creer un nouveau resume textuel
 *     tags: [Textes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: Fichier PDF (max 50MB)
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Resume cree
 */
router.post(
  '/',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  createTextResume
);

/**
 * @openapi
 * /api/text-resumes/{id}:
 *   put:
 *     summary: Mettre a jour un resume
 *     tags: [Textes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               pdf:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume mis a jour
 */
router.put(
  '/:id',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  updateTextResume
);

/**
 * @openapi
 * /api/text-resumes/{id}:
 *   delete:
 *     summary: Supprimer un resume
 *     tags: [Textes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume supprime
 */
router.delete('/:id', deleteTextResume);

module.exports = router;
