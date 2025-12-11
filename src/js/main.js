// ===== MAIN INITIALIZATION =====
import { USE_JSON_FILE } from './config.js';
import { setSections, setCurrentFloor, setCurrentPage } from './state.js';
import { loadArtworksFromJSON } from './data-loader.js';
import { navigateToGallery, restartExperience, switchDescription, getCurrentFloor, updateNavBarColors, showWelcomeModal } from './page-navigation.js';
import { initializeModal } from './modal.js';
import { setupSlideAnimations, handleKeyboardNavigation, setupGalleryAccessibility } from './animations.js';
import { populateGallery } from './gallery.js';

// Initialize Page 1 (Landing page)
function initializePage1() {
    
    // Setup key card click listeners
    const keyItems = document.querySelectorAll('.key-item');
    console.log('Found', keyItems.length, 'key items');
    
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
    // Get current floor
    const currentFloor = getCurrentFloor();
    if (currentFloor) {
        setCurrentFloor(currentFloor);
        
        // Update nav bar colors
        updateNavBarColors(currentFloor);
        
        // Populate gallery with floor-specific artworks
        populateGallery(currentFloor);
        
        // Show welcome modal on mobile/tablet
        if (window.innerWidth <= 968) {
            showWelcomeModal(currentFloor);
        }
    }
    
    // Navigation buttons (desktop)
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', restartExperience);
    
    const homeBtn = document.getElementById('home-nav-btn');
    const controlBtn = document.getElementById('control-nav-btn');
    const shiftBtn = document.getElementById('shift-nav-btn');
    const returnBtn = document.getElementById('return-nav-btn');
    
    if (homeBtn) homeBtn.addEventListener('click', () => navigateToGallery('home'));
    if (controlBtn) controlBtn.addEventListener('click', () => navigateToGallery('control'));
    if (shiftBtn) shiftBtn.addEventListener('click', () => navigateToGallery('shift'));
    if (returnBtn) returnBtn.addEventListener('click', () => navigateToGallery('return'));
    
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
    
    // Detect which page we're on
    const isLandingPage = document.getElementById('page1') !== null;
    const isGalleryPage = document.getElementById('page2') !== null;
    
    console.log('🔍 Page detection:', { isLandingPage, isGalleryPage });
    
    if (isLandingPage) {
        console.log('✅ Landing page detected');
        setCurrentPage('page1');
        initializePage1();
    }
    
    if (isGalleryPage && !isLandingPage) {
        // We're on a standalone gallery page (home.html, control.html, etc.)
        setCurrentPage('page2');
        initializePage2();
        initializeModal();
    } else if (isGalleryPage && isLandingPage) {
        // Both pages exist (legacy single-page setup) - initialize both
        initializePage2();
        initializeModal();
    }
    
    initializeBackToTop();
    
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
