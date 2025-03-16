const figures = [
    {
        name: "CRUG",
        image: "../assets/images/episch.png",
        rarity: "episch"
    },
    {
        name: "CRUGX",
        image: "../assets/images/gewoon.png",
        rarity: "ongewoon"
    },
    {
        name: "CRUGS",
        image: "../assets/images/legendary.png",
        rarity: "legendary"
    }
];

let currentIndex = 0;

function updateFigure() {
    const figure = figures[currentIndex];
    document.getElementById("lego-figure").src = figure.image;
    document.getElementById("name").textContent = figure.name;
    
    const rarityElement = document.getElementById("rarity");
    rarityElement.textContent = figure.rarity.toUpperCase();
    rarityElement.className = `rarity ${figure.rarity}`;
}

function nextFigure() {
    currentIndex = (currentIndex + 1) % figures.length;
    updateFigure();
}

function prevFigure() {
    currentIndex = (currentIndex - 1 + figures.length) % figures.length;
    updateFigure();
}


function openPopup() {
    let prestatiesContainer = document.getElementById("prestaties-container");
    let popupContainer = document.querySelector("#prestaties-popup .prestaties-container");


    if (window.innerWidth <= 600) {
        popupContainer.innerHTML = prestatiesContainer.innerHTML;
    }

    document.getElementById("prestaties-popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("prestaties-popup").style.display = "none";
}

updateFigure();
