// ===== GALLERY FUNCTIONALITY =====
import { artworks } from './state.js';
import { openModal } from './modal.js';

export function populateGallery(filterCategory = null) {
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '';
    
    // Filter artworks if category is provided
    let displayArtworks = artworks;
    if (filterCategory) {
        displayArtworks = artworks.filter(art => art.category === filterCategory);
    }
    
    // Create gallery items
    displayArtworks.forEach(artwork => {
        const item = createGalleryItem(artwork);
        galleryGrid.appendChild(item);
    });
}

export function createGalleryItem(artwork) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.id = artwork.id;
    
    // Create thumbnail image element
    const mediaElement = document.createElement('img');
    mediaElement.src = artwork.thumbnail || artwork.src;
    mediaElement.alt = artwork.title;
    mediaElement.loading = 'lazy';
    
    // Create overlay with artist and title
    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    overlay.innerHTML = `
        <div class="overlay-title">${artwork.title}</div>
        <div class="overlay-artist">${artwork.artist}</div>
    `;
    
    item.appendChild(mediaElement);
    item.appendChild(overlay);
    
    // Click handler to open modal
    item.addEventListener('click', () => openModal(artwork));
    
    return item;
}
