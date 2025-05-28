function openInfoPopup() {
  document.getElementById("info-popup").style.display = "block";

}

function closePopup() {
  document.getElementById("info-popup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.figs-container').forEach(container => {
    container.addEventListener('click', async function () {
      const count = this.getAttribute('data-count');
      console.log(`Selected count: ${count}`);
      const langMatch = window.location.pathname.match(/^\/(nl|en)/);
      const langPrefix = langMatch ? langMatch[0] : '/nl';
      await fetch(`${langPrefix}/set-ordenen-count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: Number(count) })
      });
      await fetch(`${langPrefix}/set-random-figs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      window.location.href = '/factory';
    });
  });
});