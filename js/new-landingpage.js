document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.querySelector(".play-btn");
    const carouselItems = document.querySelectorAll(".carousel-item");

    playButton.addEventListener("click", function () {
        const activeItem = document.querySelector(".carousel-item.active");

        if (activeItem.alt === "Lego Masters") {
            window.location.href = "loader.html";
        } else {
            showPopup(activeItem);
        }
    });

    function showPopup(item) {
        const crossSpan = document.querySelector(".carousel-track a span");
    }
});
