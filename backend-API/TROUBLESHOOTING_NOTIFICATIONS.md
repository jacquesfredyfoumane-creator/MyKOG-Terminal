# 🔧 Guide de dépannage - Notifications Firebase

## Problème : Erreur réseau `EAI_AGAIN - getaddrinfo EAI_AGAIN fcm.googleapis.com`

Cette erreur indique un problème de connexion réseau avec les serveurs Firebase Cloud Messaging.

### Solutions possibles :

#### 1. Vérifier la connexion internet
```bash
ping fcm.googleapis.com
```

#### 2. Vérifier la résolution DNS
```bash
nslookup fcm.googleapis.com
```

#### 3. Vérifier le firewall
Assurez-vous que le port 443 (HTTPS) n'est pas bloqué pour `fcm.googleapis.com`

#### 4. Vérifier les variables d'environnement Firebase
Assurez-vous que toutes les variables Firebase sont correctement configurées dans votre fichier `.env` :
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- etc.

#### 5. Utiliser un proxy si nécessaire
Si vous êtes derrière un proxy, configurez-le dans Node.js :
```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

#### 6. Vérifier la configuration réseau
- Vérifiez que votre machine peut accéder à Internet
- Vérifiez que les ports sortants ne sont pas bloqués
- Vérifiez les paramètres VPN si vous en utilisez un

### Comportement actuel

Le serveur continue de fonctionner même si les notifications échouent. Les erreurs réseau sont maintenant gérées de manière non-bloquante :

- ✅ Les opérations principales (création d'événements, enseignements, etc.) continuent même si les notifications échouent
- ⚠️ Les erreurs réseau sont loggées avec des messages d'avertissement
- 🔄 Un timeout de 10 secondes est appliqué pour éviter les blocages prolongés

### Test de connectivité

Pour tester si Firebase est accessible :
```bash
curl -I https://fcm.googleapis.com
```

Si cela échoue, le problème est bien lié à la connectivité réseau.

