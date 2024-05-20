let currentIndex = 3; // Start with the fourth image as active
let images = [];

// Fetch images from the server
async function fetchImages() {
    try {
        const response = await fetch('/images');
        images = await response.json();
        createCarouselItems();
        showSlide(currentIndex);
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Function to create carousel items
function createCarouselItems() {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = ''; // Clear any existing items
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

// Function to show the slide at the given index
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    currentIndex = index;

    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        slide.style.display = 'none';
    });

    // Calculate the indices to show
    const indicesToShow = [];
    for (let i = -3; i <= 3; i++) {
        let idx = (currentIndex + i + totalSlides) % totalSlides;
        indicesToShow.push(idx);
    }

    indicesToShow.forEach((idx) => {
        slides[idx].style.display = 'flex';
        slides[idx].classList.remove('active');
    });

    slides[currentIndex].classList.add('active');

    // Adjust the carousel-inner transform to center the active slide
    const offset = -((currentIndex - 3 + totalSlides) % totalSlides) * 100 / 7;
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
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
