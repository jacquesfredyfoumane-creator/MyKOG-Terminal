require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Veilleur = require("./veilleur");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (dashboard admin)
app.use(express.static('public'));

// --- ROUTES ---
app.use("/api/enseignements", require("./routes/enseignements"));
app.use("/api/annonces", require("./routes/annonces"));
app.use("/api/lives", require("./routes/lives"));
app.use("/api/calendar", require("./routes/calendar"));
app.use("/api/users", require("./routes/users"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/text-resumes", require("./routes/textResumes"));

// --- SWAGGER DOCS (local files) ---
const swaggerUiDistPath = path.join(__dirname, 'node_modules', 'swagger-ui-dist');
app.use("/api-docs", express.static(swaggerUiDistPath));
app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(swaggerUiDistPath, 'index.html'));
});
app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

/**
 * @openapi
 * /:
 *   get:
 *     summary: Page d'accueil de l'API
 *     responses:
 *       200:
 *         description: API opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/", (req, res) => {
  res.json({ message: "Serveur Enseignement API opérationnel 🚀" });
});

// --- GESTION DES ERREURS (UPLOAD / AUTRE) ---
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Fichier trop volumineux" });
    }
  }

  res.status(500).json({
    error: "Erreur interne du serveur",
    details: error.message,
  });
});

// --- DEMARRAGE SERVEUR ---
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  console.log("👉 Ouvre ton navigateur et teste /api/enseignements ou /api/lives");
  
  // Démarrer le veilleur uniquement en production
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Serveur déployé sur ${process.env.RAILWAY_PUBLIC_DOMAIN ? 'Railway' : 'Render'}`);
    const veilleur = new Veilleur(14); // Ping toutes les 14 minutes
    veilleur.start();
  } else {
    console.log("📱 Pour téléphone : utilise l'IP du PC + :3000");
  }
});
