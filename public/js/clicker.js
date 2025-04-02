let brick = document.querySelector('.brick-cost');
let parsedBrick = parseFloat(brick.innerHTML);

let clickerCost = document.querySelector('.clicker-cost');
let parsedClickerCost = parseFloat(clickerCost.innerHTML);

let clickerLevel = document.querySelector(".clicker-level");
let clickerIncrease = document.querySelector(".clicker-increase");
let parseClickerIncrease = parseFloat(clickerIncrease.innerHTML);

let sawCost = document.querySelector('.saw-cost');
let parsedSawCost = parseFloat(sawCost.innerHTML);

let sawLevel = document.querySelector(".saw-level");
let sawIncrease = document.querySelector(".saw-increase");
let parseSawIncrease = parseFloat(sawIncrease.innerHTML);

let drilCost = document.querySelector('.dril-cost');
let parsedDrilCost = parseFloat(drilCost.innerHTML);

let drilLevel = document.querySelector(".dril-level");
let drilIncrease = document.querySelector(".dril-increase");
let parseDrilIncrease = parseFloat(drilIncrease.innerHTML);

let bpcText = document.getElementById("BPC-text");
let bpsText = document.getElementById("BPS-text");

let bpc = 1;
let bps = 0;

function incrementBrick() {
    parsedBrick += bpc;
    brick.innerHTML = Math.floor(parsedBrick);
}

function updateUpgrades() {
    document.querySelectorAll(".brick-cost").forEach(el => el.innerHTML = Math.floor(parsedBrick));
    document.querySelectorAll(".clicker-cost").forEach(el => el.innerHTML = Math.round(parsedClickerCost));
    document.querySelectorAll(".clicker-level").forEach(el => el.innerHTML = clickerLevel.innerHTML);
    document.querySelectorAll(".clicker-increase").forEach(el => el.innerHTML = parseClickerIncrease.toFixed(2));

    document.querySelectorAll(".saw-cost").forEach(el => el.innerHTML = Math.round(parsedSawCost));
    document.querySelectorAll(".saw-level").forEach(el => el.innerHTML = sawLevel.innerHTML);
    document.querySelectorAll(".saw-increase").forEach(el => el.innerHTML = parseSawIncrease.toFixed(2));

    document.querySelectorAll(".dril-cost").forEach(el => el.innerHTML = Math.round(parsedDrilCost));
    document.querySelectorAll(".dril-level").forEach(el => el.innerHTML = drilLevel.innerHTML);
    document.querySelectorAll(".dril-increase").forEach(el => el.innerHTML = parseDrilIncrease.toFixed(2));
}

function buyClick() {
    if (parsedBrick >= parsedClickerCost) {
        parsedBrick -= parsedClickerCost;
        clickerLevel.innerHTML = parseInt(clickerLevel.innerHTML) + 1;
        parseClickerIncrease *= 1.03;
        clickerIncrease.innerHTML = parseClickerIncrease.toFixed(2);
        bpc += parseClickerIncrease;
        parsedClickerCost *= 1.18;

        updateUpgrades();
    }
}

function buySaw() {
    if (parsedBrick >= parsedSawCost) {
        parsedBrick -= parsedSawCost;
        sawLevel.innerHTML = parseInt(sawLevel.innerHTML) + 1;
        parseSawIncrease *= 1.03;
        sawIncrease.innerHTML = parseSawIncrease.toFixed(2);
        bps += parseSawIncrease;
        parsedSawCost *= 1.18;

        updateUpgrades();
    }
}

function buyDril() {
    if (parsedBrick >= parsedDrilCost) {
        parsedBrick -= parsedDrilCost;
        drilLevel.innerHTML = parseInt(drilLevel.innerHTML) + 1;
        parseDrilIncrease *= 1.03;
        drilIncrease.innerHTML = parseDrilIncrease.toFixed(2);
        bps += parseDrilIncrease;
        parsedDrilCost *= 1.18;

        updateUpgrades();
    }
}

setInterval(() => {
    parsedBrick += bps / 10;
    brick.innerHTML = Math.floor(parsedBrick);

    bpcText.innerHTML = Math.round(bpc);
    bpsText.innerHTML = Math.round(bps);

    updateUpgrades(); 
    updatePopupStats(); 
}, 100);

