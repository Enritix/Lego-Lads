const track = document.querySelector('.carousel-track');
const items = [...document.querySelectorAll('.carousel-track > a .carousel-item')];
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');
const carousel = document.querySelector('.carousel');

let currentIndex = items.findIndex(item => item.classList.contains('active'));
let touchStartX = 0;
let touchEndX = 0;

function updateCarousel(index) {
    const totalItems = items.length;

    items.forEach((item, i) => {
        item.classList.remove('active', 'left', 'right');

        if (i === index) {
            item.classList.add('active');
        } else if (i === (index - 1 + totalItems) % totalItems) {
            item.classList.add('left');
        } else if (i === (index + 1) % totalItems) {
            item.classList.add('right');
        }
    });

    currentIndex = index;
}

nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateCarousel((currentIndex + 1) % items.length);
});

prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateCarousel((currentIndex - 1 + items.length) % items.length);
});

updateCarousel(currentIndex);

const infoIcon = document.querySelector('.info-icon');
const popup = document.querySelector('.popup');
const closeButton = document.querySelector('.close-button');

infoIcon.addEventListener('click', () => {
  popup.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
  popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
})
