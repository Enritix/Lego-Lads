function openInfoPopup() {
    document.getElementById("info-popup").style.display = "block";

}

function closePopup() {
    document.getElementById("info-popup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const sets = document.getElementById("sets");
    const leftArrow = document.getElementById("left");
    const rightArrow = document.getElementById("right");

    const scrollAmount = sets.clientWidth;

    rightArrow.addEventListener("click", function () {
        sets.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
    leftArrow.addEventListener("click", function () {
        sets.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlayOrdenen");
    const popup = document.getElementById("reasonPopUp");
    const vernietigButton = document.getElementById("vernietigKnop");
    const closeButton = document.getElementById("closePopUp");

    if (vernietigButton && overlay && popup) {
        vernietigButton.addEventListener("click", function () {
            overlay.style.display = "block";
            popup.style.display = "block"; 
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            overlay.style.display = "none"; 
            popup.style.display = "none";   
        });
    }
    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const skipButton = document.getElementById("skipButton");
    const figKeuze = document.getElementById("figKeuze");

    skipButton.addEventListener("click", function () {
        figKeuze.classList.add("hidden"); 

        setTimeout(() => {
            figKeuze.style.display = "none";
        }, 1000); 

        setTimeout(() => {
            window.location.href = "factory.html";
        }, 500); 
    });
});


