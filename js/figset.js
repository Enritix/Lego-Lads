document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0; 
    const figures = document.querySelectorAll('.figure'); 
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    function showFigure(index) {
        figures.forEach((figure) => {
            figure.classList.remove('active');
        });

        if (figures[index]) {
            figures[index].classList.add('active');
        }
    }

    showFigure(currentIndex);

    prevButton.addEventListener('click', function () {
        currentIndex = (currentIndex === 0) ? figures.length - 1 : currentIndex - 1; 
        showFigure(currentIndex);
    });


    nextButton.addEventListener('click', function () {
        currentIndex = (currentIndex === figures.length - 1) ? 0 : currentIndex + 1; 
        showFigure(currentIndex);
    });

    
    window.addEventListener('resize', function () {
        if (window.innerWidth <= 600) {
            figures.forEach((figure) => {
                figure.classList.remove('active');
            });
            showFigure(currentIndex); 
        } else {

            figures.forEach((figure) => {
                figure.classList.add('active');
            });
        }
    });

    if (window.innerWidth <= 600) {
        figures.forEach((figure) => {
            figure.classList.remove('active');
        });
        showFigure(currentIndex); 
    }


    
});
