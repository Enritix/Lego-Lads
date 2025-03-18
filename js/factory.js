document.addEventListener("DOMContentLoaded", () => {
    const minifigures = document.getElementById("minifigures");
    const gears = document.querySelectorAll(".factory-belt-gear");

    minifigures.addEventListener("animationend", () => {
        gears.forEach(gear => {
            gear.style.animation = "none";
        });
    });
});