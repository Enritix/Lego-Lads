document.addEventListener("DOMContentLoaded", function () {
    function typeText(element, callback) {
        const text = element.dataset.text;
        element.innerText = "";
        let index = 0;
        let speed = 50;
        let fastSpeed = false;

        function type() {
            if (index < text.length) {
                element.innerHTML += text[index] === ' ' ? '&nbsp;' : text[index];
                index++;
                setTimeout(type, fastSpeed ? 10 : speed);
            } else {
                if (callback) setTimeout(callback, 500);
            }
        }
        element.style.visibility = "visible";
        type();

        document.addEventListener("keydown", function (event) {
            if (event.code === "Space") {
                fastSpeed = true;
            }
        });

        document.addEventListener("keyup", function (event) {
            if (event.code === "Space") {
                fastSpeed = false;
            }
        });
    }

    const textElement1 = document.getElementById("textbubble-text1");
    const textElement2 = document.getElementById("textbubble-text2");

    const langMatch = window.location.pathname.match(/^\/(nl|en)/);
    const isDutch = !langMatch || langMatch[1] === "nl";

    if (isDutch) {
        textElement1.dataset.text = "Hallo! Welkom in de Lego Minifiguur fabriek!";
        textElement2.dataset.text = "Help jij mij om de figuurtjes in de \njuiste sets te sorteren?";
    } else {
        textElement1.dataset.text = "Hello! Welcome to the Lego Minifigure \nfactory!";
        textElement2.dataset.text = "Will you help me sort the figures into the \ncorrect sets?";
    }

    textElement2.style.visibility = "hidden";

    typeText(textElement1, function () {
        typeText(textElement2, function () {
            const submitButton = document.getElementById("submit-button");
            const submitLabel = document.getElementById("submit-label");
            submitButton.style.visibility = "visible";
            submitLabel.style.visibility = "visible";
        });
    });
});