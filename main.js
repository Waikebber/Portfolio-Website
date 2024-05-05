// Initial setup for active link updates and icon links
document.addEventListener('DOMContentLoaded', function() {
    updateActiveLink();
    setupIconLinks();
});

document.addEventListener('scroll', function() {
    updateActiveLink();
});

// Updates active link based on scroll position
function updateActiveLink() {
    const sections = document.querySelectorAll('.section');
    const navbarLinks = document.querySelectorAll('#navbar a');

    sections.forEach(function(section) {
        const top = section.offsetTop - 100;
        const bottom = top + section.clientHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
            const id = section.getAttribute('id');
            const correspondingLink = document.querySelector('a[href="#' + id + '"]');
            navbarLinks.forEach(link => link.classList.remove('active'));
            correspondingLink.classList.add('active');
        }
    });
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
