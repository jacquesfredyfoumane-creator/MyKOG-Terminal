# 🎥 Guide : Publication Live Facebook depuis le Dashboard Admin

## 📋 Vue d'ensemble

Le dashboard admin dispose maintenant d'une fonctionnalité de **publication rapide** pour les lives Facebook. Vous pouvez coller le lien du live Facebook et le publier instantanément vers l'application Flutter.

---

## 🚀 Utilisation Rapide

### 1️⃣ **Accéder à la Page Lives**

1. Ouvrez votre dashboard admin
2. Naviguez vers la section **"Lives"** dans le menu

### 2️⃣ **Publier un Live Facebook**

#### Option A : Publication Rapide (Recommandé)

1. Cliquez sur le bouton **"🎥 Publier Live Facebook"**
2. Le formulaire s'affiche en mode rapide
3. Si un live actif existe déjà, il sera pré-rempli
4. Collez l'**URL du Live Facebook** dans le champ dédié
5. Remplissez les informations (Titre, Pasteur, Description - optionnel)
6. Cliquez sur **"🚀 Publier le Live"**

#### Option B : Formulaire Complet

1. Cliquez sur **"Nouveau live"**
2. Remplissez tous les champs du formulaire
3. Publiez le live

---

## 🔗 Récupérer l'URL du Live Facebook

### Méthode 1 : URL de la Page Facebook

Quand vous lancez un live sur Facebook, vous obtenez une URL comme :
```
https://facebook.com/live/123456789
```

### Méthode 2 : URL HLS Directe (Recommandé)

Pour une meilleure qualité et un chargement plus rapide :

1. Lancez votre live sur Facebook
2. Ouvrez les **Outils de développement** du navigateur (F12)
3. Allez dans l'onglet **Network**
4. Filtrez par **"m3u8"** ou **"HLS"**
5. Copiez l'URL qui ressemble à :
```
https://video.xx.fbcdn.net/hls-live/xxx/xxx.m3u8
```

> 💡 **Astuce** : L'URL HLS directe est plus fiable et charge plus rapidement dans l'app Flutter.

---

## ✨ Fonctionnalités

### Mode Publication Rapide

- ✅ **Détection automatique** du live actif
- ✅ **Pré-remplissage** des champs si un live existe
- ✅ **Statut automatique** : Le live est automatiquement mis à "live"
- ✅ **Mise à jour intelligente** : Met à jour le live existant ou en crée un nouveau
- ✅ **Interface simplifiée** : Seuls les champs essentiels sont affichés

### Mode Formulaire Complet

- ✅ Tous les champs disponibles
- ✅ Programmation de lives
- ✅ Gestion des tags
- ✅ Configuration complète

---

## 🔄 Workflow Complet

### Scénario : Culte du Dimanche

1. **10h00** : Vous lancez OBS → Facebook Live
2. **10h01** : Facebook génère l'URL du live
3. **10h02** : Vous ouvrez le dashboard admin
4. **10h03** : Vous cliquez sur **"🎥 Publier Live Facebook"**
5. **10h04** : Vous collez l'URL Facebook et publiez
6. **10h05** : Les utilisateurs voient le live dans l'app Flutter
7. **11h30** : Le culte se termine
8. **11h31** : Vous mettez le statut à "Terminé" dans la liste des lives

---

## 📱 Vérification dans l'Application Flutter

Après publication :

1. Ouvrez l'application Flutter MyKOG
2. Allez dans l'onglet **"Live"**
3. Le live actif apparaît automatiquement en haut de l'écran
4. Cliquez sur **"Regarder maintenant"** pour lancer la lecture

> ⚡ **Note** : L'application vérifie automatiquement les nouveaux lives toutes les 10 secondes.

---

## 🐛 Dépannage

### Le live ne s'affiche pas dans l'app

1. **Vérifier le statut** : Le live doit avoir le statut "live" (pas "scheduled")
2. **Vérifier l'URL** : L'URL doit être accessible et valide
3. **Vérifier la connexion** : Le backend doit être accessible depuis l'app
4. **Vérifier les logs** : Consultez les logs du backend et de l'app

### Le formulaire ne charge pas le live actif

1. Vérifier que le backend est démarré
2. Vérifier la route `/api/lives/active` dans le backend
3. Vérifier la console du navigateur pour les erreurs

### L'URL Facebook ne fonctionne pas

1. Vérifier que le live est bien actif sur Facebook
2. Essayer l'URL HLS directe plutôt que l'URL de la page
3. Vérifier que l'URL commence par `http://` ou `https://`

---

## 📚 API Backend

### Routes Utilisées

- `GET /api/lives/active` - Récupérer le live actif
- `POST /api/lives` - Créer un nouveau live
- `PUT /api/lives/:id` - Mettre à jour un live existant
- `PUT /api/lives/:id/status` - Mettre à jour le statut

### Structure des Données

```typescript
{
  title: string;           // Titre du live
  pastor: string;          // Nom du pasteur
  description?: string;    // Description (optionnel)
  streamUrl: string;       // URL du live Facebook (obligatoire)
  status: 'live';          // Statut (automatiquement 'live' en mode rapide)
  thumbnailUrl?: string;   // URL de la miniature (optionnel)
  tags?: string[];         // Tags (optionnel)
}
```

---

## 🎯 Bonnes Pratiques

1. **Utilisez l'URL HLS directe** pour une meilleure qualité
2. **Vérifiez le live actif** avant de publier un nouveau
3. **Mettez à jour le statut** à "Terminé" quand le live se termine
4. **Testez l'URL** dans l'app avant le début officiel du live
5. **Gardez le dashboard ouvert** pendant le live pour des mises à jour rapides

---

## 🆘 Support

En cas de problème :

1. Vérifier les logs du backend (`backend-API/server.js`)
2. Vérifier la console du navigateur (F12)
3. Vérifier les logs Flutter (`flutter run`)
4. Vérifier la connexion réseau entre les appareils

---

**Bon streaming ! 🎥✨**

