
const admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialiser Firebase avec gestion d'erreur améliorée
let firebaseApp;
try {
  // Vérifier si Firebase est déjà initialisé
  if (admin.apps.length === 0) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin SDK initialisé');
  } else {
    firebaseApp = admin.app();
    console.log('✅ Firebase Admin SDK déjà initialisé');
  }
} catch (error) {
  console.error('❌ Erreur initialisation Firebase:', error);
  // Continuer quand même pour ne pas bloquer le serveur
}

const db = admin.firestore();

// Configurer Firestore avec des timeouts plus longs
if (db) {
  db.settings({
    ignoreUndefinedProperties: true,
  });
}

module.exports = { admin, db };