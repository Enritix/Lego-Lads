document.addEventListener("DOMContentLoaded", () => {
    const minifigures = document.getElementById("minifigures-desktop");
    const gears = document.querySelectorAll(".factory-belt-gear-desktop");

    minifigures.addEventListener("animationend", () => {
        gears.forEach(gear => {
            gear.style.animation = "none";
            setTimeout(() => {
                window.location.href = "figordenen.html";
            }, 1000);
        });
    });

    const minifiguresMobile = document.getElementById("minifigures-mobile");
    const gearsMobile = document.querySelectorAll(".factory-belt-gear-mobile");

    minifiguresMobile.addEventListener("animationend", () => {
        gearsMobile.forEach(gear => {
            gear.style.animation = "none";
            setTimeout(() => {
                window.location.href = "figordenen.html";
            }, 1000);
        });
    });
});