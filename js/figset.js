function openInfoPopup() {
    document.getElementById("info-popup").style.display = "block";

}

function closePopup() {
    document.getElementById("info-popup").style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("set-figs");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    let scrollAmount = 0;
    const scrollStep = 120; 

    next.addEventListener("click", function () {
        scrollAmount += scrollStep;
        list.style.transform = `translateX(-${scrollAmount}px)`;
    });

    prev.addEventListener("click", function () {
        scrollAmount -= scrollStep;
        if (scrollAmount < 0) scrollAmount = 0; 
        list.style.transform = `translateX(-${scrollAmount}px)`;
    });
});
