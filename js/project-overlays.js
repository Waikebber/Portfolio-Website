function showOverlay(title, subtitle, description, imageUrl) {
    document.getElementById("overlay-title").innerText = title;
    document.getElementById("overlay-subtitle").innerText = subtitle;
    document.getElementById("overlay-description").innerText = description;
    document.getElementById("overlay-image").src = imageUrl;
    document.getElementById("overlay").style.display = "flex";
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}
