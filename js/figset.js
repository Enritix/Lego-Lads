document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0; // Startindex van de figuren
    const figures = document.querySelectorAll('.figure'); // Alle figuren ophalen
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    // Functie om de actieve figuur weer te geven
    function showFigure(index) {
        // Verberg alle figuren
        figures.forEach((figure) => {
            figure.classList.remove('active');
        });

        // Toon de figuur met de huidige index
        if (figures[index]) {
            figures[index].classList.add('active');
        }
    }

    // Start de carrousel met de eerste figuur
    showFigure(currentIndex);

    // Vorige knop logica
    prevButton.addEventListener('click', function () {
        currentIndex = (currentIndex === 0) ? figures.length - 1 : currentIndex - 1; // Ga naar de vorige figuur, of naar de laatste als het de eerste is
        showFigure(currentIndex);
    });

    // Volgende knop logica
    nextButton.addEventListener('click', function () {
        currentIndex = (currentIndex === figures.length - 1) ? 0 : currentIndex + 1; // Ga naar de volgende figuur, of terug naar de eerste als het de laatste is
        showFigure(currentIndex);
    });

    // Zorg ervoor dat de carrousel goed werkt bij schermresizing
    window.addEventListener('resize', function () {
        // Bij kleinere schermen (max-width: 600px) zorgen we ervoor dat maar 1 figuur per keer wordt getoond
        if (window.innerWidth <= 600) {
            figures.forEach((figure) => {
                figure.classList.remove('active');
            });
            showFigure(currentIndex); // Start met het tonen van de eerste figuur
        } else {
            // Bij grotere schermen tonen we alle figuren
            figures.forEach((figure) => {
                figure.classList.add('active');
            });
        }
    });

    // Initialisatie van de schermgrootte voor kleiner dan 600px
    if (window.innerWidth <= 600) {
        figures.forEach((figure) => {
            figure.classList.remove('active');
        });
        showFigure(currentIndex); // Start met het tonen van de eerste figuur
    }


    
});
