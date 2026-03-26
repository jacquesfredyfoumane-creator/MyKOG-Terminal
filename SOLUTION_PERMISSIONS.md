# 🔧 Solution au Problème de Permissions

## ❌ Problème Identifié

```
⚠️ Erreur démarrage transcoder: EACCES: permission denied, mkdir '/var/www/html/hls/mykog_live'
```

Le backend n'a pas les permissions pour créer le dossier HLS.

## ✅ Solution

### Étape 1 : Configurer les Permissions du Dossier HLS

Exécuter le script de configuration :

```bash
./setup-hls-directory.sh
```

Ou manuellement :

```bash
sudo mkdir -p /var/www/html/hls
sudo chown -R www-data:www-data /var/www/html/hls
sudo chmod -R 755 /var/www/html/hls
```

### Étape 2 : Vérifier les Permissions

```bash
ls -la /var/www/html/hls/
```

Vous devriez voir :
```
drwxr-xr-x www-data www-data /var/www/html/hls
```

### Étape 3 : Redémarrer le Backend

```bash
cd backend-API
./restart-server.sh
```

### Étape 4 : Vérifier que le Transcoder Démarre

Dans les logs du backend, vous devriez voir :
```
✅ Dossier HLS créé avec les bonnes permissions: /var/www/html/hls/mykog_live
🎬 Démarrage du transcodage FFmpeg pour: mykog_live
✅ Transcoder démarré pour mykog_live
```

### Étape 5 : Vérifier les Fichiers HLS

```bash
# Vérifier que les fichiers sont créés
sudo ls -la /var/www/html/hls/mykog_live/

# Vérifier le contenu du fichier .m3u8
curl http://192.168.100.6:8080/hls/mykog_live/index.m3u8
```

## 🔍 Vérification du Transcodage

### Vérifier que FFmpeg est actif

```bash
ps aux | grep ffmpeg | grep mykog_live
```

Vous devriez voir un processus FFmpeg avec les paramètres :
- `-s 854x480` (résolution transcodée)
- `-profile:v baseline` (profil compatible)

### Vérifier que les fichiers sont bien transcodés

Les fichiers `.ts` générés par FFmpeg devraient être en 854x480, pas 1280x720.

## ⚠️ Si le Problème Persiste

### Option 1 : Configurer sudo sans mot de passe

Pour que le backend puisse utiliser `sudo` sans mot de passe :

```bash
# Éditer le fichier sudoers
sudo visudo

# Ajouter cette ligne (remplacer USERNAME par votre nom d'utilisateur)
USERNAME ALL=(ALL) NOPASSWD: /usr/bin/mkdir, /bin/chown, /bin/chmod, /usr/bin/ffmpeg
```

### Option 2 : Lancer le backend avec sudo

```bash
sudo node server.js
```

⚠️ **Note** : Cela peut causer d'autres problèmes de permissions.

## 📝 Résumé

1. Exécuter `./setup-hls-directory.sh`
2. Redémarrer le backend
3. Vérifier que le transcodage démarre
4. Vérifier que les fichiers HLS sont créés avec les bonnes permissions

