document.addEventListener("DOMContentLoaded", function () {
    console.log("Inventory.js is geladen");
  

    const chestProducts = document.getElementById("chest-products");
    if (chestProducts) {
      chestProducts.scrollLeft = 0;
  
      document.getElementById("scroll-left")?.addEventListener("click", function () {
        chestProducts.scrollBy({ left: -200, behavior: "smooth" });
      });
  
      document.getElementById("scroll-right")?.addEventListener("click", function () {
        chestProducts.scrollBy({ left: 200, behavior: "smooth" });
      });
    }
    window.openInfoPopup = function () {
      document.getElementById("info-popup").style.display = "block";
    };
  
    window.closePopup = function () {
      document.getElementById("info-popup").style.display = "none";
    };

    const buttons = document.querySelectorAll(".select-button");
    const navImg = document.getElementById("nav-fig");

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const newImg = button.dataset.img;
        if (newImg && navImg) {
          navImg.src = newImg;
  
          try {
            const response = await fetch("/set-profiel-fig", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ img: newImg })
            });
  
            const result = await response.json();
            console.log("Profielfig opgeslagen:", result);
          } catch (error) {
            console.error("Fout profiel fig:", error);
          }
        }
      });
    });
  });
  