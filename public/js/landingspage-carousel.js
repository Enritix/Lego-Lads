const carousel = document.querySelector('.carousel-track');
const items = Array.from(document.querySelectorAll('.carousel-item'));
const indicators = document.querySelectorAll('.indicator');
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');
const titleElement = document.querySelector('.carousel-title');

let currentIndex = 0;
const totalItems = items.length;

function updateCarousel() {
    items.forEach((item, i) => {
        item.classList.toggle('active', i === currentIndex);
    });

    titleElement.textContent = items[currentIndex].alt;

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentIndex);
    });
}

function moveCarousel(direction) {
    const spans = document.querySelectorAll(".carousel-track a span");
        spans.forEach(span => {
            span.style.display = "none";
        });
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % totalItems;
    } else {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    }

    updateCarousel();
}

nextButton.addEventListener('click', () => moveCarousel('next'));
prevButton.addEventListener('click', () => moveCarousel('prev'));

indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
    });
});

items.forEach((item, i) => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('active')) {
            currentIndex = i;
            updateCarousel();
        }
    });
});

let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) moveCarousel('next');
    else if (touchStartX - touchEndX < -50) moveCarousel('prev');
});

updateCarousel();
