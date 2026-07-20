// ============================================================
// ENVELOPE OPEN -> REVEAL SITE
// ============================================================
const envelope = document.getElementById('envelope');
const envelopeScreen = document.getElementById('envelopeScreen');
const mainContent = document.getElementById('mainContent');
const letterCard = document.getElementById('letterCard');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

let opened = false;

envelope.addEventListener('click', () => {
  if (opened) return;
  opened = true;

  envelope.classList.add('open');

  // try to start the music right on this user gesture (browsers allow this)
  bgMusic.volume = 0.6;
  bgMusic.play().then(() => {
    musicToggle.classList.add('playing');
  }).catch(() => {
    // autoplay blocked — user can tap the music button manually
  });

  setTimeout(() => {
    envelopeScreen.classList.add('hidden');
    mainContent.classList.add('visible');
    revealLetter();
  }, 1000);
});

// keyboard accessibility for the envelope
envelope.setAttribute('tabindex', '0');
envelope.setAttribute('role', 'button');
envelope.setAttribute('aria-label', 'open your letter');
envelope.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    envelope.click();
  }
});

// ============================================================
// LETTER WORD-BY-WORD REVEAL (runs once, after envelope opens)
// ============================================================
function revealLetter() {
  const letterBody = document.getElementById('letterBody');
  const paragraphs = letterBody.querySelectorAll('p');
  let globalIndex = 0;

  paragraphs.forEach((p) => {
    const words = p.textContent.split(' ');
    p.innerHTML = words
      .map((w) => `<span class="word">${w}</span>`)
      .join(' ');

    p.querySelectorAll('.word').forEach((span) => {
      span.style.animationDelay = `${globalIndex * 0.035}s`;
      globalIndex++;
    });
  });

  requestAnimationFrame(() => {
    letterCard.classList.add('reveal');
  });
}

// ============================================================
// FLOATING HEARTS ON TAP (hero + closing section)
// ============================================================
const heartLayer = document.getElementById('heartLayer');
const heartSymbols = ['💗', '💕', '💛', '✨', '💫'];

function spawnHearts(x, y, count = 6) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    const offsetX = (Math.random() - 0.5) * 80;
    heart.style.left = `${x + offsetX}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${14 + Math.random() * 14}px`;
    heart.style.animationDuration = `${2 + Math.random()}s`;
    heartLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 3200);
  }
}

document.querySelector('.hero').addEventListener('click', (e) => {
  spawnHearts(e.clientX, e.clientY, 4);
});

const closingSection = document.querySelector('.closing');
if (closingSection) {
  closingSection.addEventListener('click', (e) => {
    spawnHearts(e.clientX, e.clientY, 14);
  });
}

document.getElementById('sky').addEventListener('click', (e) => {
  spawnHearts(e.clientX, e.clientY, 10);
});

// ============================================================
// MUSIC TOGGLE BUTTON
// ============================================================
musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => musicToggle.classList.add('playing'));
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
  }
});

bgMusic.addEventListener('pause', () => musicToggle.classList.remove('playing'));
bgMusic.addEventListener('play', () => musicToggle.classList.add('playing'));