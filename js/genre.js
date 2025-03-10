document.addEventListener("DOMContentLoaded", function () {
    const carouselInner = document.querySelector(".carousel-inner");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");
  
    let currentIndex = Math.floor(carouselItems.length / 2);
  
    function updateCarousel() {
      carouselItems.forEach((item, index) => {
        const offset = index - currentIndex;
  
        item.style.transform = `translateX(${offset * (item.offsetWidth + 20)}px)`;
  
        if (offset === 0) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
  
        item.style.opacity = offset === 0 ? "1" : "0.5";
        item.style.filter = offset === 0 ? "none" : "blur(3px)";
      });
    }
  
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
      updateCarousel();
    });
  
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % carouselItems.length;
      updateCarousel();
    });
  
    updateCarousel();

    const infoPopup = document.getElementById('info-popup');
    document.querySelector('.info-icon').addEventListener('click', () => {
      infoPopup.style.display = 'flex';
    });

    document.querySelector('.close-button').addEventListener('click', () => {
        infoPopup.style.display = 'none';
      });

    window.addEventListener('click', (event) => {
        if (event.target === infoPopup) {
          infoPopup.style.display = 'none';
        }
      });
  });
  