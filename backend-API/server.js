require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/enseignements', require('./routes/enseignements'));
app.use('/api/annonces', require('./routes/annonces'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur Enseignement API' });
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Fichier trop volumineux'
      });
    }
  }
  
  res.status(500).json({
    error: 'Erreur interne du serveur',
    details: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});