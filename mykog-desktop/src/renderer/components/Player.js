/**
 * Composant Player - Barre de lecture audio
 */
export class Player {
  constructor() {
    this.audio = null;
    this.currentTrack = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // Bouton play/pause
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    // Boutons précédent/suivant
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this.previous());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Barre de progression
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.addEventListener('click', (e) => this.seek(e));
    }
  }

  play(track) {
    if (!track) return;

    this.currentTrack = track;
    
    // Créer un nouvel élément audio si nécessaire
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(track.audioUrl);
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.updateProgress();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.play();
    this.isPlaying = true;
    this.updateUI();
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.updateUI();
    }
  }

  resume() {
    if (this.audio) {
      this.audio.play();
      this.isPlaying = true;
      this.updateUI();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.currentTrack) {
        this.resume();
      }
    }
  }

  previous() {
    // TODO: Implémenter la logique de playlist
    console.log('Previous track');
  }

  next() {
    // TODO: Implémenter la logique de playlist
    console.log('Next track');
  }

  seek(event) {
    if (!this.audio || !this.duration) return;

    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * this.duration;

    this.audio.currentTime = newTime;
    this.currentTime = newTime;
    this.updateProgress();
  }

  updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeEl = document.querySelectorAll('.player-time')[0];
    const durationEl = document.querySelectorAll('.player-time')[1];

    if (progressFill && this.duration > 0) {
      const percentage = (this.currentTime / this.duration) * 100;
      progressFill.style.width = `${percentage}%`;
    }

    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.currentTime);
    }

    if (durationEl) {
      durationEl.textContent = this.formatTime(this.duration);
    }
  }

  updateUI() {
    const playBtn = document.getElementById('btn-play');
    const titleEl = document.querySelector('.player-title');
    const artistEl = document.querySelector('.player-artist');
    const artworkEl = document.querySelector('.player-artwork');

    if (playBtn) {
      playBtn.textContent = this.isPlaying ? '⏸' : '▶';
    }

    if (this.currentTrack) {
      if (titleEl) titleEl.textContent = this.currentTrack.titre || 'Titre inconnu';
      if (artistEl) artistEl.textContent = this.currentTrack.auteur || 'Auteur inconnu';
      if (artworkEl && this.currentTrack.imageUrl) {
        artworkEl.style.backgroundImage = `url(${this.currentTrack.imageUrl})`;
      }
    } else {
      if (titleEl) titleEl.textContent = 'Aucune lecture';
      if (artistEl) artistEl.textContent = 'MyKOG';
      if (artworkEl) artworkEl.style.backgroundImage = 'none';
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Instance globale du player
export const player = new Player();

