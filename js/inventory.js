document.addEventListener("DOMContentLoaded", function () {
    const chestProducts = document.getElementById("chest-products");
    
    chestProducts.scrollLeft = 0;

    document.getElementById("scroll-left").addEventListener("click", function () {
        chestProducts.scrollBy({ left: -200, behavior: "smooth" });
    });

    document.getElementById("scroll-right").addEventListener("click", function () {
        chestProducts.scrollBy({ left: 200, behavior: "smooth" });
    });
});
