function showOverlay(title, subtitle, description, imageUrl) {
    document.getElementById("overlay-title").innerText = title;
    document.getElementById("overlay-subtitle").innerText = subtitle;
    document.getElementById("overlay-description").innerHTML = description;
    document.getElementById("overlay-image").src = imageUrl;
    document.getElementById("overlay").style.display = "flex";
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}

function initializeBentoMore() {
    const bentoMore = document.querySelector('.bento-more');

    if (bentoMore) {
        bentoMore.addEventListener('click', () => {
            const before = document.getElementById('more-before');
            const after = document.getElementById('more-after');
            before.style.opacity = before.style.opacity === '0' ? '1' : '0';
            before.style.fontSize = before.style.fontSize === '0' ? '4vh' : '0';
            before.style.lineHeight = before.style.lineHeight === '0' ? '5vh' : '0';
            after.style.opacity = after.style.opacity === '1' ? '0' : '1';
            after.style.fontSize = after.style.fontSize === '3vh' ? '0' : '3vh';
            after.style.lineHeight = after.style.lineHeight === '5vh' ? '0' : '5vh';
        });
    }
}