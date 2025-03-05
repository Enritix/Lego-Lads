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
