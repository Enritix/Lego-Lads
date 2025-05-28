const startSpinnerBtn = document.getElementById("startSpinner");


let chestFigs = [];

const chestType = document.getElementById("chestType")?.value;
const langPrefix = window.location.pathname.split("/")[1]; 


fetch(`/${langPrefix}/api/get-chest-contents`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ type: chestType }),
  credentials: "include"
})

  .then(res => res.json())
  .then(data => {
    if (data.success) {
      chestFigs = data.figs;
      console.log("Ontvangen figuren uit backend:", data.figs);

      animation.setFigs(chestFigs);

      const spinnerList = document.getElementById("spinnerList");
      spinnerList.innerHTML = ""; // leegmaken

      chestFigs.forEach(fig => {
        const li = document.createElement("li");
        li.classList.add("spinner-items__item");

        // Voeg kleur toe op basis van rarity
        if (fig.rarity === "gewoon") li.classList.add("green");
        else if (fig.rarity === "episch") li.classList.add("purple");
        else if (fig.rarity === "legendarisch") li.classList.add("gold");

        // Voeg figuur toe
        const img = document.createElement("img");
        img.src = fig.img;
        img.alt = fig.name;
        li.appendChild(img);
        spinnerList.appendChild(li);
      });
    } else {
      alert("Kon chest-inhoud niet laden.");
    }
  })
  .catch(err => {
    console.error("Fout bij ophalen chest-inhoud:", err);
    alert("Er ging iets mis bij het ophalen van de chest.");
  });

class SpinnerAnimation {
  constructor({ container, list }) {
    this.tickSound = new Audio("../assets/audio/open.mp3");
    this.tickSound.playbackRate = 4;
    this.winSound = new Audio("../assets/audio/win.mp3");

    this.spinnerContainer = document.getElementById(container);
    this.spinnerList = document.getElementById(list);
    this.spinnerItems = this.spinnerList.children;
    this.spinnerMarker = document.querySelector(".spinner__marker");

    this.dynamicFigs = [];

    this.reset();
  }

  setFigs(figs) {
    this.dynamicFigs = figs;
  }

  reset() {
    this.started = false;
    this.stopped = false;
    this.stopAnimation = false;
    this.speed = 50;
    this.offset = 0;
    this.ticks = 0;
    this.winningItem = 0;
  }

  start(speed = 1200) {
    if (this.started) return;
    this.reset();
    this.started = true;
    this.speed = speed;
    this.loop();
  }

  loop() {
    let lastTime = 0;
    const frame = (time) => {
      if (!this.started) return;

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      this.offset += this.speed * dt * 10;
      this.spinnerList.style.transform = `translateX(-${this.offset}px)`;

      if (this.offset >= 122) {
        this.offset = 0;
        this.spinnerList.appendChild(this.spinnerList.firstElementChild);
        this.tickSound.play();
        this.ticks++;

        if (this.ticks > 15 && Math.random() > 0.6) {
          this.stop();
        }
      }

      if (this.stopped) {
        this.speed -= 2;

        if (this.speed <= 0) {
          this.speed = 0;
          this.stopAnimation = true;
          this.pickWinner();
        }
      }

      if (!this.stopAnimation) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }

  stop() {
    this.stopped = true;
  }

  pickWinner() {
    const markerRect = this.spinnerMarker.getBoundingClientRect();
    let winningItem = null;

    Array.from(this.spinnerItems).forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      if (
        itemRect.left < markerRect.right &&
        itemRect.right > markerRect.left
      ) {
        winningItem = item;
      }
    });

    let winningColor = "unknown";
    if (winningItem.classList.contains("green")) winningColor = "green";
    if (winningItem.classList.contains("purple")) winningColor = "purple";
    if (winningItem.classList.contains("gold")) winningColor = "gold";

    const rarity = winningColor === "green" ? "gewoon" :
                   winningColor === "purple" ? "episch" :
                   winningColor === "gold" ? "legendarisch" : "";

    const figsInColor = this.dynamicFigs.filter(fig => fig.rarity === rarity);
    const winningFig = figsInColor[Math.floor(Math.random() * figsInColor.length)];

    if (winningFig) {
      this.winSound.play();
      showPopup(winningFig.name, winningFig.img, winningColor);
    fetch(`/${langPrefix}/api/open-chest`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        type: chestType,
        fig: winningFig
    }),
    credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log("Figuur toegevoegd:", data.addedFig);
          } else {
            alert("Fout: " + data.message);
          }
        });
    }
  }
}

function showPopup(name, imageSrc, rarity) {
  const winName = document.getElementById("winName");
  const winImage = document.getElementById("winImage");
  const winPopup = document.getElementById("winPopup");
  const overlay = document.getElementById("overlayChest");

  winName.textContent = name;
  winImage.src = imageSrc;

  const colorMap = {
    gewoon: "green",
    episch: "blueviolet",
    legendarisch: "gold"
  };

  winImage.style.border = `5px solid ${colorMap[rarity] || "white"}`;
  overlay.style.display = "block";
  winPopup.style.display = "flex";
}

function closePopup() {
  document.getElementById("winPopup").style.display = "none";
  document.getElementById("overlayChest").style.display = "none";
}

startSpinnerBtn.addEventListener("click", () => animation.start());
const animation = new SpinnerAnimation({ container: "spinnerContainer", list: "spinnerList" });