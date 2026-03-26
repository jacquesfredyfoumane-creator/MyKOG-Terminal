# Déploiement sur Render (Version Gratuite)

## Étapes de déploiement

### 1. Créer un compte Render
- Allez sur [render.com](https://render.com)
- Créez un compte avec GitHub/GitLab/Email

### 2. Connecter votre repository
- Connectez votre compte GitHub/GitLab
- Sélectionnez le repository `backend-API`

### 3. Configurer le service Web
- Render détectera automatiquement que c'est un projet Node.js
- Utilisez la configuration du fichier `render.yaml`

### 4. Configurer les variables d'environnement
Dans le dashboard Render, allez dans **Environment** et ajoutez ces variables :

#### Configuration Firebase
```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=test-mykog
FIREBASE_PRIVATE_KEY_ID=86f8ea53b0aa7b534805ff624d37ff437ed7168c
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSfjuI/V4QKTDo\n9swnioYChD0OSTCQsPUKlqTiZyTb2rxmEPGmI9xo/vRu70lIboLrtQLfagJ9U/m+\nHBxvRXN8ErLy2xgKUG2iUR9VMpVj9uPd6zktyjHkG1ytq8xJAf7BN81bmmN8nR8k\n5zJKlEAPMojHOMRlZG9Dvhpsrq0O/Xuyj1zdG3SrwzN7xs2TaYXsCSdgQUbsxH3j\nSmUEIP5viqr+Vj+wTgXAzIYHGhZnTLunFE4Z9Qo0rF9guBOF+Dya0AsICC+ZF6gV\nrxoKP/zK+I2hr4TOw/XGcXElM6bgAUIT3NkB7/vMPHyM9J7JrLRL54ziM03Atl4E\nbQE8C3fpAgMBAAECggEAC2A427kUurMdMnP3Gdp3zl5C9fkQ47r6jUdRsy4vnOWs\nCaiYBLp6rJ59y5qJR324e+BhHr2qE4ekr0hx5XYXjRCuJOegG5uX5z4y3y4ACqJi\n04ElSpMbQeiUKEso+9ecoujfA3i7MHaF4r7Pdh4fvaqFn52y6IdmZ374SuAgWHdT\no/u+GR2JQdblXPfpraodX1n/UnJZMzdBYFAUacTmJEZgwRnnIi3skP2z9gFuaQGE\ndXp8HYLkzDr0ZrrqQXCKb3XytcM6q7Zp3d0awgVFmbYD4jSarwsXMz7FRWEC1AJB\n6QO1K+tV4WSfQaMmEYSXoN0YrjYKyqSy2rMdbK3vkQKBgQD+d3LQkrksWQoT1dWB\nvORM5/8jhaV3yGZC1aFQWywZtp7ekHZRlMPTlWFcflb1ezaoyinz8WYc+2PGbvIh\nhN9M4VwC6fhMnTqRhGC31/P4cBcoeXN84ulBZ40K0MOqZcHYNxifwImIdMCulGdd\n0fE5ZiZ6w5l1eZWvgfq6ppTLmQKBgQDTwvLWcKndeA2AsP192UzMRpuNcslxMacE\nYQukhbwP7EzkneRk9oUulsSsUL7Vimqo4F7rw1BpLkdwxYQjHBS1SZfeitOxXn/D\nKm3u52M39Co3r/Sg0KF85mpt4+FLVy13oTgJLm07aLjE9mraRDxzI8nnUVVHos3Z\n5I6eKeNA0QKBgFZjZOYsOZM1szcirDY8U2FMjZCYqaEttpHQBtDJ8wHTvsGeV5zA\nnW6yUvhcp9b0+ox4/Z8kf98s9SWDus3oVwq5o0wV9EbGRgDq6Q7g0KGyJBqIiM2I\nF1ot9nMKhrLNku59Xe22JrrdsCBUn3b5dCRhaoTY7Ls2CLwpq148eV1ZAoGBAM93\noBMYLlQc2p3KyZAS5Xr9ckkSvOl5i/huW8nEfIvdJziUuL9yBumuLOHl+hGcmwL5\nUAYMRSvHe5aw7NS5HlC+2VvfB6guvV2opCv75ula/kGw0ir8PDryRDOFn6UAtDsQ\naKYWJk6eOug9xFIzqEXmOlm3BaY5ixR/KHss7skBAoGBANeOirRMn5+64MxtuRfl\n1Iu6zQFmEN6npdsHT53qsr2pDJdr/H7+eaZXyvSKnjwlR9/AEI0+wkmz1x01jXDF\ndh6UisvBpB7nJ0n2in8nKpaU1m97f6H7aC9QMWID0BeeUvDESR6c2FMON75ateFU\nVpzBUtdN+OE3qHSFy2jE5o0l\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@test-mykog.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=103825715076389627267
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40test-mykog.iam.gserviceaccount.com
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

#### Configuration Cloudinary
```
CLOUDINARY_CLOUD_NAME=dehlwbrjw
CLOUDINARY_API_KEY=594411499564243
CLOUDINARY_API_SECRET=N_R943s_FuoB_V1pEH7i72ANfxU
```

#### Configuration Serveur
```
PORT=10000
NODE_ENV=production
```

### 5. Déployer
- Cliquez sur **Create Web Service**
- Le déploiement automatique commencera
- Attendez la fin du déploiement (quelques minutes)

### 6. URL de votre API
Une fois déployé, votre API sera accessible à :
`https://mykog-backend-api.onrender.com`

## Endpoints disponibles

### Test de connexion
```
GET https://mykog-backend-api.onrender.com/
```

### Enseignements
```
GET https://mykog-backend-api.onrender.com/api/enseignements
POST https://mykog-backend-api.onrender.com/api/enseignements
```

### Annonces
```
GET https://mykog-backend-api.onrender.com/api/annonces
POST https://mykog-backend-api.onrender.com/api/annonces
```

### Lives
```
GET https://mykog-backend-api.onrender.com/api/lives
POST https://mykog-backend-api.onrender.com/api/lives
```

### Calendar
```
GET https://mykog-backend-api.onrender.com/api/calendar
POST https://mykog-backend-api.onrender.com/api/calendar
```

### Users
```
GET https://mykog-backend-api.onrender.com/api/users
POST https://mykog-backend-api.onrender.com/api/users
```

### Notifications
```
GET https://mykog-backend-api.onrender.com/api/notifications
POST https://mykog-backend-api.onrender.com/api/notifications
```

### Text Resumes
```
GET https://mykog-backend-api.onrender.com/api/text-resumes
POST https://mykog-backend-api.onrender.com/api/text-resumes
```

## Limites de la version gratuite Render

- **Sleep after 15 minutes** : L'API se mettra en veille après 15 minutes d'inactivité
- **Cold start** : Le premier appel après la veille peut prendre 30-60 secondes
- **750 heures/mois** : Suffisant pour un développement/test
- **Disque SSD** : 10GB inclus
- **Bande passante** : 100GB/mois

## Pour éviter le sleep

### Solution intégrée (recommandée)
Votre backend inclut maintenant un **veilleur automatique** qui envoie un ping à lui-même toutes les 14 minutes pour éviter le sleep Render.

Le veilleur se déclenche automatiquement en production (NODE_ENV=production).

### Fonctionnalités du veilleur
- **Auto-démarrage** : S'active uniquement en production
- **Ping toutes les 14 minutes** : Juste avant la limite de 15 minutes de Render
- **Logs détaillés** : Affiche l'état des pings dans la console
- **Gestion d'erreurs** : Gère les timeouts et connexions refusées
- **URL automatique** : Utilise l'URL du serveur ou localhost en dev

### Logs du veilleur dans Render
```
🔔 Veilleur démarré - Ping toutes les 14 minutes
📍 URL surveillée: https://mykog-backend-api.onrender.com
🔄 [2024-01-20T10:00:00.000Z] Ping du serveur pour éviter le sleep...
✅ Ping réussi - Status: 200 - 2024-01-20T10:00:00.000Z
🚀 Serveur actif et répond correctement
```

### Solution externe (alternative)
Si vous préférez une solution externe :
1. Utilisez [uptimerobot.com](https://uptimerobot.com) gratuit
2. Configurez un ping toutes les 5 minutes sur `https://mykog-backend-api.onrender.com/`

### Commandes du veilleur
```bash
# Démarrer le veilleur manuellement (test local)
npm run veilleur

# Le veilleur est automatiquement intégré dans
npm start  # en production
```

## Mise à jour du frontend Flutter

Dans votre app Flutter, mettez à jour l'URL de base :

```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'https://mykog-backend-api.onrender.com';
  // ... autres configurations
}
```

## Support

- Documentation Render : [render.com/docs](https://render.com/docs)
- Support communautaire : [community.render.com](https://community.render.com)
