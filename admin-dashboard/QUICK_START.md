# 🚀 Guide de démarrage rapide

## 1. Démarrer le backend API

Assurez-vous que votre backend API est en cours d'exécution :

```bash
cd ../backend-API
npm start
```

Le serveur devrait démarrer sur `http://localhost:3000`

## 2. Configurer l'URL de l'API (optionnel)

Si votre backend tourne sur un autre port ou une autre URL, créez un fichier `.env.local` :

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 3. Démarrer le dashboard

```bash
npm run dev
```

Le dashboard sera accessible sur `http://localhost:3001` (ou le prochain port disponible)

## 4. Utiliser le dashboard

1. **Accueil** : Vue d'ensemble avec liens vers les différentes sections
2. **Enseignements** : Publier des enseignements avec image et audio
3. **Annonces** : Créer des annonces simples
4. **Lives** : Gérer les streams en direct
5. **Statistiques** : Voir les statistiques de votre contenu

## 📝 Notes importantes

- Les fichiers uploadés (images/audio) sont envoyés vers Cloudinary via votre backend
- Les données sont sauvegardées dans Firebase Firestore
- Le dashboard communique uniquement avec votre backend API, pas directement avec Firebase

## 🔧 Dépannage

**Erreur de connexion à l'API** :
- Vérifiez que le backend est démarré
- Vérifiez l'URL dans `.env.local` ou utilisez la valeur par défaut `http://localhost:3000/api`

**Erreur CORS** :
- Assurez-vous que votre backend a CORS activé (déjà configuré dans `server.js`)

