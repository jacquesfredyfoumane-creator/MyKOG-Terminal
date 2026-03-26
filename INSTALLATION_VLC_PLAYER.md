# 📦 Installation flutter_vlc_player

## ✅ Code Modifié

Le code a été modifié pour utiliser `flutter_vlc_player` au lieu de `video_player` pour une meilleure compatibilité avec MediaTek.

## 📋 Étapes d'Installation

### 1. Installer les dépendances

```bash
cd frontend_flutter
flutter pub get
```

### 2. Configuration Android

`flutter_vlc_player` nécessite des configurations supplémentaires pour Android.

#### Ajouter dans `android/app/build.gradle` :

```gradle
android {
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
        // ...
    }
}
```

#### Ajouter dans `android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
```

### 3. Rebuild l'application

```bash
flutter clean
flutter pub get
flutter run
```

## 🎯 Avantages de VLC Player

1. ✅ **Contourne le codec matériel MediaTek** - Utilise son propre décodeur logiciel
2. ✅ **Compatible avec tous les formats** - HLS, DASH, RTMP, etc.
3. ✅ **Meilleure compatibilité** - Fonctionne sur les appareils bas de gamme
4. ✅ **Décodage logiciel** - Ne dépend pas du codec matériel

## ⚠️ Note

Si vous avez des erreurs de compilation, assurez-vous que :
1. `flutter_vlc_player: ^8.0.0` est bien dans `pubspec.yaml`
2. Vous avez exécuté `flutter pub get`
3. Vous avez fait `flutter clean` puis `flutter run`

## 🔍 Vérification

Après installation, le player VLC devrait :
- Se charger automatiquement pour les streams HLS
- Fonctionner sur les téléphones MediaTek
- Avoir un fallback vers `video_player` si VLC échoue

