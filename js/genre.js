document.addEventListener('DOMContentLoaded', function() {
  let currentIndex = 1;
  const items = document.querySelectorAll('.carousel img');
  const indicators = document.querySelectorAll('.indicator');
  const totalItems = items.length;
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');

  function updateCarousel() {
      items.forEach((item, index) => {
          if (index === currentIndex) {
              item.className = 'middle';
          } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
              item.className = 'left';
          } else if (index === (currentIndex + 1) % totalItems) {
              item.className = 'right';
          } else {
              item.className = '';
          }
      });
      updateIndicators();
  }

  function updateIndicators() {
      indicators.forEach((indicator, index) => {
          if (index === currentIndex) {
              indicator.classList.add('active');
          } else {
              indicator.classList.remove('active');
          }
      });
  }

  function navigateCarousel(direction) {
      if (direction === 'next') {
          currentIndex = (currentIndex + 1) % totalItems;
      } else if (direction === 'prev') {
          currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      }
      updateCarousel();
  }

  function navigateToItem(index) {
      currentIndex = index;
      updateCarousel();
  }

  prevButton.addEventListener('click', () => navigateCarousel('prev'));
  nextButton.addEventListener('click', () => navigateCarousel('next'));

  indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => navigateToItem(index));
  });

  updateCarousel();
});
