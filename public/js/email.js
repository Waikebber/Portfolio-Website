//Scroll from the email link to the contact section
function setupEmailLinkScroll() {
    const emailLink = document.querySelector('.icon.email');
    emailLink.addEventListener('click', function(event) {
        event.preventDefault();
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            smoothScrollTo(contactSection, 1000);
        }
    });
}
function setupFooterEmailLinkScroll() {
    const footerEmailLink = document.querySelector('#footer-icons .icon.email');
    footerEmailLink.addEventListener('click', function(event) {
        event.preventDefault();
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            smoothScrollTo(contactSection, 1000);
        }
    });
}

//Contact form validation
function setupFormValidation() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        var isValid = true;
        var email = document.getElementById('email').value;
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        var emailErrorElement = document.getElementById('email-error');
        emailErrorElement.textContent = '';

        if (!emailPattern.test(email)) {
            isValid = false;
            emailErrorElement.textContent = 'Please enter a valid email address.';
        }

        if (!isValid) {
            event.preventDefault();
        }
    });
}