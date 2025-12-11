//STATE MANAGEMENT

// Gallery data
export let artworks = [];

// Page state
export let currentPage = 'page1';
export let currentSectionIndex = 0;
export let sections = [];
export let currentFloor = null;

// State setters
export function setArtworks(newArtworks) {
    artworks = newArtworks;
}

export function setCurrentPage(page) {
    currentPage = page;
}

export function setCurrentSectionIndex(index) {
    currentSectionIndex = index;
}

export function setSections(newSections) {
    sections = newSections;
}

export function setCurrentFloor(floor) {
    currentFloor = floor;
}
