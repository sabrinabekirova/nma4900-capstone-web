// ===== DATA LOADING FROM JSON =====
import { artworks, setArtworks } from './state.js';

export async function loadArtworksFromJSON() {
    try {
        const response = await fetch('exhibition_data.json');
        const data = await response.json();
        
        // Process the floor data structure
        if (data.exhibition && data.exhibition.floors) {
            const newArtworks = [];
            
            data.exhibition.floors.forEach(floor => {
                const floorKey = floor.floor_name.toLowerCase();
                
                // Convert artists to artworks format
                floor.artists.forEach((artist, index) => {
                    newArtworks.push({
                        id: newArtworks.length + 1,
                        title: artist.work_title,
                        artist: artist.artist_name,
                        type: 'video',
                        src: `videos/${artist.work_title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.mp4`,
                        thumbnail: artist.thumbnail || `assets/placeholder.jpg`,
                        category: floorKey,
                        description: artist.work_description,
                        artistBio: artist.artist_bio,
                        medium: artist.medium,
                        running_time: artist.running_time,
                        dimensions: artist.dimensions,
                        video_url: artist.video_url,
                        images: artist.images,
                        pdf_url: artist.pdf_url
                    });
                });
            });
            
            setArtworks(newArtworks);
        }
        
        // Update exhibition info if available
        if (data.exhibition) {
            updateExhibitionInfo(data.exhibition);
        }
        
        return true;
    } catch (error) {
        console.error('Could not load!', error);
        alert('Unable to load exhibition data. Please check that exhibition_data.json exists.');
        return false;
    }
}

function updateExhibitionInfo(exhibitionData) {
    // Update about text
    const aboutSection = document.querySelector('#about-section p');
    if (aboutSection && exhibitionData.about) {
        aboutSection.textContent = exhibitionData.about;
    }
    
    // Update visit information
    if (exhibitionData.location) {
        const visitInfo = document.querySelector('.visit-info');
        if (visitInfo) {
            visitInfo.innerHTML = `
                <p><strong>Location:</strong> ${exhibitionData.location.venue}</p>
                <p><strong>Address:</strong> ${exhibitionData.location.address}</p>
                <p><strong>Hours:</strong> ${exhibitionData.location.hours}</p>
                <p><strong>Opening Reception:</strong> ${exhibitionData.location.opening}</p>
            `;
        }
    }
    
    // Update social links
    if (exhibitionData.social) {
        const socialLinks = document.querySelectorAll('.social-link');
        const socialUrls = [
            exhibitionData.social.instagram,
            exhibitionData.social.twitter,
            exhibitionData.social.facebook,
            exhibitionData.social.email
        ];
        socialLinks.forEach((link, index) => {
            if (socialUrls[index]) {
                link.href = socialUrls[index];
            }
        });
    }
}
