document.addEventListener("DOMContentLoaded", function () {
    const sound = document.getElementById("clickSound");
    const musicButton = document.getElementById("music-toggle");
    const muteLine = document.getElementById("mute-line");

    let soundEnabled = true; 

    if (musicButton) {
        musicButton.addEventListener("click", function (event) {
            event.preventDefault(); 

            soundEnabled = !soundEnabled; 
            muteLine.style.display = soundEnabled ? "none" : "block"; 
        });
    }
    if (sound) {
        document.addEventListener("click", function (event) {
            if (soundEnabled) {
                sound.currentTime = 0;
                sound.play().catch(error => console.error("Audio kon nit worden afgespeeld:", error));
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger-menu");
    const navMenu = document.getElementById("nav-menu");

    hamburger.addEventListener("click", function () {
        navMenu.classList.toggle("active");
        if (navMenu.classList.contains("active")) {
            navMenu.style.opacity = "1";
            navMenu.style.visibility = "visible";
        } else {
            navMenu.style.opacity = "0";
            navMenu.style.visibility = "hidden";
        }
    });
});
