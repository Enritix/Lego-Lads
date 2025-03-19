document.addEventListener("DOMContentLoaded", function () {
    function typeText(element, callback) {
        const text = element.dataset.text;
        element.innerText = "";
        let index = 0;
        const speed = 50;

        function type() {
            if (index < text.length) {
                element.innerHTML += text[index] === ' ' ? '&nbsp;' : text[index];
                index++;
                setTimeout(type, speed);
            } else {
                if (callback) setTimeout(callback, 500);
            }
        }
        element.style.visibility = "visible";
        type();
    }

    const textElement1 = document.getElementById("textbubble-text1");
    const textElement2 = document.getElementById("textbubble-text2");

    textElement1.dataset.text = "Hallo! Welkom in de Lego\nMinifiguur fabriek!";
    textElement2.dataset.text = "Help jij mij om de figuurtjes in de juiste sets te sorteren?";

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
