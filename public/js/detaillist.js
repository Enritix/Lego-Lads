document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', async function () {
      const fig = this.dataset.fig;
      const set = this.dataset.set;
      const theme = this.dataset.theme;
      const langMatch = window.location.pathname.match(/^\/(nl|en)/);
        const langPrefix = langMatch ? langMatch[0] : '/nl';
        const response = await fetch(`${langPrefix}/delete-sorted-fig`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fig, set, theme })
      });
      const data = await response.json();
      if (data.success) {
        this.closest('.superheroes-section').remove();
        window.location.reload();
      } else {
        alert('Verwijderen mislukt: ' + (data.message || 'Onbekende fout'));
      }
    });
  });

  const infoPopup = document.getElementById('info-popup');
  document.querySelector('.info-icon').addEventListener('click', () => {
    infoPopup.style.display = 'flex';
  });

  document.querySelector('.close-button').addEventListener('click', () => {
    infoPopup.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === infoPopup) {
      infoPopup.style.display = 'none';
    }
  });
});