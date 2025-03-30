// Function to set up click events for the hamburger menu links
function setupHamburgerMenuLinks() {
    const links = document.querySelectorAll('.nav-links a');
    const dimmedBackground = document.getElementById('dimmed-background');
    const navLinks = document.getElementById('nav-links');

    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                smoothScrollTo(section, 1000);
            }
            navLinks.classList.remove('active');
            dimmedBackground.classList.remove('active');
        });
    });
}

// Function to toggle the hamburger menu
function toggleHamburgerMenu() {
    var navLinks = document.getElementById('nav-links');
    var dimmedBackground = document.getElementById('dimmed-background');

    navLinks.classList.toggle('active');
    dimmedBackground.classList.toggle('active');
}

// Function to close the hamburger menu when clicking the dimmed background
function closeHamburgerMenuOnBackgroundClick(e) {
    var navLinks = document.getElementById('nav-links');
    var dimmedBackground = document.getElementById('dimmed-background');
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        dimmedBackground.classList.remove('active');
    }
}
