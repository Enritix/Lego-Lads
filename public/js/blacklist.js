document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', async function () {
      this.parentElement.remove();

      try {
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const response = await fetch(`${langPrefix}/delete-minifig`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ minifig: this.parentElement.querySelector(".figure h2").textContent })
        });

        const result = await response.json();
        console.log("Minifig verwijderd:", result);
      } catch (error) {
        console.error("Fout bij verwijderen van minifig:", error);
      }
    });
  });

  const infoPopup = document.getElementById('info-popup');
  document.querySelector('.info-icon').addEventListener('click', () => {
    infoPopup.style.display = 'flex';
  });

  document.querySelector('.close-button').addEventListener('click', () => {
    infoPopup.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === infoPopup) {
      infoPopup.style.display = 'none';
    }
  });

  //Reden

  const redenPopup = document.getElementById('reden-popup');
  document.querySelector('.reason-btn').addEventListener('click', () => {
    redenPopup.style.display = 'flex';
  });

  document.querySelector('.close-reden').addEventListener('click', () => {
    redenPopup.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === redenPopup) {
      redenPopup.style.display = 'none';
    }
  });
});






document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.createElement("div");
  overlay.id = "overlayOrdenen";
  overlay.style.position = "relative";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "none";
  overlay.style.zIndex = "1";
  document.body.appendChild(overlay);

  const popup = document.getElementById("reasonPopUp");
  const vernietigButtons = document.querySelectorAll(".reason-btn");
  const closeButton = document.getElementById("closePopUp");
  vernietigButtons.forEach(button => {
    button.addEventListener("click", function () {
      console.log("🔹 REDEN knop geklikt!");
      overlay.style.display = "block";
      popup.style.display = "block";
    });
  });


  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      overlay.style.display = "none";
      popup.style.display = "none";
      window.location.href = "/blacklist";
    });
  }
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    popup.style.display = "none";
  });
});