function openUpgrades() {
    const upgradesContainer = document.querySelector(".upgrades");
    const statisticsContainer = document.querySelector(".statistics");
    const popupContent = document.getElementById("upgradesPopup");

    if (!upgradesContainer || !statisticsContainer) {
        console.error("Upgrades of statistics container niet gevonden!");
        return;
    }

    popupContent.innerHTML = `
        <h3>Upgrades</h3>
        <div class="popup-content">
            ${upgradesContainer.innerHTML}
        </div>
        <footer class="statistics">
            <p>SPC: <span id="popup-BPC-text">${bpc}</span></p>
            <p>SPS: <span id="popup-BPS-text">${bps}</span></p>
        </footer>
        <button class="popup-close" onclick="closeUpgrades()">Sluiten</button>
    `;

    setTimeout(() => {
        document.querySelectorAll(".upgrade").forEach((upgrade) => {
            let functionName = upgrade.getAttribute("onclick");
            if (functionName) {
                functionName = functionName.replace("()", "");
                upgrade.onclick = window[functionName];
            }
        });
    }, 50);

    updatePopupStats(); 

    document.getElementById("popupOverlay").style.display = "block";
    popupContent.style.display = "block";
}
function closeUpgrades() {
    document.getElementById("popupOverlay").style.display = "none";
    document.getElementById("upgradesPopup").style.display = "none";
}

function openUpgrades() {
    const upgradesContainer = document.querySelector(".upgrades");
    const statisticsContainer = document.querySelector(".statistics");
    const popupContent = document.getElementById("upgradesPopup");

    if (!upgradesContainer || !statisticsContainer) {
        console.error("Upgrades of statistics container niet gevonden!");
        return;
    }

    popupContent.innerHTML = `
        <h3>Upgrades</h3>
        <div class="popup-content">
            ${upgradesContainer.innerHTML}
        </div>
        <footer class="statistics">
            <p>SPC: <span id="popup-BPC-text">${bpc}</span></p>
            <p>SPS: <span id="popup-BPS-text">${bps}</span></p>
        </footer>
        <button class="text-lego-stroke popup-close" data-text="Sluiten" >Sluiten</button>
    `;

    setTimeout(() => {
        document.querySelector(".popup-close").addEventListener("click", closeUpgrades);
    }, 50);

    setTimeout(() => {
        document.querySelectorAll(".upgrade").forEach((upgrade) => {
            let functionName = upgrade.getAttribute("onclick");
            if (functionName) {
                functionName = functionName.replace("()", "");
                upgrade.onclick = window[functionName];
            }
        });
    }, 50);

    updatePopupStats(); 

    document.getElementById("popupOverlay").style.display = "block";
    popupContent.style.display = "block";
}

function updatePopupStats() {
    let popupBPC = document.getElementById("popup-BPC-text");
    let popupBPS = document.getElementById("popup-BPS-text");

    if (popupBPC && popupBPS) {
        popupBPC.innerHTML = Math.round(bpc);
        popupBPS.innerHTML = Math.round(bps);
    }
}
function openInfoPopup() {
    document.getElementById("infoPopup").showModal();
}

function closeInfoPopup() {
    document.getElementById("infoPopup").close();
}

 

/* muntenn shop*/



const shopPopup = document.getElementById("shop-popup");
const clickerShop = document.getElementById("clicker-shop");
const closeShop = document.getElementById("close-shop");
const buyForm = document.getElementById("buy-form");
const quantityInput = document.getElementById("quantity");
const totalCost = document.getElementById("total-cost");

const COIN_PRICE = 100; 


clickerShop.addEventListener("click", () => {
    shopPopup.showModal();
});

closeShop.addEventListener("click", () => {
    shopPopup.close();
});


quantityInput.addEventListener("input", () => {
    let quantity = parseInt(quantityInput.value) || 1; 
    totalCost.textContent = quantity * COIN_PRICE;
});


buyForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    let quantity = parseInt(quantityInput.value);
    
    if (quantity > 0) {
        alert(`Je hebt ${quantity} munten gekocht voor ${quantity * COIN_PRICE} stenen!`);
        shopPopup.close();
    } else {
        alert("niet mogelijkk");
    }
});

