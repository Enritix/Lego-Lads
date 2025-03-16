const carousel = document.querySelector('.carousel');
const images = carousel.querySelectorAll('img');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
let currentImageIndex = 0;

function updateCarousel() {
  images.forEach((img, index) => {
    img.classList.remove('left', 'middle', 'right');
    img.style.display = 'none';

    let diff = index - currentImageIndex;

    if (diff > 0) {
      diff = diff % images.length;
    } else if (diff < 0) {
      diff = (diff % images.length) + images.length;
    }

    if (diff === 0) {
      img.classList.add('middle');
      img.style.display = 'block';
    } else if (diff === 1) {
      img.classList.add('right');
      img.style.display = 'block';
    } else if (diff === images.length - 1) {
      img.classList.add('left');
      img.style.display = 'block';
    }
  });
}

function goToPrev() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateCarousel();
}

function goToNext() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateCarousel();
}

prevButton.addEventListener('click', goToPrev);
nextButton.addEventListener('click', goToNext);

updateCarousel();

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
});
