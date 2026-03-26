export function createLibraryScreen() {
  const container = document.createElement('div');
  container.className = 'screen-library';

  const placeholder = document.createElement('div');
  placeholder.className = 'screen-placeholder';
  
  const title = document.createElement('h1');
  title.className = 'headline-medium';
  title.textContent = 'Ma Bibliothèque';
  placeholder.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'body-medium';
  subtitle.style.color = 'var(--color-text-secondary)';
  subtitle.style.marginTop = 'var(--spacing-md)';
  subtitle.textContent = 'Vos enseignements favoris et téléchargements';
  placeholder.appendChild(subtitle);

  container.appendChild(placeholder);

  return container;
}
