document.addEventListener("DOMContentLoaded", function () {
    const sound = document.getElementById("clickSound");
    const musicButton = document.getElementById("music-toggle");
    const muteLine = document.getElementById("mute-line");
    const soundToggle = document.getElementById("sound-toggle");

    let soundEnabled = true;

    function toggleSound() {
        soundEnabled = !soundEnabled;
        muteLine.style.display = soundEnabled ? "none" : "block";
        if (soundToggle) {
            soundToggle.checked = soundEnabled;
        }
        if (sound) {
            sound.muted = !soundEnabled;
        }
    }

    if (musicButton) {
        musicButton.addEventListener("click", function (event) {
            event.preventDefault();
            toggleSound();
        });
    }

    if (soundToggle) {
        soundToggle.addEventListener("change", function () {
            toggleSound();
        });
    }
    
    if (sound) {
        document.addEventListener("click", function (event) {
            if (soundEnabled) {
                sound.currentTime = 0;
                sound.play().catch(error => console.error("Audio kon niet worden afgespeeld:", error));
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