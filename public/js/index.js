const setsButton = document.getElementById('sets');
const setsDropdown = document.getElementById('figs-dropdown');

const minigamesButton = document.getElementById('minigames');
const minigamesDropdown = document.getElementById('minigames-dropdown');

setsButton.addEventListener('click', () => {
    if (minigamesDropdown.classList.contains('show')) {
        minigamesDropdown.classList.remove('show');
    }
    setsDropdown.classList.toggle('show');
});

minigamesButton.addEventListener('click', () => {
    if (setsDropdown.classList.contains('show')) {
        setsDropdown.classList.remove('show');
    }
    minigamesDropdown.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const closePopupBtn = document.querySelector(".close-btn");

    function openPopup() {
        popup.classList.remove("hidden");
        popup.classList.add("active");
        if (overlay) overlay.classList.add("active");
    }

    function closePopup() {
        popup.classList.add("hidden");
        popup.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        sessionStorage.setItem("popupShown", "true");
    }

    if (!sessionStorage.getItem("popupShown")) {
        openPopup();
    } else {
        popup.classList.add("hidden");
        popup.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    }

    closePopupBtn.addEventListener("click", closePopup);
    if (overlay) overlay.addEventListener("click", closePopup);
});
