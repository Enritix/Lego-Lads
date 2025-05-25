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
    const vernietigButton = document.getElementById("vernietigKnop");
    const setsList = document.getElementById("sets");

    function updateCoins(minCoins) {
        fetch("/nl/update-coins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ coins: minCoins })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert("Kon geen munten aftrekken: " + (data.error || data.message));
            }
        })
        .catch(() => alert("Er is een fout opgetreden bij het updaten van de munten."));
    }

    if (setsList) {
        setsList.querySelectorAll("li").forEach(function (li) {
            li.addEventListener("click", function (e) {
                updateCoins(100);

                if (figKeuze) figKeuze.classList.add("hidden");
                setTimeout(() => {
                    if (figKeuze) figKeuze.style.display = "none";
                }, 1000);
                setTimeout(() => {
                    window.location.href = "/factory";
                }, 500);
            });
        });
    }

    if (skipButton) {
        skipButton.addEventListener("click", function () {
            updateCoins(-100);

            if (figKeuze) figKeuze.classList.add("hidden");
            setTimeout(() => {
                if (figKeuze) figKeuze.style.display = "none";
            }, 1000);
            setTimeout(() => {
                window.location.href = "/factory";
            }, 500);
        });
    }

    if (vernietigButton) {
        vernietigButton.addEventListener("click", function () {
            updateCoins(-100);

        });
    }


});


