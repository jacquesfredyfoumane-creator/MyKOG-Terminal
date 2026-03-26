# 🚀 Guide de démarrage rapide - MyKOG Desktop

## Installation et lancement

### 1. Installer les dépendances

```bash
cd mykog-desktop
npm install
```

### 2. Démarrer le backend (dans un autre terminal)

```bash
cd ../backend-API
npm start
```

Le backend doit être accessible sur `http://localhost:3000`

### 3. Lancer l'application Electron

```bash
cd mykog-desktop
npm run dev
```

L'application s'ouvrira avec les DevTools pour le débogage.

## 📝 Configuration de l'IP du backend

Si votre backend n'est pas sur `localhost:3000`, modifiez le fichier :

**`src/renderer/utils/config.js`**

```javascript
getBaseURL() {
  // Remplacez par l'IP de votre backend
  return 'http://192.168.1.195:3000';
}
```

## 🎨 Fonctionnalités

- ✅ **Accueil** : Affiche les enseignements récents
- ✅ **Parcourir** : Liste tous les enseignements avec recherche
- ✅ **Bibliothèque** : Vos favoris (à implémenter)
- ✅ **Live** : Streaming en direct (HLS)

## 🐛 Problèmes courants

### L'application ne se connecte pas au backend

1. Vérifiez que le backend est démarré
2. Vérifiez l'URL dans `src/renderer/utils/config.js`
3. Ouvrez les DevTools (F12) et vérifiez les erreurs dans la console

### Erreur "Cannot find module"

```bash
rm -rf node_modules
npm install
```

### L'application ne s'ouvre pas

Vérifiez que vous avez Node.js 18+ :
```bash
node --version
```

## 📦 Build pour production

```bash
npm run build
```

Les fichiers seront dans `dist/`

