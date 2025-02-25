document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.querySelector(".play-btn");
    const carouselItems = document.querySelectorAll(".carousel-item");

    playButton.addEventListener("click", function () {
        const activeItem = document.querySelector(".carousel-item.active");

        if (activeItem.alt === "Lego Masters") {
            window.location.href = "loader.html";
        } else {
            showLegoPopup();
        }
    });

    function showLegoPopup() {
        const modal = document.createElement("div");
        modal.classList.add("lego-popup");

        const popupContent = document.createElement("div");
        popupContent.classList.add("lego-popup-content");

        const popupText = document.createElement("p");
        popupText.textContent = "⛔ Toegang geweigerd! Probeer de Lego Lads game.";

        const closeButton = document.createElement("button");
        closeButton.textContent = "Sluiten";
        closeButton.classList.add("lego-close-btn");

        closeButton.addEventListener("click", () => {
            modal.remove();
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });

        popupContent.appendChild(popupText);
        popupContent.appendChild(closeButton);
        modal.appendChild(popupContent);
        document.body.appendChild(modal);
    }
});
