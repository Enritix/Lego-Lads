const infoIcon = document.querySelector('.info-icon');
const popupOverlay = document.getElementById('popup-overlay');
const closePopup = document.getElementById('close-popup');

// Show the popup when info icon is clicked
infoIcon.addEventListener('click', () => {
    popupOverlay.style.display = 'flex';
});

// Close the popup when close button is clicked
closePopup.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

// Optional: Close popup when clicking outside of it
popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});