// ===== PAGE NAVIGATION =====
import { floorColors } from './config.js';
import { setCurrentPage, setCurrentFloor } from './state.js';
import { populateGallery } from './gallery.js';

export function navigateToGallery(category = null) {
    const page2 = document.getElementById('page2');
    
    // Hide page 1, show page 2
    document.getElementById('page1').classList.remove('active');
    page2.classList.add('active');
    
    // Update current floor
    setCurrentFloor(category);
    
    // Set floor data attribute for theming
    if (category) {
        page2.setAttribute('data-floor', category);
        // Update URL hash to preserve state on refresh
        window.location.hash = category;
        // Update favicon for the floor
        updateFavicon(category);
    } else {
        page2.removeAttribute('data-floor');
        window.location.hash = 'gallery';
        updateFavicon(null);
    }
    
    // Update nav bar colors
    updateNavBarColors(category);
    
    // Populate gallery
    populateGallery(category);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    setCurrentPage('page2');
}

export function updateNavBarColors(category) {
    const nav = document.querySelector('.gallery-nav');
    
    if (category && floorColors[category]) {
        nav.style.background = floorColors[category];
    } else {
        nav.style.background = 'var(--teal)';
    }
}

export function navigateToHome() {
    // Show page 1, hide page 2
    document.getElementById('page2').classList.remove('active');
    document.getElementById('page1').classList.add('active');
    
    // Clear URL hash
    window.location.hash = '';
    
    // Reset favicon to main
    updateFavicon(null);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    setCurrentPage('page1');
}

export function restartExperience() {
    console.log('🔄 Restarting experience...');
    navigateToHome();
}

// Restore page state from URL hash
export function restorePageFromHash() {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    
    if (hash && (hash === 'home' || hash === 'control' || hash === 'shift' || hash === 'return')) {
        // Navigate to the floor page
        navigateToGallery(hash);
    } else if (hash === 'gallery') {
        // Navigate to gallery without specific floor
        navigateToGallery(null);
    }
    // If no hash or invalid hash, stay on landing page (default)
}

// Update favicon based on floor
export function updateFavicon(floor) {
    const favicon = document.getElementById('favicon');
    if (!favicon) return;
    
    if (floor === 'home') {
        favicon.href = 'assets/home-icon.svg';
    } else if (floor === 'control') {
        favicon.href = 'assets/control-icon.svg';
    } else if (floor === 'shift') {
        favicon.href = 'assets/shift-icon.svg';
    } else if (floor === 'return') {
        favicon.href = 'assets/return-icon.svg';
    } else {
        // Default to main favicon
        favicon.href = 'assets/favicon-main.svg';
    }
}

// Description switching for floor icons
export function switchDescription(category) {
    // Hide all descriptions
    const allDescriptions = document.querySelectorAll('.description-content');
    allDescriptions.forEach(desc => desc.classList.remove('active'));
    
    // Show the selected description
    let targetId = 'exhibition-text';
    if (category === 'home' || category === 'control' || category === 'shift' || category === 'return') {
        targetId = `${category}-text`;
    }
    
    const targetDesc = document.getElementById(targetId);
    if (targetDesc) {
        targetDesc.classList.add('active');
    }
}
