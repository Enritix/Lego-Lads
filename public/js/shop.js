let currentIndex = 1; 
let images = document.querySelectorAll(".carousel-img");
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

let countdownInterval;

function startCountdown(durationStr) {
    const timerElement = document.getElementById("countdown");

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    if (!localStorage.getItem("countdownEndTime")) {
        const [hours, minutes, seconds] = durationStr.split(":").map(Number);
        const now = Date.now();
        const endTime = now + ((hours * 3600 + minutes * 60 + seconds) * 1000);
        localStorage.setItem("countdownEndTime", endTime.toString());
        console.log( new Date(endTime).toLocaleTimeString());
    } else {
    }

    countdownInterval = setInterval(() => {
        const now = Date.now();
        const endTime = parseInt(localStorage.getItem("countdownEndTime")); 

        const remaining = Math.floor((endTime - now) / 1000);

        if (remaining <= 0) {
            clearInterval(countdownInterval);
            localStorage.removeItem("countdownEndTime");
            timerElement.textContent = "00:00:00";
            refreshFigs(); 
            return;
        }

        const hrs = String(Math.floor(remaining / 3600)).padStart(2, '0');
        const mins = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
        const secs = String(remaining % 60).padStart(2, '0');

        timerElement.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

async function refreshFigs() {

    try {
        const res = await fetch("/api/random-figs");
        if (!res.ok) throw new Error(`Fetch mislukt: ${res.status}`);

        const newFigs = await res.json();
        console.log(newFigs);

        const carousel = document.querySelector(".carousel");
        if (!carousel) {
            return;
        }

        carousel.innerHTML = "";

        newFigs.forEach((fig, index) => {
            const price = fig.rarity === "legendary" ? 1000 :
                          fig.rarity === "episch" ? 750 : 500;

            const img = document.createElement("img");
            img.src = fig.img;
            img.alt = fig.name;
            img.classList.add("carousel-img");
            img.dataset.name = fig.name;
            img.dataset.rarity = fig.rarity;
            img.dataset.price = price;

            carousel.appendChild(img);
        });

        images = document.querySelectorAll(".carousel-img");
 
        currentIndex = 1;
        updateCarousel();
  
    } catch (err) {
        console.error(err);
    }
    localStorage.removeItem("countdownEndTime"); 
    startCountdown("11:59:59"); 
}

    startCountdown("11:59:59");

function formatCoins(coins) {
  if (coins >= 1000) {
    return Math.floor(coins / 100) / 10 + "K";
  }
  return coins.toString();
}

document.querySelector(".buy-confirm").addEventListener("click", async () => {
  const currentImg = images[currentIndex];
  const selectedFig = {
    name: currentImg.dataset.name,
    rarity: currentImg.dataset.rarity,
    img: currentImg.src,
    price: parseInt(currentImg.dataset.price)
  };

  try {
    const langPrefix = window.location.pathname.startsWith("/en") ? "/en" : "/nl";

    const res = await fetch(`${langPrefix}/api/buy-fig`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fig: selectedFig })
    });

    const data = await res.json();

    if (res.ok) {
      const formattedCoins = formatCoins(data.newBalance);

      const popupBalance = document.getElementById("popup-balance");
      if (popupBalance) popupBalance.textContent = formattedCoins;

      const desktopCoins = document.querySelector("#coin-container p");
      if (desktopCoins) desktopCoins.textContent = formattedCoins;

      const mobileCoins = document.querySelector(".coin-container span");
      if (mobileCoins) mobileCoins.textContent = formattedCoins;

      refreshFigs();
    } else {
    }

  } catch (err) {
  }
});

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");
console.log("VERZEND NAAR BACKEND:", type); 


   const langPrefix = window.location.pathname.split("/")[1]; 
    fetch(`/${langPrefix}/buy-item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemType: type })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
        location.reload();
      } else {
        alert(data.error);
      }
    });
  });
});

