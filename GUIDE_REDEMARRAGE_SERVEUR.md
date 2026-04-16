# Guide : Arrêter et Redémarrer le Serveur

## Problème
Le serveur Node.js continue de tourner en arrière-plan même après Ctrl+C.

## Solution

### Option 1 : Script automatique (Recommandé)

```bash
cd /home/zfred/Bureau/Zfred/MyKOG-Terminal/backend-API

# Arrêter le serveur
./kill-server.sh

# Redémarrer le serveur
node server.js
```

### Option 2 : Commandes manuelles

```bash
# 1. Trouver le processus
lsof -ti:3000
# ou
pgrep -f "node.*server.js"

# 2. Tuer le processus (remplacez PID par le numéro trouvé)
kill -9 PID

# 3. Vérifier que le port est libre
lsof -ti:3000

# 4. Redémarrer
cd /home/zfred/Bureau/Zfred/MyKOG-Terminal/backend-API
node server.js
```

### Option 3 : Tuer tous les processus Node.js

```bash
killall -9 node
```

⚠️ **Attention** : Cela tuera TOUS les processus Node.js en cours d'exécution.

## Scripts disponibles

### `kill-server.sh`
Arrête tous les processus Node.js liés au serveur et libère le port 3000.

```bash
./kill-server.sh
```

### `restart-server.sh`
Arrête le serveur et le redémarre automatiquement.

```bash
./restart-server.sh
```

## Vérification

Après avoir arrêté le serveur, vérifiez :

```bash
# Vérifier que le port est libre
lsof -ti:3000
# Ne doit rien retourner

# Tester la connexion
curl http://localhost:3000
# Doit échouer avec "Connection refused"
```

## Redémarrage propre

```bash
cd /home/zfred/Bureau/Zfred/MyKOG-Terminal/backend-API

# 1. Arrêter
./kill-server.sh

# 2. Attendre 2 secondes
sleep 2

# 3. Redémarrer
node server.js
```

## Workflow recommandé

1. **Arrêter** : `./kill-server.sh`
2. **Vérifier** : `lsof -ti:3000` (ne doit rien retourner)
3. **Redémarrer** : `node server.js`

---

**Le serveur est maintenant à jour et fonctionne correctement ! ✅**

