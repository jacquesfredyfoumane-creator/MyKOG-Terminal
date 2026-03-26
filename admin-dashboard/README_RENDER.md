# 🚀 Déploiement Dashboard Admin sur Render

## 📋 Prérequis

- Compte Render avec plan gratuit
- Repository GitHub avec le code du dashboard
- Backend API déjà déployé sur Render

## 🎯 Objectif

Déployer le dashboard admin Next.js sur Render et le connecter au backend API hébergé.

## 📁 Fichiers créés

### 1. **render.yaml**
Configuration de déploiement pour Render avec :
- Service web principal (dashboard)
- Service privé (veilleur ping)

### 2. **veilleur.js**
Script Node.js qui maintient le dashboard actif en envoyant des pings toutes les 14 minutes.

### 3. **env.render.example**
Variables d'environnement pour la production.

## 🔧 Étapes de déploiement

### Étape 1: Préparer le repository

1. **Ajouter les fichiers au Git** :
```bash
cd /home/zfred/Bureau/Zfred/MyKOG-Terminal
git add admin-dashboard/render.yaml
git add admin-dashboard/veilleur.js
git add admin-dashboard/env.render.example
git add admin-dashboard/package.json
git commit -m "Ajout configuration Render pour dashboard admin"
git push origin main
```

### Étape 2: Créer le service sur Render

1. **Connectez-vous à Render** : https://render.com
2. **Cliquez sur "New +" → "Web Service"**
3. **Configurez comme suit** :

#### **Configuration de base**
- **Name**: `mykog-admin-dashboard`
- **Repository**: `jacquesfredyfoumane-creator/MyKOG-Terminal`
- **Branch**: `main`
- **Root Directory**: `admin-dashboard`
- **Language**: `Node`
- **Plan**: `Free`

#### **Configuration Build**
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`

#### **Variables d'environnement**
Ajoutez ces variables dans la section "Environment Variables" :

```bash
# Configuration API
NEXT_PUBLIC_API_URL=https://mykog-backend-api.onrender.com/api

# Configuration serveur
PORT=10000
NODE_ENV=production
```

**OU** utilisez "Add from .env" avec le fichier `env.render.example`.

### Étape 3: Créer le service Veilleur

1. **Cliquez sur "New +" → "Private Service"**
2. **Configurez comme suit** :

#### **Configuration du veilleur**
- **Name**: `mykog-admin-veilleur`
- **Repository**: `jacquesfredyfoumane-creator/MyKOG-Terminal`
- **Branch**: `main`
- **Root Directory**: `admin-dashboard`
- **Language**: `Node`
- **Plan**: `Free`

#### **Configuration Build**
- **Build Command**: `npm ci`
- **Start Command**: `node veilleur.js`

#### **Variables d'environnement**
```bash
NODE_ENV=production
DASHBOARD_URL=https://mykog-admin-dashboard.onrender.com
PING_INTERVAL=840000  # 14 minutes en ms
```

## 🌐 URLs après déploiement

- **Dashboard**: `https://mykog-admin-dashboard.onrender.com`
- **Backend API**: `https://mykog-backend-api.onrender.com/api`

## 🔍 Vérification du déploiement

### 1. Dashboard principal
Ouvrez l'URL du dashboard et vérifiez :
- ✅ Page se charge correctement
- ✅ Connexion au backend API fonctionne
- ✅ Les données s'affichent (enseignements, annonces, etc.)

### 2. Logs du veilleur
Dans le service `mykog-admin-veilleur`, vérifiez les logs :
```
🚀 Démarrage du veilleur pour: https://mykog-admin-dashboard.onrender.com
⏰ Intervalle de ping: 14 minutes
✅ Ping réussi - Status: 200 - Temps: 1234ms
🟢 Dashboard actif et accessible
```

## 🛠️ Configuration API

Le dashboard utilise automatiquement le backend configuré via :
```typescript
// Dans lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
```

### En production (Render)
```typescript
// URL automatique
NEXT_PUBLIC_API_URL=https://mykog-backend-api.onrender.com/api
```

### En développement (local)
```typescript
// URL par défaut
http://localhost:3000/api
```

## 📊 Monitoring

### Logs à surveiller

#### **Dashboard principal**
- Build réussi
- Démarrage du serveur Next.js
- Connexions API réussies

#### **Veilleur**
- Pings réguliers toutes les 14 minutes
- Temps de réponse
- Erreurs éventuelles

### Indicateurs de santé

#### **Vert ✅**
- Dashboard répond (status 200)
- Veilleur ping réussi
- API backend accessible

#### **Orange 🟡**
- Dashboard répond avec erreurs 4xx
- Temps de réponse élevé

#### **Rouge 🔴**
- Dashboard inaccessible (5xx ou timeout)
- Veilleur ne peut pas pinguer

## 🔧 Dépannage

### Problème : Dashboard ne se connecte pas au backend

**Symptôme** : Erreur "Impossible de se connecter au serveur"

**Solutions** :
1. Vérifiez la variable `NEXT_PUBLIC_API_URL`
2. Confirmez que le backend API est actif
3. Testez manuellement : `curl https://mykog-backend-api.onrender.com/api/enseignements`

### Problème : Veilleur ne fonctionne pas

**Symptôme** : Logs montrent des erreurs de ping

**Solutions** :
1. Vérifiez la variable `DASHBOARD_URL`
2. Confirmez que le dashboard est déployé
3. Redémarrez le service veilleur

### Problème : Build échoue

**Symptôme** : Erreur pendant `npm run build`

**Solutions** :
1. Vérifiez que toutes les dépendances sont dans `package.json`
2. Nettoyez le cache : `rm -rf .next`
3. Rebuild localement : `npm run build`

## 🔄 Mises à jour

Pour mettre à jour le dashboard :

1. **Poussez les changements** sur GitHub
2. **Render détecte automatiquement** et redéploie
3. **Le veilleur continue** de fonctionner pendant le déploiement

## 📝 Notes importantes

1. **Le veilleur empêche le sleep** de 15 minutes de Render
2. **Les variables d'environnement** sont automatiquement injectées
3. **Le HTTPS** est géré automatiquement par Render
4. **Le cache Next.js** est optimisé pour la production

## 🎯 Avantages de cette configuration

- ✅ **24/7 disponible** avec veilleur automatique
- ✅ **HTTPS sécurisé** automatique
- ✅ **Auto-déploiement** depuis GitHub
- ✅ **Monitoring intégré** via les logs
- ✅ **Scalabilité** facile vers les plans payants

## 🚀 Prochaines étapes

1. ✅ Déployer le dashboard
2. ✅ Configurer le veilleur
3. ✅ Tester toutes les fonctionnalités
4. 📱 Optimiser les performances
5. 🔒 Ajouter l'authentification si nécessaire

---

**Votre dashboard admin sera accessible à** : `https://mykog-admin-dashboard.onrender.com`
