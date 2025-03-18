document.addEventListener("DOMContentLoaded", () => {
    const minifigures = document.getElementById("minifigures-desktop");
    const gears = document.querySelectorAll(".factory-belt-gear-desktop");

    minifigures.addEventListener("animationend", () => {
        gears.forEach(gear => {
            gear.style.animation = "none";
        });
    });

    const minifiguresMobile = document.getElementById("minifigures-mobile");
    const gearsMobile = document.querySelectorAll(".factory-belt-gear-mobile");

    minifiguresMobile.addEventListener("animationend", () => {
        gearsMobile.forEach(gear => {
            gear.style.animation = "none";
        });
    });
});