document.addEventListener("DOMContentLoaded", function () {
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

    //Abe: code voor profile fig te kiezen
    const buttons = document.querySelectorAll(".select-button");
    const navImgs = document.querySelectorAll(".nav-fig");
  
    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const newImg = button.dataset.img;
        if (newImg) { 
          navImgs.forEach((img) => {
            img.src = newImg;
          });
  
          try {
            const lang = window.location.pathname.split("/")[1];
            const response = await fetch(`/${lang}/set-profiel-fig`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include", 
            body: JSON.stringify({ img: newImg })
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error("fout:", errorText);
            return;
          }

          const result = await response.json();
          console.log("Profielfiguur opgeslagen:", result);
          } catch (error) {
            console.error("Fout bij opslaan van profielfiguur:", error);
          }
        }
      });
    });

     // Abe: code coor chest meegeven +check op key en chest zo niet class + disabled = opacety 0.2 -> css/inventory.css
      const buyButtons = Array.from(document.querySelectorAll(".buy-btn"));
    
      buyButtons.forEach((button) => {
        const chestCount = parseInt(button.getAttribute("data-count"), 10);
        const keyCount = parseInt(button.getAttribute("data-keys"), 10);
    
        if (chestCount <= 0 || keyCount <= 0) {
          button.disabled = true;
          button.classList.add("disabled"); 
        } else {
          button.addEventListener("click", () => {
            const chestType = button.getAttribute("data-chest");
            if (chestType) {
                    //ABbe:  encodeURIComponent is voor url tekens te generen zo dat de jkuist pege geladen word 
              window.location.href = `/chest?type=${encodeURIComponent(chestType)}`;
            }
          });
        }
      });
    });

  
  