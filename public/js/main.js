document.addEventListener('DOMContentLoaded', function() {
    hideOverlay();
    setupIconLinks();

    //Navigation
    setupNavigationScroll();
    activateSectionOnScroll();
    setupHamburgerMenuLinks();

    //Form/Footer
    setupFormValidation();
    setupEmailLinkScroll();
    setupFooterEmailLinkScroll();
    

    // Carousel
    fetchImages();
    initializeCarouselControls();
});


//Hambuger Menu
document.getElementById('hamburger-menu').addEventListener('click', function () {
    toggleHamburgerMenu();
});
document.getElementById('dimmed-background').addEventListener('click', function(e) {
    closeHamburgerMenuOnBackgroundClick(e);
});
