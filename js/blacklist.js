document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function () {
        this.parentElement.remove();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const infoIcon = document.querySelector('.info-icon');
    const infoPopup = document.getElementById('info-popup');
    const closeButton = document.querySelector('.close-button');

    infoIcon.addEventListener('click', function() {
        infoPopup.style.display = 'flex';
    });

    closeButton.addEventListener('click', function() {
        infoPopup.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === infoPopup) {
            infoPopup.style.display = 'none';
        }
    });
});
