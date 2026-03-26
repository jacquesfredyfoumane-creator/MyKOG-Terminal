# 🎥 Guide de Configuration Live Streaming

## ✅ Modifications Appliquées

### 1. Détection IP Améliorée (Backend)
- ✅ Ignore les interfaces virtuelles (virbr0, docker0, etc.)
- ✅ Détecte automatiquement `192.168.100.6` (votre IP actuelle)
- ✅ Génère les URLs RTMP et HLS avec la bonne IP

### 2. Configuration Flutter
- ✅ IP par défaut mise à jour : `192.168.100.6`
- ✅ Détection automatique améliorée
- ✅ Validation d'URL HLS améliorée dans le player

### 3. Scripts de Diagnostic
- ✅ `test-ip-detection.sh` - Test rapide de détection IP
- ✅ `diagnostic-live.sh` - Diagnostic complet du système
- ✅ `setup-hls-permissions.sh` - Configuration des permissions HLS

## 🚀 Configuration Complète

### Étape 1 : Vérifier les Permissions HLS

```bash
./setup-hls-permissions.sh
```

### Étape 2 : Redémarrer le Backend

```bash
cd backend-API
./restart-server.sh
```

### Étape 3 : Vérifier Nginx

```bash
sudo systemctl status nginx
sudo systemctl restart nginx
```

### Étape 4 : Tester la Détection IP

```bash
./test-ip-detection.sh
```

Vous devriez voir :
- IP détectée: `192.168.100.6`
- URL RTMP: `rtmp://192.168.100.6:1935/live/mykog_live`
- URL HLS: `http://192.168.100.6:8080/hls/mykog_live/index.m3u8`

### Étape 5 : Configuration OBS

Dans OBS Studio :
1. **Paramètres** → **Diffusion**
2. **Service** : Personnalisé
3. **Serveur** : `rtmp://192.168.100.6:1935/live`
4. **Clé de diffusion** : `mykog_live`
5. Cliquez sur **OK**

### Étape 6 : Publier un Live depuis le Dashboard

1. Ouvrir le dashboard admin
2. Aller dans la section "Lives"
3. Cliquer sur "Publier Live Facebook" (mode rapide)
4. Remplir :
   - **Titre** : Ex: "Service du Dimanche"
   - **Pasteur** : Ex: "Prophete Xavier"
   - **IP du Serveur** : Laisser vide (détection automatique) ou `192.168.100.6`
5. Cliquer sur **Publier le Live**

L'URL RTMP sera automatiquement générée avec votre IP.

### Étape 7 : Démarrer le Stream dans OBS

1. Dans OBS, cliquer sur **Commencer le streaming**
2. Vérifier qu'il n'y a pas d'erreur de connexion
3. Attendre quelques secondes pour que les fichiers HLS soient créés

### Étape 8 : Vérifier le Stream

```bash
# Vérifier que les fichiers HLS sont créés
ls -la /var/www/html/hls/mykog_live/

# Tester l'URL HLS
curl http://192.168.100.6:8080/hls/mykog_live/index.m3u8
```

### Étape 9 : Tester dans l'App Flutter

1. Ouvrir l'app Flutter
2. Aller dans l'onglet "Live"
3. Le live actif devrait apparaître automatiquement
4. Cliquer pour ouvrir le player

## 🔍 Diagnostic en Cas de Problème

### Exécuter le Diagnostic Complet

```bash
./diagnostic-live.sh
```

### Problèmes Courants

#### 1. OBS ne se connecte pas
- ✅ Vérifier que Nginx est démarré : `sudo systemctl status nginx`
- ✅ Vérifier les ports : `sudo ss -tuln | grep -E '1935|8080'`
- ✅ Vérifier l'IP dans OBS : doit être `192.168.100.6`

#### 2. Fichiers HLS non créés
- ✅ Exécuter : `./setup-hls-permissions.sh`
- ✅ Vérifier que OBS stream est actif
- ✅ Vérifier les logs Nginx : `sudo tail -f /var/log/nginx/error.log`

#### 3. App Flutter ne charge pas le stream
- ✅ Vérifier l'IP dans l'app (Paramètres → Mode de connexion)
- ✅ Réinitialiser le cache IP si nécessaire
- ✅ Vérifier que le live a le statut "live" dans Firestore

#### 4. URL HLS retourne 404
- ✅ Vérifier que OBS stream est actif
- ✅ Vérifier que les fichiers existent : `ls /var/www/html/hls/mykog_live/`
- ✅ Redémarrer OBS et le stream

## 📋 Checklist de Vérification

- [ ] Nginx est démarré et les ports 1935/8080 sont ouverts
- [ ] Les permissions HLS sont correctes (`./setup-hls-permissions.sh`)
- [ ] Le backend détecte la bonne IP (`./test-ip-detection.sh`)
- [ ] OBS est configuré avec `rtmp://192.168.100.6:1935/live`
- [ ] Un live avec statut "live" existe dans Firestore
- [ ] Les fichiers HLS sont créés dans `/var/www/html/hls/mykog_live/`
- [ ] L'URL HLS est accessible : `curl http://192.168.100.6:8080/hls/mykog_live/index.m3u8`
- [ ] L'app Flutter utilise la bonne IP (192.168.100.6)

## 🎯 URLs Importantes

- **Backend API** : `http://192.168.100.6:3000`
- **RTMP (OBS)** : `rtmp://192.168.100.6:1935/live/mykog_live`
- **HLS (App)** : `http://192.168.100.6:8080/hls/mykog_live/index.m3u8`
- **Dashboard Admin** : `http://192.168.100.6:3000` (si servi par le backend)

## 📝 Notes

- L'IP est détectée automatiquement au démarrage du backend
- Si l'IP change, redémarrer le backend pour qu'elle soit mise à jour
- Les URLs RTMP/HLS sont générées dynamiquement avec l'IP actuelle
- Le dashboard récupère automatiquement l'IP via `/api/lives/server-info`

