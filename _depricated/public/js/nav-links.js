// Sets up click events for navigation bar radio buttons to scroll to sections
function setupNavigationScroll() {
    const navbarRadios = document.querySelectorAll('.navbar input[type="radio"]');
    navbarRadios.forEach(function(radio) {
        radio.addEventListener('change', function(event) {
            event.preventDefault();
            if (this.checked) {
                const sectionId = this.id + '-section';
                const section = document.getElementById(sectionId);
                if (section) {
                    smoothScrollTo(section, 1000); 
                }
            }
        });
    });
}

// Updates the active tab and radio button based on the current section
function activateSectionOnScroll() {
    const sections = Array.from(document.querySelectorAll('section'));
    const tabs = document.querySelectorAll('.tab');
    const radios = document.querySelectorAll('.navbar input[type="radio"]');
    window.addEventListener('scroll', function() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - (document.querySelector('#bar-section').clientHeight);
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        tabs.forEach((tab, index) => {
            tab.classList.remove('active');
            if (tab.control && currentSectionId === tab.control.id + '-section') {
                tab.classList.add('active');
                radios[index].checked = true; // Synchronize radio button state
            } else {
                radios[index].checked = false;
            }
        });
    });
}

//Adds a smooth scroll effect to the navigation bar
function smoothScrollTo(element, duration) {
    const bufferPosition = -55;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + bufferPosition;

    const startPosition = window.scrollY;
    const distance = offsetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}


// Sets up click events for icons to open links in new tabs
function setupIconLinks() {
    const icons = document.querySelectorAll('.icon');
    icons.forEach(function(icon) {
        icon.addEventListener('click', function(event) {
            const link = this.dataset.link;
            if (link) {
                window.open(link, '_blank');
            }
            event.preventDefault();
        });
    });
}