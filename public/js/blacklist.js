document.addEventListener('DOMContentLoaded', function () {
const redenOverlay = document.getElementById("redenOverlay");
const popup = document.getElementById("reasonPopUp");

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
        window.location.reload();
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

  const redenPopup = document.getElementById('reasonPopUp');
document.querySelectorAll('.reason-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    redenPopup.style.display = 'block';
    redenOverlay.style.display = "block";
  });
});
document.querySelector('.close-reden').addEventListener('click', () => {
  redenPopup.style.display = 'none';
});
// window.addEventListener('click', (event) => {
//   if (event.target === redenPopup) {
//     redenPopup.style.display = 'none';
//   }
// });

  // const redenPopup = document.getElementById('reden-popup');
  // document.querySelector('.reason-btn').addEventListener('click', () => {
  //   redenPopup.style.display = 'flex';
  // });

  document.getElementById('closePopUp').addEventListener('click', () => {
    redenPopup.style.display = 'none';
    redenOverlay.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target === redenPopup) {
      redenPopup.style.display = 'none';
    }
  });

  const otherRadio = document.querySelector('input[name="reason"][value="other"]');
  const otherReasonWrapper = document.getElementById('otherReasonWrapper');
  const allReasonRadios = document.querySelectorAll('input[name="reason"]');
  if (otherRadio && otherReasonWrapper) {
    allReasonRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (otherRadio.checked) {
          otherReasonWrapper.style.display = 'inline';
        } else {
          otherReasonWrapper.style.display = 'none';
        }
      });
    });
  }

  async function updateReason(figName, reason) {
  const langMatch = window.location.pathname.match(/^\/(nl|en)/);
  const langPrefix = langMatch ? langMatch[0] : '/nl';
  const response = await fetch(`${langPrefix}/update-minifig-reason`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fig: figName, reason })
  });
  return await response.json();
}

let selectedFigName = null;

document.querySelectorAll(".reason-btn").forEach(button => {
  button.addEventListener("click", function () {
    const figName = this.closest(".blacklist-item").querySelector(".figure h2").textContent;
    selectedFigName = figName;
    redenOverlay.style.display = "block";
    popup.style.display = "block";
  });
});

document.getElementById("closePopUp").addEventListener("click", async function (event) {
  event.preventDefault();
  redenOverlay.style.display = "none";
  const selectedRadio = document.querySelector('input[name="reason"]:checked');
  let reason = selectedRadio ? selectedRadio.value : "";
  if (reason === "other") {
    const otherInput = document.querySelector('#otherReasonWrapper input');
    reason = otherInput ? otherInput.value : "";
  }

  if (!selectedFigName || !reason) {
    alert("Selecteer een reden of vul een reden in.");
    return;
  }

  const result = await updateReason(selectedFigName, reason);
  if (result.success) {
    window.location.reload();
  } else {
    alert("Reden aanpassen mislukt: " + (result.message || "Onbekende fout"));
  }
});

document.querySelectorAll(".reason-btn").forEach(button => {
  button.addEventListener("click", function () {
    redenOverlay.style.display = "block";
    popup.style.display = "block";
  });
});

document.getElementById("closePopUp").addEventListener("click", function (event) {
  event.preventDefault();
  redenOverlay.style.display = "none";
  popup.style.display = "none";
});

// Ook sluiten als je op de overlay zelf klikt:
redenOverlay.addEventListener("click", function () {
  redenOverlay.style.display = "none";
  popup.style.display = "none";
});
});






// document.addEventListener("DOMContentLoaded", function () {
//   const overlay = document.createElement("div");
//   overlay.id = "overlayOrdenen";
//   overlay.style.position = "relative";
//   overlay.style.top = "0";
//   overlay.style.left = "0";
//   overlay.style.width = "100vw";
//   overlay.style.height = "100vh";
//   overlay.style.background = "rgba(0, 0, 0, 0.5)";
//   overlay.style.display = "none";
//   overlay.style.zIndex = "1";
//   document.body.appendChild(overlay);

//   const popup = document.getElementById("reasonPopUp");
//   const vernietigButtons = document.querySelectorAll(".reason-btn");
//   const closeButton = document.getElementById("closePopUp");
//   vernietigButtons.forEach(button => {
//     button.addEventListener("click", function () {
//       console.log("🔹 REDEN knop geklikt!");
//       overlay.style.display = "block";
//       popup.style.display = "block";
//     });
//   });


//   if (closeButton) {
//     closeButton.addEventListener("click", function (event) {
//       event.preventDefault();
//       overlay.style.display = "none";
//       popup.style.display = "none";
//       window.location.href = "/blacklist";
//     });
//   }
//   overlay.addEventListener("click", function () {
//     overlay.style.display = "none";
//     popup.style.display = "none";
//   });
// });

