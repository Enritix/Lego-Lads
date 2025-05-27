document.addEventListener("DOMContentLoaded", async () => {
    // Desktop version
    const factoryMachineDesktop = document.getElementById("factory-machine-container-desktop");
    const minifiguresDesktop = document.getElementById("minifigures-desktop");
    const gears = document.querySelectorAll(".factory-belt-gear-desktop");
    const factoryDoor = document.getElementById('factory-door');
    const factoryDoorControlsSmall = document.getElementById('factory-door-controls-small');
    const factoryDoorControlsLarge = document.getElementById('factory-door-controls-large');
    const factoryDoorControlsSmallOpen = document.getElementById('factory-door-controls-small-open');
    const factoryDoorControlsLargeOpen = document.getElementById('factory-door-controls-large-open');
    const factoryDoorControlsBackground = document.getElementById('factory-door-controls-background');
    const factoryDoorContainer = document.getElementById('factory-door-container');
    const handCursor = document.getElementById('hand-cursor');
    const doorAudio = document.getElementById('door-audio');

    doorAudio.volume = 0.5;

    if (factoryDoorContainer) factoryDoorContainer.style.display = 'none';

    async function fetchGameData() {
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

    let gameData = await fetchGameData();
    console.log('Game data:', gameData);
    
    if (!gameData || gameData.gameStatus !== "inProgress") {
        // Genereer random figs en haal de nieuwe gameData op
        gameData = await generateRandomFigures();
        if (!gameData) {
            alert("Kon geen nieuwe game data genereren.");
            return;
        }
        if (factoryDoorContainer) factoryDoorContainer.style.display = 'block';

        let handCursorTimer = setTimeout(() => {
            handCursor.style.display = 'block';
        }, 3000);

        factoryDoorControlsSmall.addEventListener('click', () => {
            clearTimeout(handCursorTimer);
            handCursor.style.display = 'none';
            factoryDoorControlsLarge.style.display = 'block';
            factoryDoorControlsBackground.style.display = 'block';
        });

        factoryDoorControlsLarge.addEventListener('click', () => {
            factoryDoorControlsSmall.style.display = 'block';
            factoryDoorControlsBackground.style.display = 'block';

            factoryDoorControlsLarge.style.display = 'none';
            factoryDoorControlsSmallOpen.style.display = 'block';
            factoryDoorControlsLargeOpen.style.display = 'block';

            doorAudio.currentTime = 0;
            doorAudio.play();

            openDoor();
        });

        function openDoor() {
            setTimeout(() => {
                factoryDoorControlsLargeOpen.style.display = 'none';
                factoryDoor.style.animation = 'openDoor 5s forwards';
                factoryDoorControlsBackground.style.display = 'none';

                setTimeout(() => {
                    doorAudio.pause();
                    doorAudio.currentTime = 0;

                    factoryDoorControlsSmallOpen.style.display = 'none';
                    factoryDoorControlsSmall.style.display = 'block';

                    factoryDoorContainer.style.animation = 'zoomIn 5s forwards';

                    factoryDoorContainer.addEventListener("animationend", () => {
                        startFactoryBeltAnimation();
                        addCurrentFigToFactory();
                    });

                    setTimeout(() => {
                        factoryDoorContainer.style.display = 'none';
                    }, 2000);
                }, 3000);
            }, 500);
        }
    } else {
        factoryMachineDesktop.style.display = 'block';
        minifiguresDesktop.style.display = 'block';
        startFactoryBeltAnimation();
        addCurrentFigToFactory();
    }

    function startFactoryBeltAnimation() {
    minifiguresDesktop.style.animation = "activateFactoryBelt 7s ease-in-out forwards";
    gears.forEach(gear => {
        gear.style.animation = "rotate 7s linear";
    });

    minifiguresDesktop.addEventListener("animationend", async () => {
        // const nextFig = gameData.figs.find(fig => fig.status === "pending");
        // if (nextFig) {
        //     const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        //     const langPrefix = langMatch ? langMatch[0] : '/nl';
        //     const response = await fetch(`${langPrefix}/set-current-fig`, {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ fig: { name: nextFig.name, img: nextFig.img } })
        //     }).then(() => {
        //         setTimeout(() => {
        //             window.location.href = "/figordenen";
        //         }, 1000);
        //     });
        // } else {
            setTimeout(() => {
                window.location.href = "/figordenen";
            }, 1000);
        // }
    });
}

    // Mobile version
    const minifiguresMobile = document.getElementById("minifigures-mobile");
    const gearsMobile = document.querySelectorAll(".factory-belt-gear-mobile");

    minifiguresMobile.addEventListener("animationend", async () => {
    // const nextFig = gameData.figs.find(fig => fig.status === "pending");
    // if (nextFig) {
    //         const langMatch = window.location.pathname.match(/^\/(nl|en)/);
    //         const langPrefix = langMatch ? langMatch[0] : '/nl';
    //         const response = await fetch(`${langPrefix}/set-current-fig`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ fig: { name: nextFig.name, img: nextFig.img } })
    //     }).then(() => {
    //         setTimeout(() => {
    //             window.location.href = "/figordenen";
    //         }, 1000);
    //     });
    // } else {
        setTimeout(() => {
            window.location.href = "/figordenen";
        }, 1000);
    // }
});

function addCurrentFigToFactory() {
    const nextFig = gameData.figs.find(fig => fig.status === "pending");
    if (nextFig) {
        if (window.innerWidth > 768) {
            minifiguresDesktop.insertAdjacentHTML(
                "beforeend",
                `<img src="${nextFig.img}" alt="${nextFig.name} Minifigure">`
            );
        } else {
            minifiguresMobile.insertAdjacentHTML(
                "beforeend",
                `<img src="${nextFig.img}" alt="${nextFig.name} Minifigure">`
            );
        }
    }
}

document.querySelectorAll('.fig-choice').forEach(el => {
    el.addEventListener('click', function() {
        const fig = {
            name: this.dataset.name,
            img: this.dataset.img
        };
        fetch('/nl/set-current-fig', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fig })
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
  var minifigDesktop = document.querySelector('#minifigures-desktop img');
  var minifigMobile = document.querySelector('#minifigures-mobile img');
  if ((minifigDesktop && minifigDesktop.src) || (minifigMobile && minifigMobile.src)) {
    setTimeout(function() {
      window.location.href = '/figordenen';
    }, 1200);
  }
});

async function generateRandomFigures() {
    try {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const response = await fetch(`${langPrefix}/set-random-figs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
            // Optioneel: update sessionStorage of een globale variabele als je die gebruikt
            return data.gameData;
        }
    } catch (err) {
        console.error('Kon game data niet ophalen:', err);
    }
    return null;
}

});