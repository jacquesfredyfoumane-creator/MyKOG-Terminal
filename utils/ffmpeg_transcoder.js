const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Service de transcodage FFmpeg pour compatibilité universelle
 * Convertit automatiquement le stream RTMP en HLS avec les paramètres optimaux
 */
class FFmpegTranscoder {
  constructor(streamKey = 'mykog_live') {
    this.streamKey = streamKey;
    this.rtmpUrl = `rtmp://localhost:1935/live/${streamKey}`;
    this.hlsPath = `/var/www/html/hls/${streamKey}`;
    this.process = null;
    this.isRunning = false;
  }

  /**
   * Démarrer le transcodage
   */
  start() {
    if (this.isRunning) {
      console.log(`⚠️ Transcoder déjà en cours pour ${this.streamKey}`);
      return;
    }

    // Créer le dossier HLS si nécessaire avec les bonnes permissions
    // Utiliser sudo pour créer le dossier avec les bonnes permissions dès le départ
    try {
      const { execSync } = require('child_process');
      
      // Créer le dossier parent si nécessaire
      const parentDir = '/var/www/html/hls';
      if (!fs.existsSync(parentDir)) {
        execSync(`sudo mkdir -p ${parentDir}`, { stdio: 'ignore' });
        execSync(`sudo chown -R www-data:www-data ${parentDir}`, { stdio: 'ignore' });
        execSync(`sudo chmod -R 755 ${parentDir}`, { stdio: 'ignore' });
      }
      
      // Créer le dossier du stream avec sudo
      if (!fs.existsSync(this.hlsPath)) {
        execSync(`sudo mkdir -p ${this.hlsPath}`, { stdio: 'ignore' });
        execSync(`sudo chown -R www-data:www-data ${this.hlsPath}`, { stdio: 'ignore' });
        execSync(`sudo chmod -R 755 ${this.hlsPath}`, { stdio: 'ignore' });
        console.log(`✅ Dossier HLS créé avec les bonnes permissions: ${this.hlsPath}`);
      } else {
        // S'assurer que les permissions sont correctes même si le dossier existe
        execSync(`sudo chown -R www-data:www-data ${this.hlsPath}`, { stdio: 'ignore' });
        execSync(`sudo chmod -R 755 ${this.hlsPath}`, { stdio: 'ignore' });
      }
    } catch (error) {
      console.error(`❌ Erreur création dossier HLS: ${error.message}`);
      console.error(`   → Le transcodage peut échouer sans les bonnes permissions`);
      // Essayer quand même de créer le dossier sans sudo (peut échouer)
      try {
        if (!fs.existsSync(this.hlsPath)) {
          fs.mkdirSync(this.hlsPath, { recursive: true });
        }
      } catch (err) {
        console.error(`❌ Impossible de créer le dossier: ${err.message}`);
        throw new Error(`Impossible de créer le dossier HLS: ${err.message}`);
      }
    }

    console.log(`🎬 Démarrage du transcodage FFmpeg pour: ${this.streamKey}`);
    console.log(`📡 Source RTMP: ${this.rtmpUrl}`);
    console.log(`📺 Destination HLS: ${this.hlsPath}`);

    // Paramètres FFmpeg pour compatibilité MAXIMALE (MediaTek et appareils bas de gamme)
    // Résolution ULTRA-BASSE (360x202) pour forcer la compatibilité MediaTek
    // Cette résolution est la plus basse possible tout en gardant un aspect ratio 16:9
    const ffmpegArgs = [
      '-i', this.rtmpUrl,
      // Vidéo - Paramètres ULTRA-compatibles pour MediaTek
      '-c:v', 'libx264',
      '-preset', 'ultrafast',          // Encodage le plus rapide possible
      '-profile:v', 'baseline',        // CRITIQUE pour compatibilité Android
      '-level', '3.0',                 // Level 3.0 (maximum compatible pour MediaTek)
      '-pix_fmt', 'yuv420p',           // Format pixel compatible (obligatoire)
      '-vf', 'scale=360:202:force_original_aspect_ratio=decrease,pad=360:202:(ow-iw)/2:(oh-ih)/2', // FORCER redimensionnement à 360x202
      '-r', '20',                      // FPS réduit à 20 (très compatible)
      '-g', '40',                      // GOP size (2 secondes à 20fps)
      '-keyint_min', '40',
      '-force_key_frames', 'expr:gte(n,n_forced*40)', // Forcer keyframes toutes les 40 frames
      '-sc_threshold', '0',            // Pas de détection de scène
      '-b:v', '400k',                  // Débit très réduit pour MediaTek
      '-maxrate', '400k',
      '-bufsize', '800k',
      '-bf', '0',                      // Pas de B-frames (CRITIQUE)
      '-refs', '1',                    // Une seule référence (CRITIQUE)
      '-tune', 'zerolatency',          // Latence zéro
      '-x264opts', 'no-mbtree:no-cabac:no-8x8dct:weightp=0:no-deblock', // Désactiver TOUTES les fonctionnalités avancées
      '-movflags', '+faststart',       // Optimisation pour streaming
      // Audio - Paramètres simplifiés pour MediaTek
      '-c:a', 'aac',
      '-b:a', '48k',                   // Débit audio minimal
      '-ar', '44100',                  // Sample rate standard (plus compatible)
      '-ac', '1',                      // Mono (plus compatible que stéréo)
      '-aac_coder', 'fast',            // Encodeur AAC rapide
      // HLS
      '-f', 'hls',
      '-hls_time', '2',                // Durée des segments
      '-hls_list_size', '5',           // Nombre de segments dans la playlist
      '-hls_flags', 'delete_segments+independent_segments', // Supprimer les anciens segments + segments indépendants
      '-hls_segment_type', 'mpegts',    // Type de segment explicite
      '-hls_segment_filename', `${this.hlsPath}/segment_%03d.ts`,
      `${this.hlsPath}/index.m3u8`
    ];

    // Démarrer FFmpeg avec sudo -u www-data pour créer les fichiers avec les bonnes permissions
    // Cela garantit que les fichiers sont créés avec le propriétaire www-data
    this.process = spawn('sudo', ['-u', 'www-data', 'ffmpeg', ...ffmpegArgs], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    this.isRunning = true;

    // Logger les sorties
    this.process.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('error') || output.includes('Error')) {
        console.error(`❌ FFmpeg stdout: ${output}`);
      }
    });

    this.process.stderr.on('data', (data) => {
      const output = data.toString();
      // FFmpeg écrit sur stderr par défaut, filtrer les messages d'info
      if (output.includes('error') || output.includes('Error') || output.includes('Failed')) {
        console.error(`❌ FFmpeg stderr: ${output}`);
      } else if (output.includes('frame=')) {
        // Afficher la progression toutes les 100 frames
        const frameMatch = output.match(/frame=\s*(\d+)/);
        if (frameMatch && parseInt(frameMatch[1]) % 100 === 0) {
          console.log(`📹 FFmpeg transcoding: ${frameMatch[1]} frames`);
        }
        
        // Corriger les permissions périodiquement (toutes les 50 frames) pour s'assurer qu'elles restent correctes
        if (frameMatch && parseInt(frameMatch[1]) % 50 === 0) {
          try {
            const { execSync } = require('child_process');
            execSync(`sudo chown -R www-data:www-data ${this.hlsPath} 2>/dev/null`, { stdio: 'ignore' });
            execSync(`sudo chmod -R 755 ${this.hlsPath} 2>/dev/null`, { stdio: 'ignore' });
          } catch (error) {
            // Ignorer les erreurs silencieusement
          }
        }
      }
    });

    this.process.on('close', (code) => {
      this.isRunning = false;
      if (code !== 0 && code !== null) {
        console.error(`❌ FFmpeg s'est arrêté avec le code: ${code}`);
      } else {
        console.log(`✅ FFmpeg transcodage terminé pour ${this.streamKey}`);
      }
    });

    this.process.on('error', (error) => {
      console.error(`❌ Erreur FFmpeg: ${error.message}`);
      this.isRunning = false;
    });

    console.log(`✅ Transcoder démarré pour ${this.streamKey}`);
  }

  /**
   * Arrêter le transcodage
   */
  stop() {
    if (this.process && this.isRunning) {
      console.log(`🛑 Arrêt du transcodage pour ${this.streamKey}`);
      this.process.kill('SIGTERM');
      this.isRunning = false;
      
      // Attendre un peu puis forcer l'arrêt si nécessaire
      setTimeout(() => {
        if (this.process && !this.process.killed) {
          this.process.kill('SIGKILL');
        }
      }, 5000);
    }
  }

  /**
   * Vérifier si le transcodage est en cours
   */
  isActive() {
    return this.isRunning && this.process && !this.process.killed;
  }
}

module.exports = FFmpegTranscoder;

