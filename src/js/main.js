// ===== MAIN INITIALIZATION =====
import { USE_JSON_FILE } from './config.js';
import { setSections } from './state.js';
import { loadArtworksFromJSON } from './data-loader.js';
import { navigateToGallery, restartExperience, switchDescription, restorePageFromHash } from './page-navigation.js';
import { initializeModal } from './modal.js';
import { setupSlideAnimations, handleKeyboardNavigation, setupGalleryAccessibility } from './animations.js';

// Initialize Page 1 (Landing page)
function initializePage1() {
    // Setup key card click listeners
    const keyItems = document.querySelectorAll('.key-item');
    
    keyItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.key;
            // Navigate directly to gallery
            navigateToGallery(category);
        });
        
        // Add hover listeners for description switching (desktop only)
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 968) {
                const category = item.dataset.key;
                switchDescription(category);
            }
        });
    });
    
    // Reset to exhibition description when mouse leaves the icons area (desktop only)
    const iconsContainer = document.querySelector('.floor-icons-vertical');
    if (iconsContainer) {
        iconsContainer.addEventListener('mouseleave', () => {
            if (window.innerWidth > 968) {
                switchDescription('exhibition');
            }
        });
    }
    
    // Initialize sections for keyboard navigation
    const sectionElements = Array.from(document.querySelectorAll('#page1 section'));
    setSections(sectionElements);
    
    // Setup intersection observer for slide animations
    setupSlideAnimations();
}

// Initialize Page 2 (Gallery page)
function initializePage2() {
    // Navigation buttons (desktop)
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', restartExperience);
    
    document.getElementById('home-nav-btn').addEventListener('click', () => navigateToGallery('home'));
    document.getElementById('control-nav-btn').addEventListener('click', () => navigateToGallery('control'));
    document.getElementById('shift-nav-btn').addEventListener('click', () => navigateToGallery('shift'));
    document.getElementById('return-nav-btn').addEventListener('click', () => navigateToGallery('return'));
    
    // Mobile navigation buttons
    const homeBtnMobile = document.getElementById('home-nav-btn-mobile');
    const controlBtnMobile = document.getElementById('control-nav-btn-mobile');
    const shiftBtnMobile = document.getElementById('shift-nav-btn-mobile');
    const returnBtnMobile = document.getElementById('return-nav-btn-mobile');
    const restartBtnMobile = document.getElementById('restart-btn-mobile');
    
    if (homeBtnMobile) homeBtnMobile.addEventListener('click', () => {
        navigateToGallery('home');
        toggleMobileMenu();
    });
    if (controlBtnMobile) controlBtnMobile.addEventListener('click', () => {
        navigateToGallery('control');
        toggleMobileMenu();
    });
    if (shiftBtnMobile) shiftBtnMobile.addEventListener('click', () => {
        navigateToGallery('shift');
        toggleMobileMenu();
    });
    if (returnBtnMobile) returnBtnMobile.addEventListener('click', () => {
        navigateToGallery('return');
        toggleMobileMenu();
    });
    if (restartBtnMobile) restartBtnMobile.addEventListener('click', () => {
        restartExperience();
        toggleMobileMenu();
    });
    
    // Hamburger menu toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    
    if (mobileMenu && hamburgerBtn) {
        mobileMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    }
}

// Initialize back to top button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Main initialization
async function initialize() {
    if (USE_JSON_FILE) {
        await loadArtworksFromJSON();
    }
    
    initializePage1();
    initializePage2();
    initializeModal();
    initializeBackToTop();
    
    // Set initial history state for landing page
    if (!window.location.hash) {
        history.replaceState({ page: 'home' }, '', window.location.pathname);
    }
    
    // Restore page state from URL hash (if present)
    restorePageFromHash();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        restorePageFromHash();
    });

    // Also handle manual hash changes (safety for hash-only navigation)
    window.addEventListener('hashchange', () => {
        restorePageFromHash();
    });
    
    // Setup keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Setup gallery accessibility
    document.addEventListener('DOMContentLoaded', setupGalleryAccessibility);
    
    // Console message
    console.log('%c Press Any Key To Continue ', 'background: #028b9b; color: #fefce5; font-size: 20px; font-family: "JetBrains Mono", monospace; padding: 10px; border-radius: 5px;');
    console.log('Fall 2025 NMA Capstone Exhibition');
    console.log('Website developed with ❤️');
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
