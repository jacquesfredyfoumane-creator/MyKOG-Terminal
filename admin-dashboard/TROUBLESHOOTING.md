# 🔧 Guide de dépannage - Problèmes de connexion

## Problème : Le dashboard ne charge pas ou charge lentement les données

### ✅ Solutions

#### 1. Vérifier que le backend API est démarré

Le dashboard **ne communique PAS directement avec Firebase**. Il passe par votre backend API.

**Vérification :**
```bash
cd backend-API
npm start
```

Le serveur doit afficher :
```
🚀 Serveur lancé sur http://0.0.0.0:3000
```

#### 2. Vérifier l'URL de l'API

Par défaut, le dashboard utilise `http://localhost:3000/api`

Si votre backend tourne sur un autre port, créez un fichier `.env.local` dans `admin-dashboard/` :
```
NEXT_PUBLIC_API_URL=http://localhost:VOTRE_PORT/api
```

#### 3. Vérifier la connexion réseau

Le dashboard affiche maintenant un indicateur de statut de connexion en haut de chaque page :
- ✅ **Vert** : Connecté au serveur backend
- ❌ **Rouge** : Serveur backend non accessible

#### 4. Vérifier les erreurs dans la console

Ouvrez la console du navigateur (F12) et regardez les erreurs :
- `Failed to fetch` → Le backend n'est pas démarré ou l'URL est incorrecte
- `Timeout` → Le backend répond trop lentement (vérifiez Firebase)
- `CORS error` → Problème de configuration CORS (normalement déjà configuré)

#### 5. Vérifier Firebase

Si le backend est démarré mais les données ne chargent pas :
- Vérifiez que Firebase est correctement configuré dans `backend-API/config/firebase.js`
- Vérifiez les credentials Firebase dans `.env` du backend
- Vérifiez la console du backend pour les erreurs Firebase

#### 6. Timeout des requêtes

Les requêtes ont maintenant un timeout de 30 secondes. Si ça prend plus de temps :
- Vérifiez la connexion internet
- Vérifiez que Firebase répond rapidement
- Vérifiez les logs du backend pour voir où ça bloque

### 📊 Architecture

```
Dashboard (Next.js) 
    ↓ HTTP Request
Backend API (Node.js/Express)
    ↓ Firebase Admin SDK
Firebase Firestore
```

**Le dashboard ne peut PAS se connecter directement à Firebase depuis le navigateur** (pour des raisons de sécurité). Il doit passer par votre backend API.

### 🚀 Commandes de démarrage

**Terminal 1 - Backend API :**
```bash
cd backend-API
npm start
```

**Terminal 2 - Dashboard :**
```bash
cd admin-dashboard
npm run dev
```

### 🔍 Debug

1. **Vérifier que le backend répond :**
   ```bash
   curl http://localhost:3000/
   ```
   Devrait retourner : `{"message":"Serveur Enseignement API opérationnel 🚀"}`

2. **Vérifier les endpoints :**
   ```bash
   curl http://localhost:3000/api/enseignements
   curl http://localhost:3000/api/annonces
   curl http://localhost:3000/api/lives
   ```

3. **Vérifier les logs du backend** pour voir les erreurs Firebase

### ⚠️ Erreurs courantes

- **"Impossible de se connecter au serveur"** → Backend non démarré
- **"La requête a pris trop de temps"** → Firebase lent ou problème réseau
- **"Erreur HTTP 500"** → Problème dans le backend (vérifiez les logs)
- **"CORS error"** → Le backend doit avoir `app.use(cors())` (déjà configuré)

