/*const track = document.querySelector('.carousel-track');
const items = [...document.querySelectorAll('.carousel-track > a .carousel-item')];
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');
const indicators = document.querySelectorAll('.indicator');
const carousel = document.querySelector('.carousel');

let currentIndex = items.findIndex(item => item.classList.contains('active'));
let touchStartX = 0;
let touchEndX = 0;

function updateCarousel(index) {
    const totalItems = items.length;

    items.forEach((item, i) => {
        item.classList.remove('active', 'left', 'right');

        if (i === index) {
            item.classList.add('active');
        } else if (i === (index - 1 + totalItems) % totalItems) {
            item.classList.add('left');
        } else if (i === (index + 1) % totalItems) {
            item.classList.add('right');
        }
    });

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });

    currentIndex = index;
}

nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateCarousel((currentIndex + 1) % items.length);
});

prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateCarousel((currentIndex - 1 + items.length) % items.length);
});

indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => updateCarousel(i));
});

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carousel.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', () => {
    if (touchStartX - touchEndX > 50) {
        updateCarousel((currentIndex + 1) % items.length);
    } else if (touchStartX - touchEndX < -50) {
        updateCarousel((currentIndex - 1 + items.length) % items.length);
    }
});

carousel.addEventListener('click', (e) => {
    e.preventDefault();
    const activeItem = items[currentIndex];
    const rect = carousel.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const middle = rect.width / 2;

    if (e.target === activeItem) {
        return;
    }

    if (clickX < middle) {
        updateCarousel((currentIndex - 1 + items.length) % items.length);
    } else {
        updateCarousel((currentIndex + 1) % items.length);
    }
});

updateCarousel(currentIndex);*/ 


const carousel = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');
const leftBatman = document.querySelector('#left img');
const rightBatman = document.querySelector('#right img');

let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;


const batmanImages = [
    "https://github.com/AbeVerschueren/img/blob/main/lego-mbappe.png?raw=true",       // Fifa
    "https://github.com/AbeVerschueren/img/blob/main/batman.png?raw=true",            // Lego
    "https://github.com/AbeVerschueren/img/blob/main/LEGO-Fortnite.png?raw=true",     // Fortnite
    "https://github.com/AbeVerschueren/img/blob/main/lego-pokemon.png?raw=true",      // Pokémon
    "https://github.com/AbeVerschueren/img/blob/main/mtg-lego.png?raw=true",          // Magic
    "https://github.com/AbeVerschueren/img/blob/main/lego-ghandalf.png?raw=true"      // LOTR
];

function updateCarousel(index) {
    const totalItems = items.length;

    items.forEach((item, i) => {
        item.classList.remove('active', 'left', 'right');

        if (i === index) {
            item.classList.add('active');
        } else if (i === (index - 1 + totalItems) % totalItems) {
            item.classList.add('left');
        } else if (i === (index + 1) % totalItems) {
            item.classList.add('right');
        }
    });

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });

    updateBatmanImage(index);

    currentIndex = index;
}

function updateBatmanImage(index) {
   
    const leftBatman = document.querySelector("#left img");
    const rightBatman = document.querySelector("#right img");

    
    leftBatman.className = "background-batman";
    rightBatman.className = "background-batman";

    
    leftBatman.classList.add(`background-${index}`);
    rightBatman.classList.add(`background-${index}`);

    
    leftBatman.src = batmanImages[index];
    rightBatman.src = batmanImages[index];
}

nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateCarousel((currentIndex + 1) % items.length);
});

prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateCarousel((currentIndex - 1 + items.length) % items.length);
});

indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => updateCarousel(i));
});


carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carousel.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', () => {
    if (Math.abs(touchStartX - touchEndX) > 50) {
        if (touchStartX > touchEndX) {
            updateCarousel((currentIndex + 1) % items.length);
        } else {
            updateCarousel((currentIndex - 1 + items.length) % items.length);
        }
    }
});


carousel.addEventListener('click', (e) => {
    e.preventDefault();
    const activeItem = items[currentIndex];
    const rect = carousel.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const middle = rect.width / 2;

    if (e.target === activeItem) {
        return;
    }

    if (clickX < middle) {
        updateCarousel((currentIndex - 1 + items.length) % items.length);
    } else {
        updateCarousel((currentIndex + 1) % items.length);
    }
});


updateCarousel(currentIndex);

