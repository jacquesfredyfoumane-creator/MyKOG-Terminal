# MyKOG Admin Dashboard

Dashboard d'administration moderne pour publier du contenu vers votre backend API et Firebase.

## 🚀 Fonctionnalités

- **Enseignements** : Publier des enseignements avec upload d'image et audio
- **Annonces** : Créer et gérer les annonces
- **Lives** : Gérer les streams en direct
- **Statistiques** : Vue d'ensemble de votre contenu

## 📋 Prérequis

- Node.js 18+ 
- Backend API en cours d'exécution (port 3000 par défaut)

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer l'URL de l'API (optionnel) :
Créer un fichier `.env.local` :
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Par défaut, le dashboard utilise `http://localhost:3000/api`

## 🏃 Démarrage

Démarrer le serveur de développement :
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
admin-dashboard/
├── app/                    # Pages Next.js (App Router)
│   ├── enseignements/      # Page des enseignements
│   ├── annonces/           # Page des annonces
│   ├── lives/              # Page des lives
│   └── statistiques/       # Page des statistiques
├── components/             # Composants React réutilisables
├── lib/                    # Utilitaires et services
│   └── api/               # Clients API
├── types/                  # Types TypeScript
└── public/                 # Fichiers statiques
```

## 🔌 API Backend

Le dashboard communique avec votre backend API via les endpoints suivants :

- `POST /api/enseignements` - Créer un enseignement
- `GET /api/enseignements` - Récupérer tous les enseignements
- `POST /api/annonces` - Créer une annonce
- `GET /api/annonces` - Récupérer toutes les annonces
- `POST /api/lives` - Créer un live stream
- `GET /api/lives` - Récupérer tous les lives
- `PUT /api/lives/:id/status` - Mettre à jour le statut d'un live
- `DELETE /api/lives/:id` - Supprimer un live

## 🎨 Technologies utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Heroicons** - Icônes
- **date-fns** - Formatage des dates

## 📝 Utilisation

### Publier un enseignement

1. Aller dans la section "Enseignements"
2. Cliquer sur "+ Nouvel enseignement"
3. Remplir le formulaire :
   - Titre et orateur (requis)
   - Description, catégorie, tags
   - Sélectionner une image et un fichier audio
4. Cliquer sur "Publier"

### Créer une annonce

1. Aller dans la section "Annonces"
2. Cliquer sur "+ Nouvelle annonce"
3. Remplir le nom et la description
4. Cliquer sur "Publier"

### Gérer un live

1. Aller dans la section "Lives"
2. Cliquer sur "+ Nouveau live"
3. Remplir les informations (titre, pasteur, URL du stream)
4. Publier et gérer le statut (programmé → en direct → terminé)

## 🔧 Build pour production

```bash
npm run build
npm start
```

## 📄 Licence

Propriétaire - MyKOG
