function openInfoPopup() {
    document.getElementById("info-popup").style.display = "block";

}

function closePopup() {
    document.getElementById("info-popup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.figs-container').forEach(container => {
    container.addEventListener('click', async function() {
      const count = this.getAttribute('data-count');
      await fetch('/set-ordenen-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: Number(count) })
      });
      window.location.href = '/factory';
    });
  });
});