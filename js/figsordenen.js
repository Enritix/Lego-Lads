function openInfoPopup() {
    document.getElementById("info-popup").style.display = "block";

}

function closePopup() {
    document.getElementById("info-popup").style.display = "none";
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
