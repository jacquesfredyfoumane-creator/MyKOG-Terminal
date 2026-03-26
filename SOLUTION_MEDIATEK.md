# 🔧 Solution pour Téléphones MediaTek

## ❌ Problème Identifié

Le transcodage fonctionne (854x480, baseline), mais le codec MediaTek (`OMX.MTK.VIDEO.DECODER.AVC`) ne peut pas décoder le stream.

**Erreur** : `Decoder init failed: OMX.MTK.VIDEO.DECODER.AVC` avec `avc1.42C01F`

## ✅ Solution Appliquée

J'ai modifié les paramètres de transcodage pour une **compatibilité maximale avec MediaTek** :

### Changements Effectués

1. **Résolution** : `640x360` (au lieu de 854x480)
   - Plus compatible avec les codecs MediaTek limités

2. **Level H.264** : `3.0` (au lieu de 3.1)
   - Level 3.0 est plus compatible avec MediaTek

3. **FPS** : `25` (au lieu de 30)
   - Moins de charge pour le décodeur

4. **Débit vidéo** : `800k` (au lieu de 1500k)
   - Moins de données à décoder

5. **Options x264 désactivées** :
   - `no-mbtree` : Désactive l'arbre de macro-blocs
   - `no-cabac` : Désactive CABAC (utilise CAVLC à la place)
   - `no-8x8dct` : Désactive la transformée 8x8

6. **Audio** : `96k` à `44100 Hz` (au lieu de 128k à 48000 Hz)
   - Paramètres plus standards

## 🚀 Redémarrer le Backend

Après ces modifications, redémarrer le backend :

```bash
cd backend-API
./restart-server.sh
```

## 🔍 Vérification

### Vérifier les nouveaux paramètres

```bash
ps aux | grep ffmpeg | grep mykog_live
```

Vous devriez voir :
- `-s 640x360` (nouvelle résolution)
- `-level 3.0` (nouveau level)
- `-r 25` (nouveau FPS)
- `-b:v 800k` (nouveau débit)

### Tester dans l'app Flutter

Le stream devrait maintenant fonctionner sur votre téléphone MediaTek.

## 📊 Comparaison des Paramètres

| Paramètre | Avant | Après (MediaTek) |
|-----------|-------|------------------|
| Résolution | 854x480 | 640x360 |
| Level H.264 | 3.1 | 3.0 |
| FPS | 30 | 25 |
| Débit vidéo | 1500k | 800k |
| Débit audio | 128k | 96k |
| Sample rate | 48000 Hz | 44100 Hz |
| Options x264 | Standard | Désactivées (ultra-compatible) |

## ⚠️ Si Ça Ne Fonctionne Toujours Pas

### Option 1 : Résolution encore plus basse

Modifier dans `ffmpeg_transcoder.js` :
```javascript
'-s', '426x240',  // Résolution très basse
'-b:v', '500k',   // Débit très bas
```

### Option 2 : Utiliser un autre format

Essayer DASH au lieu de HLS (mais nécessite des modifications plus importantes).

### Option 3 : Vérifier les capacités du téléphone

Le téléphone MediaTek peut avoir des limitations matérielles très strictes. Vérifier :
- Version Android (doit être >= 5.0)
- RAM disponible
- Processeur MediaTek (certains modèles sont très limités)

## 📝 Note

Ces paramètres sont optimisés pour les téléphones MediaTek bas de gamme. Si vous avez d'autres téléphones qui fonctionnent bien, vous pouvez créer deux profils de transcodage (un pour MediaTek, un pour les autres).

