# 🎬 Transcodage Automatique - Compatibilité Universelle dans le Code

## ✅ Solution Implémentée

Le système de **transcodage automatique avec FFmpeg** a été intégré dans le backend. Maintenant, **peu importe la configuration OBS**, le stream sera automatiquement converti en format compatible avec tous les téléphones.

## 🎯 Comment Ça Fonctionne

1. **OBS stream** → RTMP (n'importe quelle configuration)
2. **FFmpeg transcodage automatique** → Convertit en HLS avec paramètres optimaux
3. **HLS compatible** → Fonctionne sur tous les téléphones

## 📋 Prérequis

### 1. Installer FFmpeg

```bash
sudo apt update
sudo apt install -y ffmpeg

# Vérifier l'installation
ffmpeg -version
```

### 2. Vérifier que FFmpeg est accessible

```bash
which ffmpeg
```

## 🔧 Configuration

### 1. Nginx Configuration

Le HLS direct de Nginx a été désactivé (commenté) dans `nginx.conf`. Le transcodage FFmpeg génère maintenant les fichiers HLS.

### 2. Backend Configuration

Le transcodage démarre automatiquement quand :
- Un live est créé avec le statut `"live"`
- Le statut d'un live passe à `"live"`

Le transcodage s'arrête automatiquement quand :
- Le statut passe à `"ended"`

## 🚀 Utilisation

### Étape 1 : Configurer OBS (N'importe quelle configuration)

Dans OBS, vous pouvez utiliser **n'importe quelle configuration** :
- Résolution : 720p, 1080p, etc.
- Profile : main, high, etc.
- Débit : n'importe quel débit

**Le transcodage convertira automatiquement en format compatible.**

### Étape 2 : Publier le Live

1. Créer le live dans le dashboard avec statut `"live"`
2. Le transcodage démarre automatiquement
3. Configurer OBS avec l'URL RTMP affichée
4. Démarrer le stream dans OBS

### Étape 3 : Le Stream est Automatiquement Compatible

Le stream HLS généré par FFmpeg utilise :
- ✅ Profile `baseline` (compatible universel)
- ✅ Résolution `854x480` (optimal)
- ✅ Débit `1500 Kbps` (optimal)
- ✅ Pas de B-frames (meilleure compatibilité)

## 📊 Paramètres de Transcodage (Dans le Code)

Les paramètres sont définis dans `backend-API/utils/ffmpeg_transcoder.js` :

```javascript
// Vidéo
'-profile:v', 'baseline',     // Compatible universel
'-level', '3.1',              // Compatible avec la plupart des appareils
'-s', '854x480',              // Résolution optimale
'-b:v', '1500k',              // Débit optimal
'-bf', '0',                   // Pas de B-frames
'-refs', '1',                 // Une seule référence

// Audio
'-c:a', 'aac',
'-b:a', '128k',
```

## 🔍 Vérification

### Vérifier que le transcodage fonctionne

```bash
# Vérifier les processus FFmpeg
ps aux | grep ffmpeg

# Vérifier les fichiers HLS générés
ls -la /var/www/html/hls/mykog_live/

# Vérifier les logs du backend
# (Le transcodage démarre automatiquement quand un live est créé)
```

### Vérifier les logs du transcodage

Les logs apparaissent dans la console du backend Node.js :
- `✅ Transcoder démarré pour: mykog_live`
- `📹 FFmpeg transcoding: XXX frames`
- `🛑 Transcoder arrêté pour: mykog_live`

## ⚙️ Configuration Avancée

### Modifier les paramètres de transcodage

Éditer `backend-API/utils/ffmpeg_transcoder.js` et modifier les paramètres FFmpeg selon vos besoins.

### Désactiver le transcodage automatique

Si vous voulez utiliser le HLS direct de Nginx (sans transcodage), commenter les lignes de démarrage du transcoder dans `liveController.js`.

## 🎯 Avantages

1. ✅ **Compatibilité universelle** : Fonctionne sur tous les téléphones
2. ✅ **Configuration OBS flexible** : N'importe quelle configuration OBS fonctionne
3. ✅ **Automatique** : Pas besoin de configuration manuelle
4. ✅ **Optimisé** : Paramètres optimaux pour mobile

## ⚠️ Notes Importantes

1. **FFmpeg doit être installé** : Le transcodage nécessite FFmpeg
2. **Ressources serveur** : Le transcodage consomme CPU (mais avec `veryfast` preset, c'est gérable)
3. **Délai initial** : Attendre 10-15 secondes après le démarrage du stream pour que les fichiers HLS soient créés

## 🔧 Dépannage

### Le transcodage ne démarre pas

1. Vérifier que FFmpeg est installé : `ffmpeg -version`
2. Vérifier les logs du backend pour les erreurs
3. Vérifier que le statut du live est bien `"live"`

### Le stream ne fonctionne toujours pas

1. Vérifier que OBS stream est actif
2. Vérifier que les fichiers HLS sont créés : `ls /var/www/html/hls/mykog_live/`
3. Vérifier les logs FFmpeg dans la console du backend

## 📝 Résumé

**Avec cette solution, vous n'avez plus besoin de configurer OBS spécifiquement. Le transcodage automatique garantit la compatibilité universelle !**

