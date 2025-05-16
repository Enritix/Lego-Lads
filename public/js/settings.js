document.addEventListener('DOMContentLoaded', function () {
    loadSettingsFromServer();
    const settingsBtnMobile = document.getElementById("settings-btn-mobile");
    const settingsBtnDesktop = document.getElementById("settings-btn-desktop");
    const closeBtn = document.getElementById("settings-close-btn");
    const overlay = document.getElementById("overlay");
    const settingsContainer = document.getElementById("settings-container");
    const brightnessBar = document.getElementById('brightness-bar');
    const increaseButton = document.getElementById('brightness-increase');
    const decreaseButton = document.getElementById('brightness-decrease');
    const colorModeSelect = document.getElementById('colormode');
    const languageSelect = document.getElementById('language');
    const soundSlider = document.querySelector("#sound-toggle");
    const soundToggleLabel = document.querySelector(".toggle-label");
    let brightnessLevel = 7;
    const maxBrightness = 7;
    const minBrightness = 1;
    let currentColorMode = 'normal';

    let originalSettings = {};
    let settings = {}

    for (let i = 0; i < brightnessLevel; i++) {
        const block = document.createElement('div');
        block.classList.add('brightness-block');
        brightnessBar.appendChild(block);
    }

    function updateFilters() {
        const brightnessValue = brightnessLevel / maxBrightness;
        document.body.style.filter = `brightness(${brightnessValue}) url('../assets/images/filters.svg#${currentColorMode}')`;
    }

    settingsBtnMobile.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.style.display = "block";
        settingsContainer.style.display = "flex";
    });

    if (settingsBtnDesktop) {
        settingsBtnDesktop.addEventListener("click", function (e) {
            e.preventDefault();
            overlay.style.display = "block";
            settingsContainer.style.display = "flex";
        });
    }

    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        settingsContainer.style.display = "none";
    });

    closeBtn.addEventListener("click", function () {
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
            updateSettings('brightness', brightnessLevel);
            checkForChanges();
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
            updateSettings('brightness', brightnessLevel);
            checkForChanges();
        }
    });

    colorModeSelect.addEventListener('change', function (event) {
        event.preventDefault();
        currentColorMode = this.value;
        updateFilters();
        updateSettings('filter', this.value);
        checkForChanges();
    });

    languageSelect.addEventListener('change', function (event) {
        event.preventDefault();
        // const selectedLanguage = this.value;
        // loadTranslations(selectedLanguage);
        updateSettings('language', this.value);
        checkForChanges();
    });

    soundSlider.addEventListener('change', function () {
        updateSettings('sound', soundSlider.checked);
        checkForChanges();
    });

    document.getElementById('music-slider').addEventListener('change', function () {
        updateSettings('music', this.checked);
        checkForChanges();
    });

    // function loadTranslations(language) {
    //     if (window.href === "/") {
    //         fetch('/data/translations.json')
    //             .then(response => response.json())
    //             .then(translations => {
    //                 applyTranslations(translations[language]);
    //             })
    //             .catch(error => console.error('Error loading translations:', error));
    //     } else {
    //         fetch('/data/translations.json')
    //             .then(response => response.json())
    //             .then(translations => {
    //                 applyTranslations(translations[language]);
    //             })
    //             .catch(error => console.error('Error loading translations:', error));
    //     }
    // }

    // function applyTranslations(translations) {
    //     document.getElementById('settings-title').textContent = translations.title;
    //     document.getElementById('sound-title').textContent = translations.sound;
    //     document.getElementById('music-title').textContent = translations.music;
    //     document.getElementById('colormode-title').textContent = translations.colormode;
    //     document.getElementById('language-title').textContent = translations.language;
    //     document.getElementById('brightness-title').textContent = translations.brightness;

    //     const toggleLabels = document.querySelectorAll('.toggle-label');
    //     toggleLabels.forEach(label => {
    //         label.querySelector('.toggle-text.off').textContent = translations.off;
    //         label.querySelector('.toggle-text.on').textContent = translations.on;
    //     });

    //     const colormodeSelect = document.getElementById('colormode');
    //     colormodeSelect.options[0].textContent = translations.normal;
    //     colormodeSelect.options[1].textContent = translations.achromatomaly;
    //     colormodeSelect.options[2].textContent = translations.achromatopsia;
    //     colormodeSelect.options[3].textContent = translations.daltonism;
    //     colormodeSelect.options[4].textContent = translations.deuteranopia;
    //     colormodeSelect.options[5].textContent = translations.deuteranomaly;
    //     colormodeSelect.options[6].textContent = translations.protanopia;
    //     colormodeSelect.options[7].textContent = translations.protanomaly;
    //     colormodeSelect.options[8].textContent = translations.tritanomaly;
    //     colormodeSelect.options[9].textContent = translations.tritanopia;

    //     const languageSelect = document.getElementById('language');
    //     languageSelect.options[0].textContent = translations.dutch;
    //     languageSelect.options[1].textContent = translations.english;

    //     closeBtn.textContent = translations.close;
    //     closeBtn.dataset.text = translations.close;
    // }

    function updateSettings(key, value) {
        settings[key] = value;
        console.log(`Instelling bijgewerkt: ${key} = ${value}`);
    }

    // loadTranslations('dutch');
    updateFilters();

    document.getElementById("settings-close-btn").addEventListener("click", async function () {
        const saveSuccess = await saveSettingsToServer(settings);
        if (!saveSuccess && hasSettingsChanged()) {
            alert("Instellingen konden niet worden opgeslagen. Probeer het opnieuw.");
            return;
        }
        const selectedLanguage = languageSelect.value === "dutch" ? "nl" : "en";
        const currentLang = window.location.pathname.match(/^\/(nl|en)/);
        if (!currentLang || currentLang[1] !== selectedLanguage) {
            document.cookie = `lang=${selectedLanguage}; path=/; max-age=${60 * 60 * 24 * 365}`;
            const currentPath = window.location.pathname.replace(/^\/(nl|en)/, '');
            window.location.href = `/${selectedLanguage}${currentPath}`;
        }
    });

    function hasSettingsChanged() {
        return JSON.stringify(settings) !== JSON.stringify(originalSettings);
    }

    function checkForChanges() {
        const closeBtn = document.getElementById("settings-close-btn");
        const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const isDutch = !langMatch || langMatch[1] === "nl";

        if (hasSettingsChanged()) {
            closeBtn.textContent = isDutch ? "Opslaan" : "Save";
            closeBtn.dataset.text = isDutch ? "Opslaan" : "Save";
        } else {
            closeBtn.textContent = isDutch ? "Sluiten" : "Close";
            closeBtn.dataset.text = isDutch ? "Sluiten" : "Close";
        }
    }

    async function loadSettingsFromServer() {
        try {
            const langMatch = window.location.pathname.match(/^\/(nl|en)/);
            const langPrefix = langMatch ? langMatch[0] : '/nl';
            const response = await fetch(`${langPrefix}/get-settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: "680d098a9e371da5cefb77cb" }),
            });

            const result = await response.json();
            if (result.success) {
                settings = result.settings;
                originalSettings = { ...settings };
                console.log("Instellingen opgehaald:", settings);

                document.querySelector("#sound-toggle").checked = settings.sound;
                document.querySelector("#music-slider").checked = settings.music;
                document.querySelector("#colormode").value = settings.filter;
                document.querySelector("#language").value = settings.language;
                // loadTranslations(settings.language);

                const brightnessBar = document.getElementById('brightness-bar');
                brightnessBar.innerHTML = "";
                for (let i = 0; i < settings.brightness; i++) {
                    const block = document.createElement('div');
                    block.classList.add('brightness-block');
                    brightnessBar.appendChild(block);
                }
                currentColorMode = settings.filter;
                brightnessLevel = settings.brightness;
                updateFilters();
            } else {
                console.error("Fout bij ophalen van instellingen:", result.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function saveSettingsToServer(settings) {
        try {
            const langMatch = window.location.pathname.match(/^\/(nl|en)/);
            const langPrefix = langMatch ? langMatch[0] : '/nl';
            const response = await fetch(`${langPrefix}/update-settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: "680d098a9e371da5cefb77cb",
                    newSettings: settings,
                }),
            });

            const result = await response.json();
            if (result.success) {
                console.log("Instellingen succesvol opgeslagen.");
                originalSettings = { ...settings };
                checkForChanges();
                return true;
            } else {
                console.error("Fout bij opslaan van instellingen:", result.error);
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
});