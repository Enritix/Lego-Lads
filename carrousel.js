document.addEventListener('DOMContentLoaded', function () {
    const figures = document.querySelectorAll('.figuur');
    let currentIndex = 0;

    function showFigure(index) {
        figures.forEach((figure, i) => {
            figure.style.display = i === index ? 'block' : 'none';
        });
    }

    function nextFigure() {
        currentIndex = (currentIndex + 1) % figures.length;
        showFigure(currentIndex);
    }

    function prevFigure() {
        currentIndex = (currentIndex - 1 + figures.length) % figures.length;
        showFigure(currentIndex);
    }

    document.querySelector('.next').addEventListener('click', nextFigure);
    document.querySelector('.prev').addEventListener('click', prevFigure);

    showFigure(currentIndex);
});