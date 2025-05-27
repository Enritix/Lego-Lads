function openInfoPopup() {
    document.getElementById("info-popup").style.display = "block";

}

function closePopup() {
    document.getElementById("info-popup").style.display = "none";
}

function getLangPrefix() {
    const match = window.location.pathname.match(/^\/(en|nl)\b/);
    return match ? `/${match[1]}` : '';
}

function ordenFig(fig, set, status) {
    fetch(getLangPrefix() + "/orden-fig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fig: {
                name: fig?.alt,
                img: fig?.src
            },
            set: set,
            status: status
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const sets = document.getElementById("sets");
    const leftArrow = document.getElementById("left");
    const rightArrow = document.getElementById("right");

    const scrollAmount = sets.clientWidth;

    rightArrow.addEventListener("click", function () {
        sets.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
    leftArrow.addEventListener("click", function () {
        sets.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlayOrdenen");
    const popup = document.getElementById("reasonPopUp");
    const vernietigButton = document.getElementById("vernietigKnop");
    const closeButton = document.getElementById("closePopUp");

    if (vernietigButton && overlay && popup) {
        vernietigButton.addEventListener("click", function () {
            overlay.style.display = "block";
            popup.style.display = "block"; 
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            overlay.style.display = "none"; 
            popup.style.display = "none";   
        });
    }
    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const skipButton = document.getElementById("skipButton");
    const figKeuze = document.getElementById("figKeuze");
    const vernietigButton = document.getElementById("vernietigKnop");
    const setsList = document.getElementById("sets");

    function updateCoins(minCoins) {
        fetch(getLangPrefix() + "/update-coins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ coins: minCoins })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert("Kon geen munten aftrekken: " + (data.error || data.message));
            }
        })
        .catch(() => alert("Er is een fout opgetreden bij het updaten van de munten."));
    }

    if (setsList) {
        setsList.querySelectorAll("li").forEach(function (li) {
            li.addEventListener("click", function (e) {
                const setCode = li.getAttribute("data-set");
                ordenFig(figKeuze, setCode, "gesorteerd");
                updateCoins(100);

                if (figKeuze) figKeuze.classList.add("hidden");
                setTimeout(() => {
                    if (figKeuze) figKeuze.style.display = "none";
                }, 1000);
                setTimeout(() => {
                    window.location.href = "/factory";
                }, 500);
            });
        });
    }

    if (skipButton) {
        skipButton.addEventListener("click", function () {
            updateCoins(-100);
            ordenFig(figKeuze, null, "overgeslagen");

            if (figKeuze) figKeuze.classList.add("hidden");
            setTimeout(() => {
                if (figKeuze) figKeuze.style.display = "none";
            }, 1000);
            setTimeout(() => {
                window.location.href = "/factory";
            }, 500);
        });
    }

    if (vernietigButton) {
        vernietigButton.addEventListener("click", function () {
            updateCoins(-100);
            ordenFig(figKeuze, null, "vernietigd");
            fetch(getLangPrefix() + "/bin-fig", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fig: {
                    name: figKeuze?.alt,
                    img: figKeuze?.src
                },
                reason: "weggegooid"
            })
        });
        });
    }


});

document.addEventListener("DOMContentLoaded", async function () {
    async function getGameData() {
       try {
            const langMatch = window.location.pathname.match(/^\/(nl|en)/);
            const langPrefix = langMatch ? langMatch[0] : '/nl';
            const response = await fetch(`${langPrefix}/get-game-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.success) return data.gameData;
        } catch (err) {
            console.error('Kon game data niet ophalen:', err);
        }
        return null;
    }

    function findFirstPendingFig(figs) {
        return figs.find(f => f.status === "pending");
    }

    function getRandomSets(allSets, correctSet) {
        const otherSets = allSets.filter(s => s !== correctSet);
        const shuffled = otherSets.sort(() => 0.5 - Math.random());
        const randomTwo = shuffled.slice(0, 2);
        return [...randomTwo, correctSet].sort(() => 0.5 - Math.random());
    }

    function showFigAndSets(fig, sets) {
        const figKeuze = document.getElementById("figKeuze");
        figKeuze.src = fig.img;
        figKeuze.alt = fig.name;

        const setsList = document.getElementById("sets");
        setsList.innerHTML = "";
        sets.forEach(set => {
            const li = document.createElement("li");
            li.setAttribute("data-set", set);
            li.textContent = set;
            setsList.appendChild(li);
        });
    }

    async function checkGameStatusAndRedirect() {
        const data = await getGameData();
        const hasPending = data.figs.some(f => f.status === "pending");
        if (!hasPending) {
            await fetch(getLangPrefix() + "/api/game-completed", { method: "POST" });
            window.location.href = "/resultaat";
        } else {
            window.location.href = "/factory";
        }
    }

    const data = await getGameData();
    const pendingFig = findFirstPendingFig(data.figs);
    if (!pendingFig) {
        window.location.href = "/resultaat";
        return;
    }

    const allSets = data.allSets;
    const sets = getRandomSets(allSets, pendingFig.set);

    showFigAndSets(pendingFig, sets);

    document.querySelectorAll("#sets li").forEach(li => {
        li.addEventListener("click", async function () {
            const gekozenSet = li.getAttribute("data-set");
            const juist = gekozenSet === pendingFig.set;
            await fetch(getLangPrefix() + "/api/update-fig-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    figName: pendingFig.name,
                    status: juist ? "sorted" : "wrong",
                    date: new Date().toISOString()
                })
            });
            updateCoins(juist ? 100 : -100);
            await checkGameStatusAndRedirect();
        });
    });

    document.getElementById("skipButton").addEventListener("click", async function () {
        await fetch(getLangPrefix() + "/api/update-fig-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                figName: pendingFig.name,
                status: "skipped",
                date: new Date().toISOString()
            })
        });
        updateCoins(-100);
        await checkGameStatusAndRedirect();
    });

    document.getElementById("vernietigKnop").addEventListener("click", async function () {
        await fetch(getLangPrefix() + "/api/update-fig-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                figName: pendingFig.name,
                status: "sorted",
                date: new Date().toISOString()
            })
        });
        await fetch(getLangPrefix() + "/bin-fig", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fig: { name: pendingFig.name, img: pendingFig.img },
                reason: "weggegooid"
            })
        });
        updateCoins(-100);
        await checkGameStatusAndRedirect();
    });
});


