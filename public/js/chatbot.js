async function sendMessage() {
    let inputField = document.getElementById("user-input");
    let message = inputField.value.trim();
    if (message === "") return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<article class='message user-message'><p class='text'>${message}</p><img src='../assets/images/sad-face.png' alt='User Avatar' class='avatar'></article>`;
    inputField.value = "";

    let botReply = await getBotResponse(message);
    chatBox.innerHTML += `<article class='message bot-message'><img src='../assets/images/bot.png' alt='Bot Avatar' class='avatar'><p class='text'>${botReply}</p></article>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotResponse(input) {
    try {
        const langPrefix = window.location.pathname.split('/')[1];
        const apiUrl = `/${langPrefix}/chatbot/send`;
        console.log("👉 API URL:", apiUrl);

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });

        const resText = await res.text();
        let data;
        try {
            data = JSON.parse(resText);
        } catch (err) {
            return "De server gaf geen geldig antwoord terug.";
        }

        return data.reply || "Ik kon geen antwoord ophalen .";
    } catch (error) {
        console.error(error);
        return "Er ging iets mis bij de AI.";
    }
}

