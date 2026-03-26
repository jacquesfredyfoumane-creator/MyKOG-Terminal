# Vérification Finale - Configuration RTMP/HLS

## Commandes à exécuter pour finaliser la configuration

### 1. Tester la configuration Nginx
```bash
sudo nginx -t
```

**Résultat attendu** : `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### 2. Redémarrer Nginx
```bash
sudo systemctl restart nginx
```

### 3. Vérifier le statut de Nginx
```bash
sudo systemctl status nginx
```

**Résultat attendu** : `Active: active (running)`

### 4. Vérifier que les ports sont ouverts
```bash
sudo ss -tuln | grep -E '1935|8080'
```

**Résultat attendu** :
```
tcp   LISTEN  0  128  0.0.0.0:1935  0.0.0.0:*  (RTMP)
tcp   LISTEN  0  128  0.0.0.0:8080  0.0.0.0:*  (HLS)
```

### 5. Vérifier les logs (optionnel)
```bash
sudo tail -f /var/log/nginx/error.log
```

## Configuration OBS

Une fois Nginx redémarré avec succès, configurez OBS :

- **Service** : Personnalisé
- **Serveur** : `rtmp://192.168.43.3:1935/live`
- **Clé de stream** : `mykog_live`

## Test de connexion

1. Dans OBS, cliquez sur "Démarrer le streaming"
2. Si la connexion réussit, vous devriez voir "Streaming en cours" dans OBS
3. Vérifiez que les fichiers HLS sont générés :
   ```bash
   ls -la /var/www/html/hls/mykog_live/
   ```
4. Testez l'URL HLS dans le navigateur :
   ```
   http://192.168.43.3:8080/hls/mykog_live/index.m3u8
   ```

## Problèmes courants

### Si `nginx -t` échoue encore
- Vérifiez que le module RTMP est chargé : `grep "load_module" /etc/nginx/nginx.conf`
- Vérifiez qu'il n'y a pas de `add_header` dans le bloc RTMP : `grep -A 5 "rtmp {" /etc/nginx/nginx.conf | grep add_header`

### Si les ports ne sont pas ouverts
- Vérifiez le firewall : `sudo ufw status`
- Ouvrez les ports si nécessaire : `sudo ufw allow 1935/tcp && sudo ufw allow 8080/tcp`

### Si OBS ne peut pas se connecter
- Vérifiez l'IP : `hostname -I | awk '{print $1}'`
- Vérifiez que Nginx écoute sur toutes les interfaces : `sudo ss -tuln | grep 1935`
- Vérifiez les logs : `sudo tail -20 /var/log/nginx/error.log`

