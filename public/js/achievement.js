function showAchievementPopup(achievementTitle, current, goal) {
    const popup = document.getElementById("achievement-popup");
    const title = popup.querySelector("h3");
    const desc = document.getElementById("achievement-description");
    const progressFill = popup.querySelector(".progress-fill");
    const countText = document.getElementById("progress-count");
    const checkMark = document.getElementById("progress-check");

    title.textContent = achievementTitle;

    desc.textContent = current >= goal
        ? `Je hebt je doel bereikt!`
        : `Je hebt ${current} van de ${goal} coins verzameld!`;

    progressFill.style.width = "0%";

    setTimeout(() => {
        progressFill.style.width = `${(current / goal) * 100}%`;
    }, 100);

    countText.textContent = `${current} / ${goal}`;

    if (current >= goal) {
        checkMark.classList.remove("not-shown");
    } else {
        checkMark.classList.add("not-shown");
    }

    popup.classList.remove("not-shown");

    setTimeout(() => {
        popup.classList.add("not-shown");
    }, 5000);
}