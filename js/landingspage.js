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

    carouselItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            if (item.classList.contains("active")) {
                if (item.alt === "Lego Masters") {
                    window.location.href = "loader.html";
                } else {
                    showPopup(item);
                }
            }
        });
    });

    function showPopup(item) {
        const spans = document.querySelectorAll(".carousel-track a span");
        spans.forEach(span => {
            span.style.display = "none";
        });

        const span = item.nextElementSibling;
        if (span) {
            span.style.display = "block";
            setTimeout(() => {
                span.style.display = "none";
            }, 1000);
        }
    }
});