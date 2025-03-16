
const names = {
    green: ['pirate', 'artic', 'raddus'],
    purple: ['artic2', 'artic3', 'agent'],
    gold: ['anakin', 'chen', 'cinder']
};

const images = {
    pirate: './assets/images/pirate.png',
    artic: './assets/images/artic.png',
    raddus: './assets/images/raddus.png',
    artic2: './assets/images/artic2.png',
    artic3: './assets/images/artic3.png',
    agent: './assets/images/agent.png',
    anakin: './assets/images/anakin.png',
    chen: './assets/images/chen.png',
    cinder: './assets/images/cinder.png'
};

class SpinnerAnimation {
    constructor({container, list}) {
        this.tickSound = new Audio("./assets/audio/open.mp3");
        this.tickSound.playbackRate = 4;
        this.winSound = new Audio("./assets/audio/win.mp3");

        this.spinnerContainer = document.getElementById(container);
        this.spinnerList = document.getElementById(list);
        this.spinnerItems = this.spinnerList.children;
        this.spinnerMarker = document.querySelector(".spinner__marker");

        this.reset();
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
        const itemsArray = Array.from(this.spinnerItems);
        const middleIndex = Math.floor(itemsArray.length / 2);
        const winningItem = itemsArray[middleIndex];

        let winningColor = "unknown";
        if (winningItem.classList.contains("green")) winningColor = "green";
        if (winningItem.classList.contains("purple")) winningColor = "purple";
        if (winningItem.classList.contains("gold")) winningColor = "gold";

        const winningName = names[winningColor][Math.floor(Math.random() * names[winningColor].length)];
        const winningImageSrc = images[winningName] || "./assets/images/blackfig.png";

        this.winSound.play();
        showPopup(winningName, winningImageSrc, winningColor);
    }
}

function showPopup(name, imageSrc, color) {
    const winName = document.getElementById("winName");
    const winImage = document.getElementById("winImage");
    const winPopup = document.getElementById("winPopup");
    const overlay = document.getElementById("overlay");

    winName.textContent = name;
    winImage.src = imageSrc;

    const colorMap = {
        green: "green",
        purple: "blueviolet",
        gold: "gold"
    };
    winImage.style.border = `5px solid ${colorMap[color] || "white"}`;
    overlay.style.display = "block";
    winPopup.style.display = "flex";
}

function closePopup() {
    document.getElementById("winPopup").style.display = "none";
    document.getElementById("overlay").style.display = "none"; 
}
const startSpinnerBtn = document.getElementById("startSpinner");
const animation = new SpinnerAnimation({ container: "spinnerContainer", list: "spinnerList" });

startSpinnerBtn.addEventListener("click", () => animation.start());

document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
    
    const infoIcon = document.querySelector(".bi-info-circle");
    const closeButton = document.createElement("button");
    closeButton.textContent = "✖";
    closeButton.classList.add("close-btn");
    popup.appendChild(closeButton);
    
    infoIcon.addEventListener("click", function () {
        popup.classList.add("active");
        overlay.classList.add("active");
    });

    closeButton.addEventListener("click", function () {
        popup.classList.remove("active");
        overlay.classList.remove("active");
    });

    overlay.addEventListener("click", function () {
        popup.classList.remove("active");
        overlay.classList.remove("active");
    });
});
