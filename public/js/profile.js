let figures = [];
let currentIndex = 0;

async function fetchUserFigures() {
    try {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
            const langPrefix = langMatch ? langMatch[0] : '/nl';
            const response = await fetch(`${langPrefix}/get-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ userId: '680d098a9e371da5cefb77cb' })
        });

        const data = await response.json();
        if (data.success) {
            figures = data.user.figs;
            currentIndex = 0;
            updateFigure();
        } else {
            console.error('Error fetching user figures:', data.message);
        }
    } catch (error) {
        console.error('Error fetching user figures:', error);
    }
}

function updateFigure() {
    if (figures.length === 0) return;

    const figure = figures[currentIndex];
    document.getElementById("lego-figure").src = figure.img;
    document.getElementById("lego-figure").alt = figure.name;
    document.getElementById("name").textContent = figure.name;

    const rarityElement = document.getElementById("rarity");
    rarityElement.textContent = figure.rarity.toUpperCase();
    rarityElement.className = `rarity ${figure.rarity.toLowerCase()}`;

    const amountFigsElement = document.getElementById("amount-figs");
    amountFigsElement.innerHTML = `
        <span id="current-index">${currentIndex + 1}</span>/${figures.length}
        <span id="inventory"><a href="inventory">🎒</a></span>
    `;
}

function nextFigure() {
    if (figures.length === 0) return;

    currentIndex = (currentIndex + 1) % figures.length;
    updateFigure();
}

function prevFigure() {
    if (figures.length === 0) return;

    currentIndex = (currentIndex - 1 + figures.length) % figures.length;
    updateFigure();
}

fetchUserFigures();


function openPopup() {
    document.getElementById("prestaties-popup").style.display = "flex";
    document.querySelector(".popup").style.display = "flex";
    document.querySelector(".popup-content").style.display = "block";
    updateAllProgressBars(document.getElementById("prestaties-popup"));
}

function closePopup() {
    document.getElementById("prestaties-popup").style.display = "none";
    document.querySelector(".popup-content").style.display = "none";
}

updateFigure();

function updateAllProgressBars(scope = document) {
    scope.querySelectorAll('.progress[data-progress]').forEach(div => {
        const progress = parseFloat(div.getAttribute('data-progress'));
        div.style.width = Math.min(Math.max(progress, 0), 100) + '%';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateAllProgressBars();
});

async function collectAchievement(achievementKey) {
    try {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const response = await fetch(`${langPrefix}/collect-achievement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: null,
                achievementKey 
            })
        });
        const data = await response.json();
        window.location.reload();
    } catch (error) {
        alert('Fout bij ophalen achievement: ' + error);
    }
}