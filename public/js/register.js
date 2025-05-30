document.addEventListener('DOMContentLoaded', function () {
  const figurenLijst = document.querySelector('.figuren-lijst');
  const figuren = figurenLijst.querySelectorAll('.figuur');
  const prevBtn = document.querySelector('.carousel-button.prev');
  const nextBtn = document.querySelector('.carousel-button.next');
  const figImages = document.querySelectorAll('.figuur-images');
  let currentIndex = 0;

  function showFiguur(index) {
    figurenLijst.scrollTo({
      left: figuren[index].offsetLeft,
      behavior: 'smooth'
    });
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % figuren.length;
    showFiguur(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + figuren.length) % figuren.length;
    showFiguur(currentIndex);
  }

  function handleResize() {
    if (window.innerWidth <= 600) {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }



  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  figImages.forEach(figImage => {
    figImage.classList.remove('active');
    figImage.addEventListener('click', () => {
      figImages.forEach(image => image.classList.remove('active'));
      figImage.classList.add('active');
    });
  });

  window.addEventListener('resize', handleResize);
  handleResize();

  document.querySelectorAll('.figuur-img').forEach(img => {
    img.addEventListener('click', function () {
      document.getElementById('profileFig').value = this.src;
      // document.querySelectorAll('.figuur').forEach(f => f.classList.remove('selected'));
      // this.closest('.figuur').classList.add('selected');
    });
  });

  // Voor wachtwoordveld
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const eyeOpen = document.getElementById('eye-open');
  const eyeClosed = document.getElementById('eye-closed');

  togglePassword.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeOpen.style.display = isPassword ? '' : 'none';
    eyeClosed.style.display = isPassword ? 'none' : '';
  });

  // Voor herhaal wachtwoord
  const confirmPasswordInput = document.getElementById('confirm-password');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const eyeOpenConfirm = document.getElementById('eye-open-confirm');
  const eyeClosedConfirm = document.getElementById('eye-closed-confirm');

  toggleConfirmPassword.addEventListener('click', function () {
    const isPassword = confirmPasswordInput.type === 'password';
    confirmPasswordInput.type = isPassword ? 'text' : 'password';
    eyeOpenConfirm.style.display = isPassword ? '' : 'none';
    eyeClosedConfirm.style.display = isPassword ? 'none' : '';
  });
});
