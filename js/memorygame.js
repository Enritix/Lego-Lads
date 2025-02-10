document.addEventListener("DOMContentLoaded", async () => {
    const apiKey = "7138b5e205e720e8eb6b839cd6971e37";
    const dataType = "minifigs";
    let correctTries = 0;
    let incorrectTries = 0;
    let matchedPairs = 0;
    const totalPairs = 8;
    
    const gameContainer = document.createElement("div");
    gameContainer.id = "memory-game";
    document.querySelector(".container").appendChild(gameContainer);
    
    const correctCounter = document.createElement("p");
    correctCounter.id = "correct-counter";
    correctCounter.textContent = `Correct: 0`;
    document.querySelector(".container").appendChild(correctCounter);

    const incorrectCounter = document.createElement("p");
    incorrectCounter.id = "incorrect-counter";
    incorrectCounter.textContent = `Incorrect: 0`;
    document.querySelector(".container").appendChild(incorrectCounter);

    async function fetchLegoData() {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const apiUrl = `https://rebrickable.com/api/v3/lego/${dataType}/?page_size=8&page=${randomPage}`;
        try {
            const response = await fetch(apiUrl, {
                headers: { Authorization: `key ${apiKey}` }
            });
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(`Error fetching Lego ${dataType}:`, error);
            return [];
        }
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createGameBoard(items) {
        gameContainer.innerHTML = "";
        correctTries = 0;
        incorrectTries = 0;
        matchedPairs = 0;
        correctCounter.textContent = `Correct: 0`;
        incorrectCounter.textContent = `Incorrect: 0`;

        let cards = items.flatMap(item => [{ id: item.set_num, img: item.set_img_url }, { id: item.set_num, img: item.set_img_url }]);
        cards = shuffle(cards);
        
        cards.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.id = item.id;
            
            const front = document.createElement("div");
            front.classList.add("front");
            front.style.backgroundImage = `url(${item.img})`;
            
            const back = document.createElement("div");
            back.classList.add("back");
            
            card.appendChild(front);
            card.appendChild(back);
            gameContainer.appendChild(card);
        });
    }

    function addCardClickHandlers() {
        let flippedCards = [];

        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", () => {
                if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
                    card.classList.add("flipped");
                    flippedCards.push(card);
                }
                if (flippedCards.length === 2) {
                    setTimeout(() => {
                        if (flippedCards[0].dataset.id === flippedCards[1].dataset.id) {
                            flippedCards.forEach(c => c.classList.add("matched"));
                            matchedPairs++;
                            correctTries++;
                            correctCounter.textContent = `Correct: ${correctTries}`;
                            if (matchedPairs === totalPairs) {
                                openPopup();
                            }
                        } else {
                            flippedCards.forEach(c => c.classList.remove("flipped"));
                            incorrectTries++;
                            incorrectCounter.textContent = `Incorrect: ${incorrectTries}`;
                        }
                        flippedCards = [];
                    }, 1000);
                }
            });
        });
    }

    function openPopup() {
        const popup = document.getElementById("popup");
        popup.style.display = "flex";

        const confettiScript = document.createElement("script");
        confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.1";
        confettiScript.onload = () => {
            confetti({
                particleCount: 150,
                spread: 150,
                origin: { y: 0.6 }
            });
        };
        document.body.appendChild(confettiScript);
    }

    document.getElementById("new-game-btn").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
        loadGame();
    });

    document.getElementById("main-menu-btn").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none"
        window.location.href = "../index.html";
    });

    async function loadGame() {
        const items = await fetchLegoData();
        if (items.length) {
            createGameBoard(items);
            addCardClickHandlers();
        }
    }

    loadGame();
});
