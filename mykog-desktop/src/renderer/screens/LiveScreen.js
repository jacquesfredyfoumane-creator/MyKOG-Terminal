import ApiClient from '../api/client.js';

export async function createLiveScreen(api) {
  const container = document.createElement('div');
  container.className = 'screen-live';

  // Header
  const header = document.createElement('div');
  header.style.marginBottom = 'var(--spacing-xl)';
  
  const title = document.createElement('h1');
  title.className = 'headline-large';
  title.textContent = 'Streaming Live';
  header.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'body-medium';
  subtitle.style.color = 'var(--color-text-secondary)';
  subtitle.style.marginTop = 'var(--spacing-sm)';
  subtitle.textContent = 'Regardez nos streams en direct';
  header.appendChild(subtitle);

  container.appendChild(header);

  // Player vidéo
  const videoContainer = document.createElement('div');
  videoContainer.style.marginBottom = 'var(--spacing-xl)';
  videoContainer.style.borderRadius = 'var(--radius-lg)';
  videoContainer.style.overflow = 'hidden';
  videoContainer.style.background = 'var(--color-secondary)';
  videoContainer.style.aspectRatio = '16 / 9';

  const video = document.createElement('video');
  video.id = 'live-video';
  video.style.width = '100%';
  video.style.height = '100%';
  video.controls = true;
  video.autoplay = true;
  video.muted = false;

  // Charger le stream HLS
  try {
    const streamURL = api.getStreamURL('mykog_live');
    video.src = streamURL;
    
    // Utiliser HLS.js si disponible (pour meilleure compatibilité)
    if (typeof Hls !== 'undefined') {
      const hls = new Hls();
      hls.loadSource(streamURL);
      hls.attachMedia(video);
    } else {
      // Fallback pour navigateurs supportant HLS nativement
      video.src = streamURL;
    }
  } catch (error) {
    console.error('Erreur lors du chargement du stream:', error);
    const errorMsg = document.createElement('div');
    errorMsg.className = 'screen-placeholder';
    errorMsg.style.height = '400px';
    errorMsg.innerHTML = `
      <p class="body-medium" style="color: var(--color-error);">
        Aucun stream en cours. Le stream sera disponible ici lorsqu'il sera démarré.
      </p>
    `;
    videoContainer.appendChild(errorMsg);
  }

  videoContainer.appendChild(video);
  container.appendChild(videoContainer);

  // Informations du stream
  const infoContainer = document.createElement('div');
  infoContainer.style.background = 'var(--color-secondary)';
  infoContainer.style.padding = 'var(--spacing-lg)';
  infoContainer.style.borderRadius = 'var(--radius-lg)';

  const infoTitle = document.createElement('h2');
  infoTitle.className = 'title-large';
  infoTitle.textContent = 'Informations du stream';
  infoContainer.appendChild(infoTitle);

  const infoText = document.createElement('p');
  infoText.className = 'body-medium';
  infoText.style.color = 'var(--color-text-secondary)';
  infoText.style.marginTop = 'var(--spacing-sm)';
  infoText.textContent = 'URL RTMP pour OBS: ' + api.getRTMPURL();
  infoContainer.appendChild(infoText);

  container.appendChild(infoContainer);

  return container;
}
