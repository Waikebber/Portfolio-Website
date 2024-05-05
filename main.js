
// Opens ICON links in a new tab
document.addEventListener("DOMContentLoaded", function() {
    var icons = document.querySelectorAll('.icon');
    icons.forEach(function(icon) {
        icon.addEventListener('click', function(event) {
            var link = this.dataset.link;
            if (link) {
                window.open(link, '_blank');
            }
            event.preventDefault();
        });
    });
});
