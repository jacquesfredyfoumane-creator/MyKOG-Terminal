# MyKOG Desktop

Application desktop moderne pour MyKOG, construite avec Electron.js. Interface inspirée de Spotify avec le même design system que l'application Flutter.

## 🎨 Design System

- **Couleurs** : Noir (#000000), Or (#d4af37), Gris foncé (#121212)
- **Typographie** : Poppins (titres), Inter (corps de texte)
- **Style** : Dark theme, glassmorphism, animations fluides

## 📋 Prérequis

- Node.js 18+ et npm
- Backend MyKOG démarré sur le port 3000

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Lancer en mode production
npm start
```

## 🏗️ Build

```bash
# Build pour votre plateforme actuelle
npm run build

# Build spécifique
npm run build:win    # Windows
npm run build:linux  # Linux
npm run build:mac    # macOS
```

Les fichiers compilés seront dans le dossier `dist/`.

## 🔧 Configuration

### Configuration de l'API

Modifiez `src/renderer/utils/config.js` pour changer l'URL du backend :

```javascript
getBaseURL() {
  // En développement
  return 'http://localhost:3000';
  
  // En production, utiliser l'IP de votre réseau
  return 'http://192.168.1.195:3000';
}
```

## 📁 Structure du projet

```
mykog-desktop/
├── main.js                 # Processus principal Electron
├── preload.js              # Script de préchargement sécurisé
├── package.json
├── src/
│   ├── index.html         # Page principale
│   ├── renderer/
│   │   ├── main.js        # Code renderer principal
│   │   ├── api/
│   │   │   └── client.js  # Client API
│   │   ├── screens/       # Écrans de l'application
│   │   ├── styles/        # CSS (theme, typography, components)
│   │   └── utils/         # Utilitaires
│   └── assets/            # Ressources (icônes, images)
└── dist/                  # Builds compilés
```

## 🎯 Fonctionnalités

- ✅ Interface moderne type Spotify
- ✅ Navigation entre écrans (Accueil, Parcourir, Bibliothèque, Live)
- ✅ Intégration avec le backend API
- ✅ Player audio/vidéo
- ✅ Streaming live (HLS)
- ✅ Recherche d'enseignements
- ✅ Contrôles de fenêtre personnalisés

## 🔌 API Endpoints utilisés

- `GET /api/enseignements` - Liste des enseignements
- `GET /api/enseignements/:id` - Détails d'un enseignement
- `GET /hls/:streamId/index.m3u8` - Stream HLS
- `POST /api/users/register` - Inscription utilisateur
- `GET /api/users/profile` - Profil utilisateur

## 🐛 Dépannage

### Le backend n'est pas accessible

1. Vérifiez que le backend est démarré : `cd backend-API && npm start`
2. Vérifiez l'URL dans `src/renderer/utils/config.js`
3. Vérifiez que le port 3000 n'est pas bloqué par un firewall

### L'application ne se lance pas

1. Vérifiez que Node.js 18+ est installé : `node --version`
2. Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`
3. Vérifiez les erreurs dans la console (F12 ou DevTools)

## 📝 Notes

- L'application utilise `contextIsolation` et `nodeIntegration: false` pour la sécurité
- Les communications avec Electron se font via `preload.js` et `contextBridge`
- Le streaming HLS utilise la bibliothèque HLS.js pour une meilleure compatibilité

## 📄 Licence

MIT
