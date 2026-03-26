# Instructions pour corriger la configuration Nginx

## Problème
Les directives `add_header` ne sont pas autorisées dans le bloc RTMP (lignes 48-50).

## Solution rapide

Exécutez cette commande pour supprimer les lignes problématiques :

```bash
cd /home/zfred/Bureau/Zfred/MyKOG-Terminal/nginx
sudo ./remove-add-header.sh
```

## Solution manuelle

Si le script ne fonctionne pas, suivez ces étapes :

### 1. Ouvrir le fichier de configuration
```bash
sudo nano /etc/nginx/nginx.conf
```

### 2. Trouver les lignes 47-50
Vous devriez voir :
```nginx
            # CORS pour permettre l'accès depuis l'app
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
```

### 3. Supprimer ces 4 lignes
- Supprimez le commentaire `# CORS pour permettre l'accès depuis l'app`
- Supprimez les 3 lignes `add_header`

### 4. Sauvegarder
- Dans nano : `Ctrl+O` puis `Ctrl+X`

### 5. Tester et redémarrer
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Vérification

Après correction, vérifiez :

```bash
# Tester la configuration
sudo nginx -t

# Vérifier le statut
sudo systemctl status nginx

# Vérifier les ports
sudo ss -tuln | grep -E '1935|8080'
```

## Résultat attendu

- `nginx -t` : `nginx: configuration file /etc/nginx/nginx.conf test is successful`
- `systemctl status nginx` : `Active: active (running)`
- Ports ouverts : `1935` (RTMP) et `8080` (HLS)

