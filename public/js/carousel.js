document.addEventListener('DOMContentLoaded', function() {
    hideOverlay();
    setupIconLinks();
    setupNavigationScroll();
    activateSectionOnScroll();
    setupFormValidation();
    setupEmailLinkScroll();
    setupFooterEmailLinkScroll();
    
    // Fetch images and set up the carousel
    fetchImages();
});

let currentIndex = 3; // Start with the fourth image as active
let images = [];
let currentActiveOverlay = null;

/**
 * Fetch images from the server
 */
async function fetchImages() {
    try {
        const response = await fetch('/images');
        const data = await response.json();
        images = shuffle(data);
        createCarouselItems();
        showSlide(currentIndex);
        addEventDelegation(); // Add event delegation
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

/**
 * Shuffle the array
 * 
 * @param {*} array 
 * @returns shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

/**
 * Create carousel items
 */
function createCarouselItems() {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = ''; // Clear the carousel inner
    images.forEach((image, index) => {
        const div = document.createElement('div');
        div.className = 'carousel-item';
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = `Image ${index + 1}`;
        div.appendChild(img);

        // Create the location overlay
        const overlay = document.createElement('div');
        overlay.className = 'location-overlay';
        overlay.innerText = image.location;
        div.appendChild(overlay);

        carouselInner.appendChild(div);
    });

    // Force reflow/redraw
    carouselInner.offsetHeight;
}

/**
 * Show the slide at the given index
 * 
 * @param {*} index 
 */
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    currentIndex = index;

    slides.forEach((slide, idx) => {
        slide.classList.remove('active', 'prev', 'next', 'prev-prev', 'next-next');
        slide.style.transform = ''; // Reset transform
        slide.style.display = 'none'; // Hide all slides initially

        // Hide the overlay for all slides
        const overlay = slide.querySelector('.location-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    });

    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentIndex + 1) % totalSlides;
    const prevPrevIndex = (currentIndex - 2 + totalSlides) % totalSlides;
    const nextNextIndex = (currentIndex + 2) % totalSlides;

    slides[currentIndex].classList.add('active');
    slides[currentIndex].style.display = 'flex';
    slides[prevIndex].classList.add('prev');
    slides[prevIndex].style.display = 'flex';
    slides[nextIndex].classList.add('next');
    slides[nextIndex].style.display = 'flex';
    slides[prevPrevIndex].classList.add('prev-prev');
    slides[prevPrevIndex].style.display = 'flex';
    slides[nextNextIndex].classList.add('next-next');
    slides[nextNextIndex].style.display = 'flex';

    // Force reflow/redraw
    requestAnimationFrame(() => {
        slides[currentIndex].style.transform = 'translateX(0)'; // Example transform to trigger reflow
    });
}

/**
 * Show the location text for the active image
 * 
 * @param {*} index 
 */
function showLocation(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const activeSlide = slides[index];
    const overlay = activeSlide.querySelector('.location-overlay');

    if (overlay.style.display === 'block') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'block';
    }
}

// Function to handle all click events for the carousel
function handleCarouselClick(event) {
    const slide = event.target.closest('.carousel-item');
    if (!slide) return;

    const slides = Array.from(slide.parentNode.children);
    const index = slides.indexOf(slide);

    if (slide.classList.contains('active')) {
        showLocation(index);
    } else {
        showSlide(index);
    }
}

// Add event delegation
function addEventDelegation() {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.addEventListener('click', handleCarouselClick);
}

// Function to go to the next slide
function nextSlide() {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    showSlide((currentIndex + 1) % totalSlides);
}

// Function to go to the previous slide
function prevSlide() {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    showSlide((currentIndex - 1 + totalSlides) % totalSlides);
}

// Initial setup
fetchImages();
