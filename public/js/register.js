document.addEventListener('DOMContentLoaded', function() {
    const figurenLijst = document.querySelector('.figuren-lijst');
    const figuren = figurenLijst.querySelectorAll('.figuur');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');
    const figImages = document.querySelectorAll('.figuur-images');
    let currentIndex = 0;
  
    function showFiguur(index) {
      figurenLijst.scrollTo({
        left: figuren[index].offsetLeft,
        behavior: 'smooth'
      });
    }
  
    function showNext() {
      currentIndex = (currentIndex + 1) % figuren.length;
      showFiguur(currentIndex);
    }
  
    function showPrev() {
      currentIndex = (currentIndex - 1 + figuren.length) % figuren.length;
      showFiguur(currentIndex);
    }
  
    function handleResize() {
      if (window.innerWidth <= 600) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
      } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }

    
  
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    figImages.forEach(figImage => {
      figImage.classList.remove('active');
      figImage.addEventListener('click', () => {
        figImages.forEach(image => image.classList.remove('active'));
        figImage.classList.add('active');
      });
    });
  
    window.addEventListener('resize', handleResize);
    handleResize(); 
  });
  