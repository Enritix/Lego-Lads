document.addEventListener('DOMContentLoaded', function () {
    const settingsBtnMobile = document.getElementById("settings-btn-mobile");
    const settingsBtnDesktop = document.getElementById("settings-btn-desktop");
    const overlay = document.getElementById("overlay");
    const settingsContainer = document.getElementById("settings-container");
    const brightnessBar = document.getElementById('brightness-bar');
    const increaseButton = document.getElementById('brightness-increase');
    const decreaseButton = document.getElementById('brightness-decrease');
    const colorModeSelect = document.getElementById('colormode');
    const languageSelect = document.getElementById('language');
    let brightnessLevel = 7;
    const maxBrightness = 7;
    const minBrightness = 1;
    let currentColorMode = 'normal';

    for (let i = 0; i < brightnessLevel; i++) {
        const block = document.createElement('div');
        block.classList.add('brightness-block');
        brightnessBar.appendChild(block);
    }

    function updateFilters() {
        const brightnessValue = brightnessLevel / maxBrightness;
        document.body.style.filter = `brightness(${brightnessValue}) url('../assets/images/filters.svg#${currentColorMode}')`;
    }

    settingsBtnMobile.addEventListener("click", function () {
        overlay.style.display = "block";
        settingsContainer.style.display = "flex";
    });

    settingsBtnDesktop.addEventListener("click", function () {
        overlay.style.display = "block";
        settingsContainer.style.display = "flex";
    });

    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        settingsContainer.style.display = "none";
    });

    increaseButton.addEventListener('click', function () {
        if (brightnessLevel < maxBrightness) {
            brightnessLevel++;
            const block = document.createElement('div');
            block.classList.add('brightness-block');
            brightnessBar.appendChild(block);
            updateFilters();
        }
    });

    decreaseButton.addEventListener('click', function () {
        if (brightnessLevel > minBrightness) {
            brightnessLevel--;
            const blocks = brightnessBar.getElementsByClassName('brightness-block');
            if (blocks.length > 0) {
                brightnessBar.removeChild(blocks[blocks.length - 1]);
            }
            updateFilters();
        }
    });

    colorModeSelect.addEventListener('change', function (event) {
        event.preventDefault();
        currentColorMode = this.value;
        updateFilters();
    });

    languageSelect.addEventListener('change', function (event) {
        event.preventDefault();
        const selectedLanguage = this.value;
        loadTranslations(selectedLanguage);
    });

    function loadTranslations(language) {
        fetch('data/translations.json')
            .then(response => response.json())
            .then(translations => {
                applyTranslations(translations[language]);
            })
            .catch(error => console.error('Error loading translations:', error));
    }

    function applyTranslations(translations) {
        document.getElementById('settings-title').textContent = translations.title;
        document.getElementById('sound-title').textContent = translations.sound;
        document.getElementById('music-title').textContent = translations.music;
        document.getElementById('colormode-title').textContent = translations.colormode;
        document.getElementById('language-title').textContent = translations.language;
        document.getElementById('brightness-title').textContent = translations.brightness;
    
        const colormodeSelect = document.getElementById('colormode');
        colormodeSelect.options[0].textContent = translations.normal;
        colormodeSelect.options[1].textContent = translations.achromatomaly;
        colormodeSelect.options[2].textContent = translations.achromatopsia;
        colormodeSelect.options[3].textContent = translations.daltonism;
        colormodeSelect.options[4].textContent = translations.deuteranopia;
        colormodeSelect.options[5].textContent = translations.deuteranomaly;
        colormodeSelect.options[6].textContent = translations.protanopia;
        colormodeSelect.options[7].textContent = translations.protanomaly;
        colormodeSelect.options[8].textContent = translations.tritanomaly;
        colormodeSelect.options[9].textContent = translations.tritanopia;
    
        const languageSelect = document.getElementById('language');
        languageSelect.options[0].textContent = translations.dutch;
        languageSelect.options[1].textContent = translations.english;
    
        const toggleLabels = document.querySelectorAll('.toggle-label');
        toggleLabels.forEach(label => {
            label.querySelector('.toggle-text.off').textContent = translations.off;
            label.querySelector('.toggle-text.on').textContent = translations.on;
        });
    }

    loadTranslations('dutch');
    updateFilters();
});