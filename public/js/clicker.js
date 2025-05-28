// clicker.js

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

const rawData = document.getElementById("clicker-data").textContent;
const clickerData = JSON.parse(rawData);

function incrementBrick() {
    parsedBrick += bpc;
    brick.innerHTML = Math.floor(parsedBrick);
    updateClickerData();
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

async function updateClickerData() {
    const langPrefix = window.langPrefix || "nl";

    const bricks = parseInt(document.querySelector(".brick-cost").innerText) || 0;

    const hammerLevel = parseInt(document.querySelector(".clicker-level").innerText) || 0;
    const sawLevel = parseInt(document.querySelector(".saw-level").innerText) || 0;
    const drillLevel = parseInt(document.querySelector(".dril-level").innerText) || 0;

    try {
        const response = await fetch(`/${langPrefix}/api/update-clicker`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                blocks: bricks,
                tools: {
                    hammer: { level: hammerLevel },
                    saw: { level: sawLevel },
                    drill: { level: drillLevel }
                }
            })
        });

        if (!response.ok) {
            console.error("Update mislukt:", await response.text());
        }
    } catch (err) {
        console.error("Fout bij opslaan:", err);
    }
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
        updateClickerData();
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
        updateClickerData();
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
        updateClickerData();
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

function updatePopupStats() {
    let popupBPC = document.getElementById("popup-BPC-text");
    let popupBPS = document.getElementById("popup-BPS-text");

    if (popupBPC && popupBPS) {
        popupBPC.innerHTML = Math.round(bpc);
        popupBPS.innerHTML = Math.round(bps);
    }
} // einde
