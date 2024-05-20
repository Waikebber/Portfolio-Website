let currentIndex = 3; // Start with the fourth image as active
let images = [];

/**
 * Fetch images from the server
 */
async function fetchImages() {
    try {
        const response = await fetch('/images');
        images = await response.json();
        images = shuffle(images);
        createCarouselItems();
        showSlide(currentIndex);
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

/**
 *  Shuffle the array
 * 
 * @param {*} array 
 * @returns shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
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
    images.forEach((src, index) => {
        const div = document.createElement('div');
        div.className = 'carousel-item';
        if (index === currentIndex) {
            div.classList.add('active');
        }
        div.setAttribute('onclick', `showSlide(${index})`);
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Image ${index + 1}`;
        div.appendChild(img);
        carouselInner.appendChild(div);
    });
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
        slide.style.display = 'none';
    });

    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentIndex + 1) % totalSlides;
    const prevPrevIndex = (currentIndex - 2 + totalSlides) % totalSlides;
    const nextNextIndex = (currentIndex + 2) % totalSlides;

    slides[prevPrevIndex].style.display = 'flex';
    slides[prevIndex].style.display = 'flex';
    slides[currentIndex].style.display = 'flex';
    slides[nextIndex].style.display = 'flex';
    slides[nextNextIndex].style.display = 'flex';

    slides[prevPrevIndex].classList.add('prev-prev');
    slides[prevIndex].classList.add('prev');
    slides[currentIndex].classList.add('active');
    slides[nextIndex].classList.add('next');
    slides[nextNextIndex].classList.add('next-next');
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
