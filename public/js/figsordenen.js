document.addEventListener("DOMContentLoaded", async function () {
    const setsUl = document.getElementById("sets");
    const figImg = document.getElementById("figKeuze");
    const plusAnim = document.getElementById("pluss");
    const minAnim = document.getElementById("min");
    const skipButton = document.getElementById("skipButton");
    const vernietigButton = document.getElementById("vernietigKnop");
    const closeButton = document.getElementById("closePopUp");
    const overlay = document.getElementById("overlayOrdenen");
    const popup = document.getElementById("reasonPopUp");

    let currentFig = null;
    let sets = [];

    // Helper: animatie
    function animateChange(elem, value) {
        elem.textContent = value > 0 ? `+${value}` : `${value}`;
        elem.classList.add("animate");
        setTimeout(() => elem.classList.remove("animate"), 1000);
    }

    // Helper: redirect
    function redirectTo(path) {
        window.location.href = path;
    }

    // 1. Haal game data op
    async function fetchGameData() {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const res = await fetch(`${langPrefix}/get-game-data`, { method: "POST" });
        const data = await res.json();
        if (!data.success) return null;
        return data.gameData;
    }

    // 2. Haal alle sets op
    async function fetchAllSets() {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const res = await fetch(`${langPrefix}/get-all-sets`, { method: "POST" });
        const data = await res.json();
        if (!data.success) return [];
        return data.sets;
    }

    // 3. Vind eerste pending fig
    function findFirstPendingFig(gameData) {
        if (!gameData || !Array.isArray(gameData.figs)) return null;
        return gameData.figs.find(fig => fig.status === "pending");
    }

    // 4. Toon sets in de UI
    function showSets(setsToShow) {
        setsUl.innerHTML = "";
        setsToShow.forEach(set => {
            const li = document.createElement("li");
            li.dataset.id = set.id;
            li.innerHTML = `
                <a href="#" class="set-choice">
                    <p class="name">${set.code}</p>
                    <img src="${set.img}" alt="">
                </a>
            `;
            setsUl.appendChild(li);
        });
    }

    // 5. Main logica
    async function init() {
        const gameData = await fetchGameData();
        if (!gameData) return;

        currentFig = findFirstPendingFig(gameData);
        if (!currentFig) {
            redirectTo("/resultaat");
            return;
        }

        // Toon fig
        if (figImg) {
            figImg.src = currentFig.img;
            figImg.alt = currentFig.name;
        }

        // Sets ophalen en randomiseren
        sets = await fetchAllSets();
        const correctSet = sets.find(set => set.id === currentFig.set);
        const otherSets = sets.filter(set => set.id !== currentFig.set);
        const shuffled = otherSets.sort(() => 0.5 - Math.random());
        const randomSets = [correctSet, ...shuffled.slice(0, 2)].sort(() => 0.5 - Math.random());

        showSets(randomSets);

        // Koppel click events aan sets
        setsUl.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", async (e) => {
                e.preventDefault();
                const chosenSet = li.dataset.id;
                let caseType = Number(chosenSet) === Number(currentFig.set) ? "juist" : "verkeerd";
                await handleCase(caseType, chosenSet);
            });
        });
    }

    // 6. Case handler
    async function handleCase(type, chosenSet = null) {
        switch (type) {
            case "juist":
                await updateGameData("sorted");
                await updateCoins(100);
                animateChange(plusAnim, 100);
                await addToOrdenedFigs();
                break;
            case "verkeerd":
                await updateGameData("wrong");
                await updateCoins(-100);
                animateChange(minAnim, -100);
                break;
            case "overslaan":
                await updateGameData("skipped");
                await updateCoins(-100);
                animateChange(minAnim, -100);
                break;
            case "wegwerpen":
                await updateGameData("sorted");
                await updateCoins(-100);
                await addToBin();
                animateChange(minAnim, -100);
                break;
        }
        // Check of er nog pending figs zijn
        const gameData = await fetchGameData();
        if (gameData && Array.isArray(gameData.figs) && gameData.figs.some(fig => fig.status === "pending")) {
            redirectTo("/factory");
        } else {
            redirectTo("/resultaat");
        }
    }

    // 7. API helpers
    async function updateGameData(status) {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        await fetch(`${langPrefix}/set-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, gameStatus: "inProgress" })
        });
    }

    async function updateCoins(amount) {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        await fetch(`${langPrefix}/update-coins`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coins: amount })
        });
    }

    async function addToOrdenedFigs() {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        await fetch(`${langPrefix}/orden-fig`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fig: { name: currentFig.name, img: currentFig.img },
                set: currentFig.set,
                status: "sorted"
            })
        });
    }

    async function addToBin() {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        await fetch(`${langPrefix}/bin-fig`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fig: { name: currentFig.name, img: currentFig.img },
                reason: getSelectedReason()
            })
        });
    }

    function getSelectedReason() {
        const checked = popup.querySelector('input[name="reason"]:checked');
        if (checked && checked.value === "other") {
            const txt = popup.querySelector('input[type="text"]');
            return txt ? txt.value : "";
        }
        return checked ? checked.value : "";
    }

    // 8. Button events
    if (skipButton) {
        skipButton.addEventListener("click", async () => {
            await handleCase("overslaan");
        });
    }

    if (vernietigButton && overlay && popup) {
        vernietigButton.addEventListener("click", function () {
            overlay.style.display = "block";
            popup.style.display = "block";
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", async function (e) {
            e.preventDefault();
            overlay.style.display = "none";
            popup.style.display = "none";
            await handleCase("wegwerpen");
        });
    }

    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
    });

    // Start
    init();
});