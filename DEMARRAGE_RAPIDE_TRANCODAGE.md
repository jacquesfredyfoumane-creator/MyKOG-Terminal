# 🚀 Démarrage Rapide - Transcodage Automatique

## ✅ Solution Implémentée

Le **transcodage automatique FFmpeg** est maintenant intégré dans le code. **Plus besoin de configurer OBS spécifiquement** - le stream sera automatiquement converti en format compatible avec tous les téléphones.

## 📦 Installation

### 1. Installer FFmpeg

```bash
./install-ffmpeg.sh
```

Ou manuellement :
```bash
sudo apt update
sudo apt install -y ffmpeg
```

### 2. Vérifier l'installation

```bash
ffmpeg -version
```

## 🔧 Configuration

### 1. Redémarrer Nginx (HLS direct désactivé)

```bash
sudo systemctl restart nginx
```

### 2. Redémarrer le Backend

```bash
cd backend-API
./restart-server.sh
```

## 🎬 Utilisation

### Étape 1 : Configurer OBS (N'importe quelle configuration)

Dans OBS, vous pouvez utiliser **n'importe quelle configuration** :
- Résolution : 720p, 1080p, etc.
- Profile : main, high, etc.
- Débit : n'importe quel débit

**Le transcodage convertira automatiquement en format compatible.**

### Étape 2 : Publier le Live

1. Créer le live dans le dashboard avec statut `"live"`
2. Le transcodage démarre **automatiquement** dans le backend
3. Configurer OBS avec l'URL RTMP affichée
4. Démarrer le stream dans OBS

### Étape 3 : C'est Tout !

Le stream HLS généré est automatiquement compatible avec tous les téléphones.

## 🔍 Vérification

### Vérifier que le transcodage fonctionne

```bash
# Vérifier les processus FFmpeg
ps aux | grep ffmpeg

# Vérifier les fichiers HLS générés
ls -la /var/www/html/hls/mykog_live/

# Vérifier les logs du backend
# (Vous devriez voir: "✅ Transcoder démarré pour: mykog_live")
```

## 📊 Paramètres de Transcodage (Automatiques)

Le transcodage utilise automatiquement :
- ✅ Profile `baseline` (compatible universel)
- ✅ Résolution `854x480` (optimal)
- ✅ Débit `1500 Kbps` (optimal)
- ✅ Pas de B-frames (meilleure compatibilité)
- ✅ Audio AAC 128 Kbps

## ⚠️ Notes Importantes

1. **FFmpeg doit être installé** : Exécutez `./install-ffmpeg.sh`
2. **Délai initial** : Attendre 10-15 secondes après le démarrage du stream
3. **Ressources serveur** : Le transcodage consomme CPU (mais gérable avec `veryfast` preset)

## 🎯 Avantages

1. ✅ **Compatibilité universelle** : Fonctionne sur tous les téléphones
2. ✅ **Configuration OBS flexible** : N'importe quelle configuration OBS fonctionne
3. ✅ **Automatique** : Démarre/arrête automatiquement selon le statut du live
4. ✅ **Optimisé** : Paramètres optimaux pour mobile dans le code

## 🔧 Dépannage

### Le transcodage ne démarre pas

1. Vérifier que FFmpeg est installé : `ffmpeg -version`
2. Vérifier les logs du backend
3. Vérifier que le statut du live est bien `"live"`

### Le stream ne fonctionne toujours pas

1. Vérifier que OBS stream est actif
2. Vérifier que les fichiers HLS sont créés : `ls /var/www/html/hls/mykog_live/`
3. Attendre 15-20 secondes après le démarrage du stream

## 📝 Résumé

**Avec cette solution, vous n'avez plus besoin de configurer OBS spécifiquement. Le transcodage automatique garantit la compatibilité universelle directement dans le code !**

