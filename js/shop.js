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

updateCarousel();


function openPopup() {
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popup-img");
    const popupPrice = document.getElementById("popup-price");
    const currentImg = images[currentIndex];

    popupImg.src = currentImg.src;
    popupPrice.textContent = currentImg.dataset.price;
    popupImg.classList.remove("animate-move");
    popup.style.display = "block";
}

function closePopup() {
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popup-img");

    popupImg.classList.add("animate-move");

    setTimeout(() => {
        popup.style.display = "none";
        popupImg.classList.remove("animate-move"); 
    }, 700);
}

document.querySelector(".buy-btn").addEventListener("click", openPopup);
document.querySelector(".buy-confirm").addEventListener("click", closePopup);

function startCountdown(duration) {
    let timerElement = document.getElementById("countdown");
    let [hours, minutes, seconds] = duration.split(":").map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const countdownInterval = setInterval(() => {
        if (totalSeconds <= 0) return clearInterval(countdownInterval);
        
        totalSeconds--;
        let time = new Date(totalSeconds * 1000).toISOString().substr(11, 8);
        timerElement.textContent = time;
    }, 1000);
}
startCountdown("11:59:59");
