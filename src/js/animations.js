// ===== ANIMATIONS & SCROLL FUNCTIONALITY =====
import { sections, currentSectionIndex, setCurrentSectionIndex, currentPage } from './state.js';

// Setup slide animations for page 1 sections
export function setupSlideAnimations() {
    // Skip the logo section (first section)
    const animatedSections = Array.from(document.querySelectorAll('#page1 section')).slice(1);
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-visible');
            }
        });
    }, observerOptions);
    
    animatedSections.forEach(section => {
        section.classList.add('slide-in');
        observer.observe(section);
    });
}

// Scroll to specific section
export function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        setCurrentSectionIndex(index);
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Keyboard navigation handler
export function handleKeyboardNavigation(e) {
    // Check if modal is active
    const modalActive = document.getElementById('artwork-modal').classList.contains('active');
    
    if (modalActive) {
        // Only allow ESC to close modal (handled elsewhere)
        return;
    }
    
    if (currentPage === 'page1') {
        // Any key press scrolls to next section on page 1
        // Ignore modifier keys
        if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'Meta') {
            return;
        }
        
        // Prevent default for arrow keys and space
        if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Scroll to next section on any key press (except arrow up)
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            scrollToSection(currentSectionIndex - 1);
        } else {
            scrollToSection(currentSectionIndex + 1);
        }
    } else if (currentPage === 'page2') {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const focusedElement = document.activeElement;
        const currentIndex = Array.from(galleryItems).indexOf(focusedElement);
        
        if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) {
            galleryItems[currentIndex + 1].focus();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            galleryItems[currentIndex - 1].focus();
        } else if (e.key === 'Enter' && focusedElement.classList.contains('gallery-item')) {
            focusedElement.click();
        }
    }
}

// Setup gallery item focus capability
export function setupGalleryAccessibility() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.setAttribute('tabindex', '0');
    });
}

