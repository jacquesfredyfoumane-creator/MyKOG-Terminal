import ApiClient from './api/client.js';
import { createHomeScreen } from './screens/HomeScreen.js';
import { createBrowseScreen } from './screens/BrowseScreen.js';
import { createLibraryScreen } from './screens/LibraryScreen.js';
import { createLiveScreen } from './screens/LiveScreen.js';

class MyKOGApp {
  constructor() {
    this.api = ApiClient;
    this.currentScreen = 'home';
    this.init();
  }

  init() {
    this.setupWindowControls();
    this.setupNavigation();
    this.setupPlayer();
    this.loadScreen('home');
  }

  setupWindowControls() {
    document.getElementById('btn-minimize').addEventListener('click', () => {
      window.electronAPI.minimizeWindow();
    });

    document.getElementById('btn-maximize').addEventListener('click', () => {
      window.electronAPI.maximizeWindow();
    });

    document.getElementById('btn-close').addEventListener('click', () => {
      window.electronAPI.closeWindow();
    });
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const screen = item.dataset.screen;
        this.loadScreen(screen);
        
        // Mettre à jour l'état actif
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  setupPlayer() {
    const playBtn = document.getElementById('btn-play');
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '⏸' : '▶';
    });

    // TODO: Implémenter les autres contrôles du player
  }

  async loadScreen(screenName) {
    const container = document.getElementById('screen-container');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
      let screen;
      switch(screenName) {
        case 'home':
          screen = await createHomeScreen(this.api);
          break;
        case 'browse':
          screen = await createBrowseScreen(this.api);
          break;
        case 'library':
          screen = createLibraryScreen();
          break;
        case 'live':
          screen = await createLiveScreen(this.api);
          break;
        default:
          screen = await createHomeScreen(this.api);
      }

      container.innerHTML = '';
      container.appendChild(screen);
      this.currentScreen = screenName;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'écran:', error);
      container.innerHTML = `
        <div class="screen-placeholder">
          <p class="body-medium" style="color: var(--color-error);">
            Erreur lors du chargement de l'écran
          </p>
        </div>
      `;
    }
  }
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MyKOGApp();
  });
} else {
  new MyKOGApp();
}
