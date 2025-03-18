document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function() {
        this.parentElement.remove();
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

    //Reden

    const redenPopup = document.getElementById('reden-popup');
    document.querySelector('.reason-btn').addEventListener('click', () => {
      redenPopup.style.display = 'flex';
    });
  
    document.querySelector('.close-reden').addEventListener('click', () => {
      redenPopup.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === redenPopup) {
        redenPopup.style.display = 'none';
      }
    });
  });
  