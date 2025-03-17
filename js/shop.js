let currentIndex = 1; 
const images = document.querySelectorAll(".carousel-img");
const nameEl = document.getElementById("char-name");
const rarityEl = document.getElementById("char-rarity");
const priceEl = document.getElementById("char-price");

function updateCarousel() {
    images.forEach((img) => {
        img.classList.remove("middle", "left", "right");
        img.style.display = "none";                      // als eerte alles verbergen en de calasses verwijderen
    });

                                                         // midlst afbld tonen dspl block + midelste clas gevn
    images[currentIndex].classList.add("middle");
    images[currentIndex].style.display = "block"; 

    //  liks en rechts z index gevn 
    const leftIndex = (currentIndex - 1 + images.length) % images.length;
    const rightIndex = (currentIndex + 1) % images.length;
    
    images[leftIndex].classList.add("left");
    images[leftIndex].style.display = "block";             // linkse img left class geven en tonen 

    images[rightIndex].classList.add("right");
    images[rightIndex].style.display = "block";          // rechtrse img tonen en class right geven


    // Update tekst en prijs
    nameEl.textContent = images[currentIndex].dataset.name;
    rarityEl.textContent = images[currentIndex].dataset.rarity.charAt(0).toUpperCase() + images[currentIndex].dataset.rarity.slice(1);
    rarityEl.className = `rarity ${images[currentIndex].dataset.rarity}`;
    priceEl.textContent = images[currentIndex].dataset.price;
}

// index bewerken + - als er op een pijltje woord gedrukt 
function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}

// Initialiseren
updateCarousel();
