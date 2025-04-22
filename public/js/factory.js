document.addEventListener("DOMContentLoaded", () => {
    // Desktop version
    const factoryMachineDesktop = document.getElementById("factory-machine-container-desktop");
    const minifigures = document.getElementById("minifigures-desktop");
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
                });

                setTimeout(() => {
                    factoryDoorContainer.style.display = 'none';
                }, 2000);
            }, 3000);
        }, 500);
    }

    function startFactoryBeltAnimation() {
        minifigures.style.animation = "activateFactoryBelt 7s ease-in-out forwards";
        gears.forEach(gear => {
            gear.style.animation = "rotate 7s linear";
        });

        minifigures.addEventListener("animationend", () => {
            setTimeout(() => {
                window.location.href = "/figordenen";
            }, 1000);
        });
    }

    // Mobile version
    const minifiguresMobile = document.getElementById("minifigures-mobile");
    const gearsMobile = document.querySelectorAll(".factory-belt-gear-mobile");

    minifiguresMobile.addEventListener("animationend", () => {
        gearsMobile.forEach(gear => {
            gear.style.animation = "none";
            setTimeout(() => {
                window.location.href = "/figordenen";
            }, 1000);
        });
    });
});