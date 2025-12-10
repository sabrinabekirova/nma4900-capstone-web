// ===== MODAL FUNCTIONALITY =====
import { floorModalColors } from './config.js';
import { currentFloor, artworks } from './state.js';

// Track current modal state
let currentArtworkIndex = -1;
let filteredArtworks = [];

export function initializeModal() {
    const modal = document.getElementById('artwork-modal');
    const closeBtn = document.getElementById('modal-close');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    
    // Close modal on X button
    closeBtn.addEventListener('click', closeModal);
    
    // Navigation buttons
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateToPrevious();
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateToNext();
    });
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                navigateToPrevious();
            } else if (e.key === 'ArrowRight') {
                navigateToNext();
            }
        }
    });
}

export function openModal(artwork) {
    // Get filtered artworks based on current floor
    if (currentFloor) {
        filteredArtworks = artworks.filter(art => art.category === currentFloor);
    } else {
        filteredArtworks = artworks;
    }
    
    // Find the index of the current artwork
    currentArtworkIndex = filteredArtworks.findIndex(art => art.id === artwork.id);
    
    // Display the artwork
    displayArtwork(artwork);
    
    // Update navigation buttons
    updateNavigationButtons();
    
    const modal = document.getElementById('artwork-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function displayArtwork(artwork) {
    const modalBody = document.getElementById('modal-body');
    const modalContent = document.querySelector('.modal-content');
    
    // Set modal color based on current floor
    if (currentFloor && floorModalColors[currentFloor]) {
        const color = floorModalColors[currentFloor];
        modalContent.style.setProperty('background-color', color, 'important');
    }
    
    // Create modal content
    let mediaHTML;
    
    // Check if artwork has multiple images (carousel)
    if (artwork.images && artwork.images.length > 0) {
        mediaHTML = `<div class="carousel-container">
            <div class="carousel-slide active">
                <img class="modal-media" src="${artwork.images[0]}" alt="${artwork.title} - Image 1">
            </div>`;
        
        for (let i = 1; i < artwork.images.length; i++) {
            mediaHTML += `<div class="carousel-slide">
                <img class="modal-media" src="${artwork.images[i]}" alt="${artwork.title} - Image ${i + 1}">
            </div>`;
        }
        
        mediaHTML += `
            <button class="carousel-prev" onclick="changeSlide(-1)">&#10094;</button>
            <button class="carousel-next" onclick="changeSlide(1)">&#10095;</button>
            <div class="carousel-dots">`;
        
        for (let i = 0; i < artwork.images.length; i++) {
            mediaHTML += `<span class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="currentSlide(${i + 1})"></span>`;
        }
        
        mediaHTML += `</div>
        </div>`;
    } else if (artwork.video_url) {
        // Check if it's a Vimeo URL
        if (artwork.video_url.includes('vimeo.com')) {
            const vimeoId = artwork.video_url.split('/').pop().split('?')[0];
            mediaHTML = `<div class="modal-media-container">
                <iframe class="modal-media modal-iframe" 
                    src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1" 
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>`;
        } else {
            // Generic iframe for other URLs (like p5.js)
            mediaHTML = `<div class="modal-media-container">
                <iframe class="modal-media modal-iframe" 
                    src="${artwork.video_url}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
            </div>`;
        }
    } else if (artwork.type === 'video') {
        mediaHTML = `<video class="modal-media" controls autoplay loop>
            <source src="${artwork.src}" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    } else {
        mediaHTML = `<img class="modal-media" src="${artwork.src}" alt="${artwork.title}">`;
    }
    
    // Determine if we show running_time or dimensions
    let technicalInfo = '';
    if (artwork.medium) {
        technicalInfo += `${artwork.medium}`;
        
        if (artwork.running_time) {
            technicalInfo += ` | ${artwork.running_time}`;
        } else if (artwork.dimensions) {
            technicalInfo += ` | ${artwork.dimensions}`;
        }
    }
    
    let pdfHTML = '';
    if (artwork.pdf_url) {
        pdfHTML = `
        <div class="modal-pdf-section">
            <h3>Accompanying Zine</h3>
            <div class="modal-pdf-container">
                <object class="modal-pdf" 
                    data="${artwork.pdf_url}" 
                    type="application/pdf">
                    <p style="color: white; text-align: center; padding: 20px;">PDF cannot be displayed in browser. Please use the link below to download and view.</p>
                </object>
            </div>
            <a href="${artwork.pdf_url}" download target="_blank" class="pdf-download-link">Download PDF</a>
        </div>`;
    }
    
    modalBody.innerHTML = `
        ${mediaHTML}
        ${pdfHTML}
        <h2 class="modal-title">${artwork.title}</h2>
        <p class="modal-artist">by ${artwork.artist}</p>
        ${technicalInfo ? `<p class="modal-technical">${technicalInfo}</p>` : ''}
        
        <div class="modal-description">
            <h3>About the Work</h3>
            <p>${artwork.description}</p>
        </div>
        
        <div class="modal-description">
            <h3>About the Artist</h3>
            <p>${artwork.artistBio}</p>
        </div>
    `;
    
    // Scroll modal body to top
    modalBody.scrollTop = 0;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    
    // Disable/enable buttons based on position
    prevBtn.disabled = currentArtworkIndex <= 0;
    nextBtn.disabled = currentArtworkIndex >= filteredArtworks.length - 1;
}

function navigateToPrevious() {
    if (currentArtworkIndex > 0) {
        currentArtworkIndex--;
        const artwork = filteredArtworks[currentArtworkIndex];
        displayArtwork(artwork);
        updateNavigationButtons();
    }
}

function navigateToNext() {
    if (currentArtworkIndex < filteredArtworks.length - 1) {
        currentArtworkIndex++;
        const artwork = filteredArtworks[currentArtworkIndex];
        displayArtwork(artwork);
        updateNavigationButtons();
    }
}

export function closeModal() {
    const modal = document.getElementById('artwork-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Stop any playing videos
    const video = modal.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    
    // Stop all iframes (Vimeo, p5.js, etc.) by removing and re-adding them
    const iframes = modal.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.src = '';
    });
}

// ===== CAROUSEL FUNCTIONALITY =====
let currentSlideIndex = 1;

window.changeSlide = function(n) {
    showSlides(currentSlideIndex += n);
}

window.currentSlide = function(n) {
    showSlides(currentSlideIndex = n);
}

function showSlides(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (slides.length === 0) return;
    
    if (n > slides.length) { currentSlideIndex = 1; }
    if (n < 1) { currentSlideIndex = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlideIndex - 1].classList.add('active');
    dots[currentSlideIndex - 1].classList.add('active');
}
