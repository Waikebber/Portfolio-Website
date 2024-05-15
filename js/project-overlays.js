function showOverlay(description) {
    document.getElementById("overlay-title").innerText = description.split(' ')[0];
    document.getElementById("overlay-description").innerText = description;
    document.getElementById("overlay").style.display = "flex";
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}
