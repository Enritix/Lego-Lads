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
    const closePopupBtn = document.querySelector(".close-btn");
  
    popup.classList.remove("hidden");
    popup.style.display = "block";
  
    closePopupBtn.addEventListener("click", function () {
      popup.classList.add("hidden");
      popup.style.display = "none";
    });
  
    window.addEventListener("click", function (event) {
      if (event.target === popup) {
        popup.classList.add("hidden");
        popup.style.display = "none";
      }
    });
  
  });
  