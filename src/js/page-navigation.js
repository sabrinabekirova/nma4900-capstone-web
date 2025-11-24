// ===== PAGE NAVIGATION =====
import { floorColors } from './config.js';
import { setCurrentPage, setCurrentFloor } from './state.js';
import { populateGallery } from './gallery.js';

// Internal navigation (no history push)
function navigateToGalleryInternal(category = null) {
    const page2 = document.getElementById('page2');
    
    // Hide page 1, show page 2
    document.getElementById('page1').classList.remove('active');
    page2.classList.add('active');
    
    // Update current floor
    setCurrentFloor(category);
    
    // Set floor data attribute for theming
    if (category) {
        page2.setAttribute('data-floor', category);
        // Update favicon for the floor
        updateFavicon(category);
        
        // Show welcome modal on mobile/tablet
        if (window.innerWidth <= 968) {
            showWelcomeModal(category);
        }
    } else {
        page2.removeAttribute('data-floor');
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

export function navigateToGallery(category = null) {
    // First update UI
    navigateToGalleryInternal(category);
    // Then push history entry
    if (category) {
        history.pushState({ page: 'gallery', floor: category }, '', `#${category}`);
    } else {
        history.pushState({ page: 'gallery', floor: null }, '', '#gallery');
    }
}

export function updateNavBarColors(category) {
    const nav = document.querySelector('.gallery-nav');
    
    if (category && floorColors[category]) {
        nav.style.background = floorColors[category];
    } else {
        nav.style.background = 'var(--teal)';
    }
}

// Internal navigation (no history push)
function navigateToHomeInternal() {
    // Show page 1, hide page 2
    document.getElementById('page2').classList.remove('active');
    document.getElementById('page1').classList.add('active');
    
    // Reset favicon to main
    updateFavicon(null);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    setCurrentPage('page1');
}

export function navigateToHome() {
    // First update UI
    navigateToHomeInternal();
    // Then push history entry (clear hash)
    history.pushState({ page: 'home' }, '', window.location.pathname);
}

export function restartExperience() {
    console.log('🔄 Restarting experience...');
    navigateToHome();
}

// Restore page state from URL hash
export function restorePageFromHash() {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    
    if (hash && (hash === 'home' || hash === 'control' || hash === 'shift' || hash === 'return')) {
        // Navigate to the floor page without pushing to history
        navigateToGalleryInternal(hash);
    } else if (hash === 'gallery') {
        // Navigate to gallery without specific floor (no history push)
        navigateToGalleryInternal(null);
    } else {
        // No hash or invalid hash: go to landing (no history push)
        navigateToHomeInternal();
    }
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

// Show welcome modal for mobile/tablet
export function showWelcomeModal(category) {
    const floorInfo = {
        home: { floor: 2, name: 'Home', description: 'The first floor of this exhibition, Home, explores culture and family through personal stories about language and traditions. Home portrays the tension between a sense of belonging and feeling distant from one\'s cultural roots, even when trying to reconnect. The six artists featured on this floor are Anne Chen, Elvia Gonzalez, Keeanna Gray, Citlali Hernandez, Jiaqi Liu, and Evelyn Vasquez. Their works collectively illustrate what Home means to each of them—a place of comfort and nostalgia where memories and identity come together, revealing who they are proud to become.' },
        control: { floor: 3, name: 'Control', description: 'The next floor is inspired by the Control key, symbolizing the invisible systems that shape our lives. This section of the exhibition addresses economic and social conflict. The works focus on rules and authorities that subtly influence us, keeping us in cycles of debt, pressure, and exploitation. The six artists featured in Control are Steven Cen, Yanyun Chen, Justine Cheng, Amit Dhar, Bryan Lai, and Liana Zou. They expose hidden systems of control through their works.' },
        shift: { floor: 4, name: 'Shift', description: 'The fourth floor of this exhibit is titled Shift as it conveys five artists\' growth and shifting perspectives. Most of the featured works demonstrate dealing with life\'s challenges and adjusting how people react when confronted with difficult circumstances. Abeha Choudhry, Andri Xu Wu, and Johnny Xu Wu\'s artworks illustrate how individuals respond to the world around them and find comfort amidst the challenges they face.' },
        return: { floor: 5, name: 'Return', description: 'Inspired by the Return key, the fifth floor of the exhibition captures journeys of self reflection and love. Each artist highlights personal moments that make up who they are. The five artists featured in Return are Sabrina Bekirova, Rashel Carrillo, Lulu O\'Rourke-Chisholm, Syeda Saima, and Karina Sarmiento. This collection of video works show a glimpse inside each artist\'s life showing memories and moments in time.' }
    };
    
    const info = floorInfo[category];
    if (!info) return;
    
    const modal = document.getElementById('welcome-modal');
    const welcomeBody = document.getElementById('welcome-body');
    const welcomeContent = modal.querySelector('.welcome-content');
    
    // Remove any existing floor classes
    welcomeContent.classList.remove('floor-home', 'floor-control', 'floor-shift', 'floor-return');
    
    // Add the current floor class
    welcomeContent.classList.add(`floor-${category}`);
    
    welcomeBody.innerHTML = `
        <h2 class="welcome-title">Welcome to Floor ${info.floor}</h2>
        <h3 class="welcome-floor">${info.name}</h3>
        <p class="welcome-description">${info.description}</p>
    `;
    
    modal.classList.add('active');
    
    // Close button handler
    const closeBtn = document.getElementById('welcome-close');
    closeBtn.onclick = () => {
        modal.classList.remove('active');
    };
    
    // Click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
}
