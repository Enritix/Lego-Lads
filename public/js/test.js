console.log('hallo')
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
        console.log("✅ Profiel fig opgeslagen:", result);
    } catch (error) {
        console.error("❌ Fout bij opslaan profiel fig:", error);
    }
    }
});
});