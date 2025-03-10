document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function () {
        this.parentElement.remove();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const infoIcon = document.querySelector('.info-icon');
    const infoPopup = document.getElementById('info-popup');
    const closeButton = document.querySelector('.close-button');

    // Open de popup wanneer op het info icoon wordt geklikt
    infoIcon.addEventListener('click', function() {
        infoPopup.style.display = 'flex'; // Gebruik 'flex' om te centreren
    });

    // Sluit de popup wanneer op de sluitknop wordt geklikt
    closeButton.addEventListener('click', function() {
        infoPopup.style.display = 'none';
    });

    // Sluit de popup wanneer er buiten de popup wordt geklikt
    window.addEventListener('click', function(event) {
        if (event.target === infoPopup) {
            infoPopup.style.display = 'none';
        }
    });
});
