# 🎥 Guide de Lancement Live - Checklist Complète

## ✅ Corrections Appliquées

1. **Dashboard** : Appel API corrigé pour utiliser le backend Node.js
2. **Thumbnail vide** : Gestion des thumbnails vides corrigée
3. **Player vidéo** : Gestion d'erreurs améliorée avec messages clairs

## 🚀 Processus de Lancement Complet

### Étape 1 : Vérifier que tout est prêt

```bash
# 1. Vérifier Nginx
sudo systemctl status nginx

# 2. Vérifier le backend
curl http://localhost:3000/api/lives/server-info

# 3. Vérifier les ports
curl http://localhost:3000/api/lives/server-info
ss -tuln | grep -E '1935|8080'   
```

### Étape 2 : Configurer OBS Studio

1. Ouvrir OBS Studio
2. **Paramètres** → **Diffusion**
3. Configurer :
   - **Service** : Personnalisé
   - **Serveur** : `rtmp://192.168.100.6:1935/live`
   - **Clé de diffusion** : `mykog_live`
4. Cliquer sur **OK**

⚠️ **NE PAS DÉMARRER LE STREAM ENCORE** - Attendre d'avoir créé le live dans le dashboard

### Étape 3 : Publier le Live depuis le Dashboard

1. Ouvrir le dashboard : `http://192.168.100.6:3001` (ou le port affiché)
2. Aller dans **Lives** → **Publier Live Facebook**
3. Remplir :
   - **Titre** : Ex: "Service du Dimanche"
   - **Pasteur** : Ex: "Prophete Xavier"
   - **Description** (optionnel)
   - **IP du Serveur** : Laisser vide (détection automatique)
4. Cliquer sur **Publier le Live**

✅ Le live est maintenant créé avec le statut "live"

### Étape 4 : Démarrer le Stream dans OBS

1. Dans OBS, cliquer sur **Commencer le streaming**
2. Attendre 10-15 secondes pour que les fichiers HLS soient créés
3. Vérifier qu'il n'y a pas d'erreur dans OBS

### Étape 5 : Vérifier que le Stream fonctionne

```bash
# Vérifier que les fichiers HLS sont créés
ls -la /var/www/html/hls/mykog_live/

# Vous devriez voir :
# - index.m3u8
# - Des fichiers .ts (segments vidéo)

# Tester l'URL HLS
curl http://192.168.100.6:8080/hls/mykog_live/index.m3u8

# Doit retourner le contenu du fichier .m3u8
```

### Étape 6 : Tester dans l'App Flutter

1. Ouvrir l'app Flutter sur le téléphone
2. Aller dans l'onglet **Live**
3. Le live actif devrait apparaître automatiquement
4. Cliquer pour ouvrir le player
5. Le stream devrait se charger et jouer

## 🔍 En Cas de Problème

### Erreur "MediaCodec" ou "ExoPlaybackException"

**Cause** : Le stream HLS n'est pas encore disponible ou les fichiers ne sont pas créés.

**Solution** :
1. Vérifier que OBS stream est actif (bouton "Arrêter le streaming" visible)
2. Attendre 15-20 secondes après le démarrage
3. Vérifier les fichiers HLS : `ls /var/www/html/hls/mykog_live/`
4. Si les fichiers n'existent pas, redémarrer OBS et le stream

### Erreur "Unable to load asset: ''"

**Cause** : Thumbnail vide (corrigé dans le code).

**Solution** : Relancer l'app Flutter.

### Erreur 404 sur `/api/lives/server-info`

**Cause** : Le dashboard appelle la mauvaise URL (corrigé dans le code).

**Solution** : Redémarrer le dashboard Next.js.

### Le stream ne se charge pas dans l'app

**Vérifications** :
1. ✅ OBS stream est actif
2. ✅ Fichiers HLS existent : `ls /var/www/html/hls/mykog_live/`
3. ✅ URL HLS accessible : `curl http://192.168.100.6:8080/hls/mykog_live/index.m3u8`
4. ✅ Live a le statut "live" dans Firestore
5. ✅ App utilise la bonne IP (192.168.100.6)

## 📋 Checklist Rapide

- [ ] Nginx démarré
- [ ] Backend Node.js démarré (port 3000)
- [ ] Dashboard Next.js démarré (port 3001)
- [ ] OBS configuré avec `rtmp://192.168.100.6:1935/live`
- [ ] Live créé dans le dashboard avec statut "live"
- [ ] OBS stream actif (bouton "Arrêter le streaming" visible)
- [ ] Fichiers HLS créés : `ls /var/www/html/hls/mykog_live/`
- [ ] URL HLS accessible : `curl http://192.168.100.6:8080/hls/mykog_live/index.m3u8`
- [ ] App Flutter utilise l'IP 192.168.100.6

## 🎯 URLs Importantes

- **Backend API** : `http://192.168.100.6:3000`
- **Dashboard** : `http://192.168.100.6:3001` (ou port affiché)
- **RTMP (OBS)** : `rtmp://192.168.100.6:1935/live/mykog_live`
- **HLS (App)** : `http://192.168.100.6:8080/hls/mykog_live/index.m3u8`

## ⚠️ Ordre Important

1. **D'abord** : Créer le live dans le dashboard
2. **Ensuite** : Démarrer le stream dans OBS
3. **Enfin** : Tester dans l'app Flutter

Si vous démarrez OBS avant de créer le live, l'app ne trouvera pas le live actif.

