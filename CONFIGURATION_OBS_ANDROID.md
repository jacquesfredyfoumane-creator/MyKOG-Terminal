# 📱 Configuration OBS pour Compatibilité Android

## ⚠️ Problème Identifié

L'erreur `Decoder init failed: OMX.MTK.VIDEO.DECODER.AVC` indique que le téléphone MediaTek ne peut pas décoder le format H.264 utilisé.

## ✅ Solution : Configuration OBS Optimale

### Paramètres Vidéo (OBS → Paramètres → Vidéo)

```
Résolution de base (Canvas) : 854x480 (ou 1280x720)
Résolution de sortie : 854x480 (ou 1280x720)
Filtre de mise à l'échelle : Lanczos
FPS : 30
```

### Paramètres Sortie (OBS → Paramètres → Sortie)

**Mode : Avancé**

#### Onglet "Diffusion"
- **Encodeur** : `x264` (logiciel) - Plus compatible que les encodeurs matériels
- **Débit binaire** : `2000` Kbps (ou 1500 pour 480p)
- **Preset** : `veryfast` ou `faster`
- **Profile** : `baseline` ⚠️ **IMPORTANT pour Android**
- **Tune** : `zerolatency`
- **Keyframe Interval** : `2` (pour HLS)

#### Paramètres x264 personnalisés (Optionnel mais recommandé)

Dans le champ "Paramètres d'encodage personnalisés", ajouter :

```
profile=baseline level=3.1 keyint=60 scenecut=0
```

**Explication** :
- `profile=baseline` : Profil H.264 le plus compatible avec Android
- `level=3.1` : Niveau compatible avec la plupart des appareils
- `keyint=60` : Intervalle de keyframe (2 secondes à 30fps)
- `scenecut=0` : Désactive la détection de scène pour stabilité

### Paramètres Audio (OBS → Paramètres → Audio)

- **Codec** : AAC
- **Débit binaire** : 128 Kbps
- **Sample Rate** : 48 kHz

## 🎯 Configuration Recommandée par Résolution

### Option 1 : Haute Compatibilité (480p)
```
Résolution : 854x480
FPS : 30
Débit vidéo : 1500 Kbps
Débit audio : 128 Kbps
Profile : baseline
```

### Option 2 : Qualité Moyenne (720p)
```
Résolution : 1280x720
FPS : 30
Débit vidéo : 2500 Kbps
Débit audio : 128 Kbps
Profile : baseline
```

### Option 3 : Qualité Élevée (720p - Risque de compatibilité)
```
Résolution : 1280x720
FPS : 30
Débit vidéo : 3000 Kbps
Débit audio : 192 Kbps
Profile : main (moins compatible que baseline)
```

## 📋 Checklist de Configuration OBS

- [ ] Résolution : 854x480 ou 1280x720
- [ ] FPS : 30
- [ ] Encodeur : x264 (logiciel)
- [ ] Profile : **baseline** (critique pour Android)
- [ ] Débit vidéo : 1500-2500 Kbps
- [ ] Keyframe Interval : 2
- [ ] Serveur RTMP : `rtmp://192.168.100.6:1935/live`
- [ ] Clé : `mykog_live`

## 🔧 Test de Compatibilité

Après avoir configuré OBS :

1. **Démarrer le stream dans OBS**
2. **Attendre 15-20 secondes**
3. **Vérifier les fichiers HLS** :
   ```bash
   ls -la /var/www/html/hls/mykog_live/
   ```
4. **Tester l'URL HLS** :
   ```bash
   curl http://192.168.100.6:8080/hls/mykog_live/index.m3u8
   ```
5. **Tester dans l'app Flutter**

## ⚠️ Si le Problème Persiste

### Option A : Réduire encore plus la résolution
- Essayer 640x360
- Débit : 1000 Kbps
- Profile : baseline

### Option B : Vérifier les capacités du téléphone
Le téléphone peut avoir des limitations matérielles. Vérifier :
- Android version (doit être >= 5.0 pour HLS)
- RAM disponible
- Processeur MediaTek peut avoir des limitations

### Option C : Utiliser un autre format (si possible)
- Essayer H.265/HEVC (si supporté)
- Mais HLS standard utilise H.264

## 📝 Notes Importantes

1. **Profile baseline** est essentiel pour la compatibilité Android
2. Les encodeurs matériels (NVENC, QuickSync) peuvent produire des formats moins compatibles
3. Le débit binaire élevé peut causer des problèmes sur des connexions lentes
4. Attendre toujours 15-20 secondes après le démarrage du stream avant de tester

## 🎬 Ordre d'Exécution

1. **Configurer OBS** avec les paramètres ci-dessus
2. **Créer le live** dans le dashboard
3. **Démarrer le stream** dans OBS
4. **Attendre 15-20 secondes**
5. **Tester dans l'app Flutter**

