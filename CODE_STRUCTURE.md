# Code Structure Documentation

## Overview
This exhibition website has been reorganized into a modular structure for better maintainability and readability.

## Directory Structure

```
/
├── index.html                  # Main HTML file
├── script.js                   # Main JS entry point (imports all modules)
├── styles.css                  # Main CSS entry point (imports all stylesheets)
├── exhibition_data.json        # Exhibition data
├── assets/                     # Images, icons, and media files
└── src/                        # Source code organized by type
    ├── js/                     # JavaScript modules
    │   ├── config.js           # Configuration constants
    │   ├── state.js            # Application state management
    │   ├── data-loader.js      # JSON data loading
    │   ├── page-navigation.js  # Page transitions and navigation
    │   ├── gallery.js          # Gallery functionality
    │   ├── modal.js            # Modal/popup functionality
    │   ├── animations.js       # Scroll and animation effects
    │   └── main.js             # Initialization and coordination
    ├── css/                    # CSS modules
    │   ├── variables.css       # CSS custom properties
    │   ├── base.css            # Reset and base styles
    │   ├── logo.css            # Logo section and animations
    │   ├── content-sections.css # About, visit, floor descriptions
    │   ├── gallery.css         # Gallery page styles
    │   ├── modal.css           # Modal styles
    │   └── responsive.css      # Media queries
    └── components/             # Reusable components (reserved for future use)
```

## JavaScript Modules

### config.js
- **Purpose**: Stores configuration constants
- **Exports**: `USE_JSON_FILE`, `floorColors`, `floorModalColors`

### state.js
- **Purpose**: Manages application state
- **Exports**: State variables and setter functions
- **Key States**: `artworks`, `currentPage`, `floorData`, `currentFloor`, `sections`

### data-loader.js
- **Purpose**: Loads and processes exhibition data from JSON
- **Exports**: `loadArtworksFromJSON()`
- **Dependencies**: `state.js`

### page-navigation.js
- **Purpose**: Handles page transitions and navigation
- **Exports**: `navigateToGallery()`, `navigateToHome()`, `restartExperience()`, `switchDescription()`
- **Dependencies**: `config.js`, `state.js`, `gallery.js`

### gallery.js
- **Purpose**: Manages gallery display and interaction
- **Exports**: `populateGallery()`, `createGalleryItem()`
- **Dependencies**: `state.js`, `modal.js`

### modal.js
- **Purpose**: Controls artwork detail modal
- **Exports**: `initializeModal()`, `openModal()`, `closeModal()`
- **Dependencies**: `config.js`, `state.js`

### animations.js
- **Purpose**: Handles scroll effects and animations
- **Exports**: `setupSlideAnimations()`, `scrollToSection()`, `handleKeyboardNavigation()`, `setupGalleryAccessibility()`, `debounce()`
- **Dependencies**: `state.js`

### main.js
- **Purpose**: Application entry point and initialization
- **Exports**: None (runs initialization on DOM ready)
- **Dependencies**: All other modules

## CSS Modules

### variables.css
- CSS custom properties (colors, fonts, spacing)
- Must be loaded first

### base.css
- CSS reset
- Base HTML and body styles
- Page management
- Utility classes
- Scrollbar styling

### logo.css
- Logo section layout
- SVG key styles
- Logo animations (float, glow, bounce, color transitions)
- Retro CRT effects

### content-sections.css
- Content sections layout
- Typography (h2, h3, h4, p)
- Exhibition layout (description panel, floor icons)
- Visit section
- Social section
- Slide-in animations

### gallery.css
- Gallery page layout
- Floor-specific backgrounds
- Gallery navigation
- Gallery grid and items

### modal.css
- Modal overlay and content
- Floor-specific modal colors
- Modal animations
- Modal typography and layout

### responsive.css
- Media queries for different screen sizes
- Tablet (max-width: 968px)
- Mobile landscape (max-width: 768px)
- Mobile portrait (max-width: 480px)

## How It Works

### Loading Sequence

1. **HTML loads** → references `styles.css` and `script.js`
2. **styles.css** → imports all CSS modules in order
3. **script.js** (as ES6 module) → imports `main.js`
4. **main.js** → imports and coordinates all other JS modules
5. **DOMContentLoaded** → initialization runs

### Data Flow

1. `main.js` calls `loadArtworksFromJSON()` from `data-loader.js`
2. `data-loader.js` fetches `exhibition_data.json`
3. Processed data is stored in `state.js` via setter functions
4. UI components read from `state.js` to display content

### User Interaction Flow

1. User clicks floor icon → `page-navigation.js` handles navigation
2. Navigation updates state and calls `gallery.js` to populate gallery
3. User clicks artwork → `gallery.js` calls `modal.js` to open detail view
4. User presses ESC or clicks close → `modal.js` closes modal

## Making Changes

### Adding a New Feature

1. **Create a new module file** in appropriate directory (`src/js/` or `src/css/`)
2. **Export functions/variables** from your new module
3. **Import in main.js** (for JS) or **add @import in styles.css** (for CSS)
4. **Update this documentation**

### Modifying Existing Code

1. **Find the relevant module** based on what you want to change
2. **Make your changes** in that specific file
3. **Test thoroughly** to ensure imports/exports still work
4. **Update documentation** if behavior changes

### Example: Adding a New Page

1. Create `src/js/new-page.js` with your page logic
2. Export functions like `initializeNewPage()`, `showNewPage()`
3. Import in `main.js` and call during initialization
4. Create `src/css/new-page.css` with page-specific styles
5. Add `@import url('src/css/new-page.css');` to `styles.css`

## Benefits of This Structure

- **Maintainability**: Each file has a single, clear purpose
- **Readability**: Smaller files are easier to understand
- **Scalability**: Easy to add new features without cluttering existing code
- **Debugging**: Easier to locate and fix issues
- **Collaboration**: Multiple developers can work on different modules
- **Reusability**: Components can be reused or replaced independently

## Backup Files

Original files have been preserved:
- `script.js.backup` - Original JavaScript
- `styles.css.backup` - Original CSS

These can be deleted once you've verified the new structure works correctly.

## Testing

To test the reorganized code:

1. Open `index.html` in a web browser
2. Test all functionality:
   - Logo animations on page load
   - Floor icon hover effects
   - Navigation to gallery pages
   - Gallery item display
   - Modal opening/closing
   - Keyboard navigation
   - Responsive design (resize browser)

All functionality should work exactly as before!
