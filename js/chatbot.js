function sendMessage() {
    let inputField = document.getElementById("user-input");
    let message = inputField.value.trim();
    if (message === "") return;
    
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<article class='message user-message'><p class='text'>${message}</p><img src='../assets/images/sad-face.png' alt='User Avatar' class='avatar'></article>`;
    inputField.value = "";
    
    setTimeout(() => {
        let botReply = getBotResponse(message);
        chatBox.innerHTML += `<article class='message bot-message'><img src='../assets/images/bot.png' alt='Bot Avatar' class='avatar'><p class='text'>${botReply}</p></article>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

function getBotResponse(input) {
    let responses = {

        "wat is lego masters?": "Lego Masters is een interactieve game waarin spelers Lego-figuren verzamelen, organiseren en minigames spelen. Je kunt coins verdienen, figuren kopen en sets voltooien!",
        "wie zijn de lego lads?": "De Lego Lads zijn het team achter dit project: Gentian, Ennrico, Lars en Abe!",
        "welke spelmodi zijn er?": "Je kunt de Clicker Game spelen, figuren sorteren in de Lego Fabriek en een Memory Game spelen om extra coins te verdienen.",
        

        "hoe werkt de lego fabriek?": "In de Lego Fabriek kies je maximaal vier poppetjes en plaats je ze in de juiste set. Correcte plaatsingen leveren coins op!",
        "wat gebeurt er als ik een poppetje vernietig?": "Vernietigde poppetjes worden in de Vernietigingslijst geplaatst. Je kunt ze terug zetten of de reden van verwijdering aanpassen.",
        
        

        "hoe werkt de clicker game?": "Je verdient stenen door op een Lego-steen te klikken. Je kunt upgrades kopen zoals een hamer (meer stenen per klik) en een zaag (passief inkomen).",
        "hoeveel coins krijg ik per klik in de clicker game?": "Elke klik levert standaard 1 steen op. Dit aantal kan worden verhoogd met upgrades!",
        "hoe werkt de memory game?": "Je draait kaarten om en zoekt twee dezelfde Lego-figuren. Elke correcte match levert 100 coins op!",
    

        "wat kan ik doen met coins?": "Met coins kun je poppetjes en kisten kopen in de winkel. Je kunt ook vernietigde poppetjes terugkopen uit de Vernietigingslijst.",
        "wat zit er in een kist?": "Een kist bevat een willekeurig poppetje met een bepaalde zeldzaamheid: Ongewoon, Episch of Legendary.",
        "wat zijn de zeldzaamheden van poppetjes?": "Poppetjes hebben drie zeldzaamheden: Ongewoon (veelvoorkomend, goedkoop), Episch (minder beschikbaar, duurder) en Legendary (zeer zeldzaam en het duurst).",
    

        "kan ik de taal wijzigen?": "Ja! In de instellingen kun je de taal wijzigen tussen Nederlands en Engels.",
        "heeft het spel een kleurenblinde modus?": "Ja! De kleurenblinde modus past de kleuren aan voor beter contrast.",
        "kan ik het geluid uitzetten?": "Ja! Je kunt alle geluidseffecten en muziek muten in de instellingen.",
    

        "default": "Ik kan alleen helpen met vragen over het Lego Masters project. Probeer iets te vragen over de spelmechanieken, figuren of minigames!",
        "beschrijf lars": "Lars is een klein ventje"
    };
    return responses[input.toLowerCase()] || "Ik begrijp je vraag niet, ik kan alleen maar antwoorden over vragen over dit project";
}