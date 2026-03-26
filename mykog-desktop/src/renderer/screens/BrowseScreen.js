import ApiClient from '../api/client.js';

export async function createBrowseScreen(api) {
  const container = document.createElement('div');
  container.className = 'screen-browse';

  // Header avec recherche
  const header = document.createElement('div');
  header.style.marginBottom = 'var(--spacing-xl)';
  
  const title = document.createElement('h1');
  title.className = 'headline-large';
  title.textContent = 'Parcourir';
  header.appendChild(title);

  const searchContainer = document.createElement('div');
  searchContainer.style.marginTop = 'var(--spacing-lg)';
  searchContainer.style.position = 'relative';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Rechercher des enseignements...';
  searchInput.style.width = '100%';
  searchInput.style.padding = 'var(--spacing-md) var(--spacing-lg)';
  searchInput.style.background = 'var(--color-secondary)';
  searchInput.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  searchInput.style.borderRadius = 'var(--radius-full)';
  searchInput.style.color = 'var(--color-text-primary)';
  searchInput.style.fontFamily = 'Inter, sans-serif';
  searchInput.style.fontSize = '14px';
  searchInput.style.outline = 'none';
  searchInput.addEventListener('focus', () => {
    searchInput.style.borderColor = 'var(--color-accent)';
  });
  searchInput.addEventListener('blur', () => {
    searchInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  });

  searchContainer.appendChild(searchInput);
  header.appendChild(searchContainer);
  container.appendChild(header);

  // Grille des enseignements
  const grid = document.createElement('div');
  grid.className = 'grid grid-4';
  grid.id = 'browse-grid';
  container.appendChild(grid);

  // Charger tous les enseignements
  try {
    const enseignements = await api.getEnseignements();
    
    if (enseignements.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'screen-placeholder';
      emptyState.style.gridColumn = '1 / -1';
      emptyState.innerHTML = `
        <p class="body-medium" style="color: var(--color-text-secondary);">
          Aucun enseignement disponible
        </p>
      `;
      grid.appendChild(emptyState);
    } else {
      enseignements.forEach(enseignement => {
        const card = createTeachingCard(enseignement);
        grid.appendChild(card);
      });
    }

    // Recherche en temps réel
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = grid.querySelectorAll('.card');
      
      cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const subtitle = card.querySelector('.card-subtitle').textContent.toLowerCase();
        
        if (title.includes(query) || subtitle.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  } catch (error) {
    const errorState = document.createElement('div');
    errorState.className = 'screen-placeholder';
    errorState.style.gridColumn = '1 / -1';
    errorState.innerHTML = `
      <p class="body-medium" style="color: var(--color-error);">
        Erreur de connexion au serveur
      </p>
    `;
    grid.appendChild(errorState);
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
    console.log('Ouvrir enseignement:',enseignement.id);
  });

  return card;
}
