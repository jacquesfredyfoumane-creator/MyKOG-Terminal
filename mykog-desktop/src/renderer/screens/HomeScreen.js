import ApiClient from '../api/client.js';

export async function createHomeScreen(api) {
  const container = document.createElement('div');
  container.className = 'screen-home';

  // Header
  const header = document.createElement('div');
  header.style.marginBottom = 'var(--spacing-xl)';
  
  const title = document.createElement('h1');
  title.className = 'headline-large';
  title.textContent = 'Bienvenue sur MyKOG';
  header.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'body-medium';
  subtitle.style.color = 'var(--color-text-secondary)';
  subtitle.style.marginTop = 'var(--spacing-sm)';
  subtitle.textContent = 'Découvrez nos enseignements et méditations';
  header.appendChild(subtitle);

  container.appendChild(header);

  // Section récents
  const recentSection = document.createElement('div');
  recentSection.style.marginBottom = 'var(--spacing-2xl)';

  const recentTitle = document.createElement('h2');
  recentTitle.className = 'headline-medium';
  recentTitle.style.marginBottom = 'var(--spacing-lg)';
  recentTitle.textContent = 'Enseignements récents';
  recentSection.appendChild(recentTitle);

  const recentGrid = document.createElement('div');
  recentGrid.className = 'grid grid-4';
  recentGrid.id = 'recent-grid';
  recentSection.appendChild(recentGrid);

  container.appendChild(recentSection);

  // Charger les enseignements
  try {
    const enseignements = await api.getEnseignements();
    
    if (enseignements.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'screen-placeholder';
      emptyState.innerHTML = `
        <p class="body-medium" style="color: var(--color-text-secondary);">
          Aucun enseignement disponible pour le moment
        </p>
      `;
      recentGrid.appendChild(emptyState);
    } else {
      // Afficher les 8 premiers enseignements
      enseignements.slice(0, 8).forEach(enseignement => {
        const card = createTeachingCard(enseignement);
        recentGrid.appendChild(card);
      });
    }
  } catch (error) {
    const errorState = document.createElement('div');
    errorState.className = 'screen-placeholder';
    errorState.innerHTML = `
      <p class="body-medium" style="color: var(--color-error);">
        Erreur de connexion au serveur. Vérifiez que le backend est démarré.
      </p>
    `;
    recentGrid.appendChild(errorState);
  }

  return container;
}

function createTeachingCard(enseignement) {
  const card = document.createElement('div');
  card.className = 'card';

  const image = document.createElement('div');
  image.className = 'card-image';
  if (enseignement.imageUrl) {
    const img = document.createElement('img');
    img.src =enseignement.imageUrl;
    img.className = 'card-image';
    image.appendChild(img);
  }
  card.appendChild(image);

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent =enseignement.titre || 'Enseignement';
  card.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.className = 'card-subtitle';
  subtitle.textContent =enseignement.auteur || 'MyKOG';
  card.appendChild(subtitle);

  card.addEventListener('click', () => {
    // TODO: Naviguer vers la page de détails
    console.log('Ouvrir enseignement:',enseignement.id);
  });

  return card;
}
