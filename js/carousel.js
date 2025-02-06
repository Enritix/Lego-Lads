const track = document.querySelector('.carousel-track');
const items = [...document.querySelectorAll('.carousel-track > .carousel-item')];
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = items.findIndex(item => item.classList.contains('active'));

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
  
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  
    currentIndex = index;
  }
  
  nextButton.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % items.length;
    updateCarousel(newIndex);
  });
  
  prevButton.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel(newIndex);
  });
  
  indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => {
      updateCarousel(i);
    });
  });
  
  updateCarousel(currentIndex);