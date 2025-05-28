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

    function animateChange(elem, value) {
        elem.textContent = value > 0 ? `+${value}` : `${value}`;
        elem.classList.add("animate");
        setTimeout(() => elem.classList.remove("animate"), 1000);
    }

    function redirectTo(path) {
        window.location.href = path;
    }

    async function fetchGameData() {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const res = await fetch(`${langPrefix}/get-game-data`, { method: "POST" });
        const data = await res.json();
        if (!data.success) return null;
        return data.gameData;
    }

    async function fetchAllSets() {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const res = await fetch(`${langPrefix}/get-all-sets`, { method: "POST" });
        const data = await res.json();
        if (!data.success) return [];
        return data.sets;
    }

    function findFirstPendingFig(gameData) {
        if (!gameData || !Array.isArray(gameData.figs)) return null;
        return gameData.figs.find(fig => fig.status === "pending");
    }

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

    async function init() {
        const gameData = await fetchGameData();
        if (!gameData) return;

        currentFig = findFirstPendingFig(gameData);
        if (!currentFig) {
            redirectTo("/resultaat");
            return;
        }

        if (figImg) {
            figImg.src = currentFig.img;
            figImg.alt = currentFig.name;
        }

        sets = await fetchAllSets();
        const correctSet = sets.find(set => set.id === currentFig.set);
        const otherSets = sets.filter(set => set.id !== currentFig.set);
        const shuffled = otherSets.sort(() => 0.5 - Math.random());
        const randomSets = [correctSet, ...shuffled.slice(0, 2)].sort(() => 0.5 - Math.random());

        showSets(randomSets);

        setsUl.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", async (e) => {
                e.preventDefault();
                const chosenSet = li.dataset.id;
                let caseType = Number(chosenSet) === Number(currentFig.set) ? "juist" : "verkeerd";
                const setObj = sets.find(set => String(set.id) === String(chosenSet));
                const themeId = setObj ? setObj.theme : null;
                await handleCase(caseType, chosenSet, themeId);
            });
        });
    }

    async function handleCase(type, chosenSet = null, themeId = null) {
        const figEl = document.getElementById("figKeuze");
        const skipBtn = document.getElementById("skipButton");
        const vernietigBtn = document.getElementById("vernietigKnop");
        let targetSetEl = null;
        if (chosenSet) {
            const li = [...document.querySelectorAll("#sets li")].find(li => li.dataset.id == chosenSet);
            targetSetEl = li ? li.querySelector("img") : null;
        }

        if (type === "overslaan") {
            animateFigToTarget(figEl, skipBtn, async () => {
                showFloatingScore(skipBtn, "-100", "down");
                await updateGameData("skipped");
                await updateCoins(-100);
                await afterAnim();
            });
            return;
        }
        if (type === "wegwerpen") {
            animateFigToTarget(figEl, vernietigBtn, async () => {
                showFloatingScore(vernietigBtn, "-100", "down");
                await updateGameData("removed");
                await updateCoins(-100);
                await addToBin();
                await afterAnim();
            });
            return;
        }
        if (type === "juist" && targetSetEl) {
            animateFigToTarget(figEl, targetSetEl, async () => {
                showFloatingScore(figEl, "+100", "up");
                showEmojiFeedback("juist");
                await updateGameData("sorted");
                await updateCoins(100);
                await addToOrdenedFigs(chosenSet, themeId);
                await afterAnim();
            });
            return;
        }
        if (type === "verkeerd" && targetSetEl) {
            animateFigToTarget(figEl, targetSetEl, async () => {
                showFloatingScore(figEl, "-100", "up");
                showEmojiFeedback("fout");
                await updateGameData("wrong");
                await updateCoins(-100);
                await afterAnim();
            });
            return;
        }

        await afterAnim();

        async function afterAnim() {
            const gameData = await fetchGameData();
            setTimeout(() => {
                if (gameData && Array.isArray(gameData.figs) && gameData.figs.some(fig => fig.status === "pending")) {
                    redirectTo("/factory");
                } else {
                    redirectTo("/resultaat");
                }
            }, 400);
        }
    }

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

    async function addToOrdenedFigs(setId, themeId) {
        console.log("fig:", currentFig && currentFig.name, "set:", setId, "theme:", themeId);
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        await fetch(`${langPrefix}/orden-fig`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fig: currentFig.name,
                set: setId,
                theme: themeId
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

    init();

    function showFloatingScore(targetEl, value, direction = "up") {
        const score = document.createElement("div");
        score.className = "floating-score" + (value.startsWith('-') ? " minus" : "");
        score.textContent = value;
        document.body.appendChild(score);

        const rect = targetEl.getBoundingClientRect();
        score.style.left = `${rect.left + rect.width / 2}px`;
        score.style.top = `${rect.top + rect.height / 2}px`;

        score.classList.add(direction === "up" ? "float-up" : "float-down");

        setTimeout(() => {
            score.remove();
        }, 2000);
    }

    function animateFigToTarget(figEl, targetEl, cb) {
        const figRect = figEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const figCenterX = figRect.left + window.scrollX + figRect.width / 2;
        const figCenterY = figRect.top + window.scrollY + figRect.height / 2;
        const targetCenterX = targetRect.left + window.scrollX + targetRect.width / 2;
        const targetCenterY = targetRect.top + window.scrollY + targetRect.height / 2;

        const deltaX = targetCenterX - figCenterX;
        const deltaY = targetCenterY - figCenterY;

        figEl.style.position = "absolute";
        figEl.style.zIndex = 10000;
        figEl.style.left = `${figRect.left + window.scrollX}px`;
        figEl.style.top = `${figRect.top + window.scrollY}px`;
        figEl.classList.add("fig-move-anim");

        void figEl.offsetWidth;

        figEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.7)`;
        figEl.style.opacity = "0.5";

        setTimeout(() => {
            figEl.classList.remove("fig-move-anim");
            figEl.style = "";
            if (cb) cb();
        }, 1500);
    }

    function showEmojiFeedback(type) {
        let emoji = type === "juist" ? "✅" : "❌";
        let feedback = document.getElementById("emoji-feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.id = "emoji-feedback";
            feedback.className = "emoji-feedback";
            document.body.appendChild(feedback);
        }
        feedback.textContent = emoji;
        feedback.classList.add("show");
        setTimeout(() => {
            feedback.classList.remove("show");
        }, 1200);
    }

    const otherRadio = document.querySelector('input[name="reason"][value="other"]');
    const otherReasonWrapper = document.getElementById('otherReasonWrapper');
    const allReasonRadios = document.querySelectorAll('input[name="reason"]');
    if (otherRadio && otherReasonWrapper) {
        allReasonRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (otherRadio.checked) {
                    otherReasonWrapper.style.display = 'inline';
                } else {
                    otherReasonWrapper.style.display = 'none';
                }
            });
        });
    }
});