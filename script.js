/* ---------------------------------------------------------
   SCROLL-DRIVEN HERO + CAROUSEL ANIMATION
   --------------------------------------------------------- */

const heroContent = document.querySelector(".hero-content");
const heroText = heroContent ? heroContent.querySelector(".hero-text") : null;
const carousel = document.querySelector(".carousel");

/* ---------------- INITIAL STATE ---------------- */
function initHeroInitial() {
  heroContent.style.transform = `translate3d(0, 0, 0)`;

  if (heroText) heroText.style.opacity = "1";

  if (carousel) {
    carousel.style.opacity = "0";
    carousel.style.pointerEvents = "none";
  }
}

/* ---------------- SCROLL BEHAVIOR ---------------- */
function onScrollToggle() {
  const scrolled = window.scrollY;
  const vh = window.innerHeight;

  const scrollPercent = Math.min(Math.max(scrolled / vh, 0), 1);

  // HERO DOWNWARD MOVEMENT
  const offsetVh = scrollPercent * 20;
  const offsetPx = (offsetVh * vh) / 100;
  heroContent.style.transform = `translate3d(0, ${offsetPx}px, 0)`;

  // TEXT FADE-OUT (starts at 70%)
  const fadeStart = 0.7;
  if (heroText) {
    const opacity =
      scrollPercent < fadeStart
        ? 1
        : Math.max(0, 1 - (scrollPercent - fadeStart) / (1 - fadeStart));
    heroText.style.opacity = opacity;
  }

  // CAROUSEL FADE-IN
  if (carousel) {
    const opacity =
      scrollPercent < fadeStart
        ? 0
        : Math.min(1, (scrollPercent - fadeStart) / (1 - fadeStart));
    carousel.style.opacity = opacity;
    carousel.style.pointerEvents = opacity > 0 ? "auto" : "none";
  }
}

/* ---------------- CAROUSEL LOGIC (unchanged) ---------------- */
function initCarousel() {
  const trackEl = document.querySelector(".carousel-track");
  if (!trackEl) return;

  const items = Array.from(trackEl.querySelectorAll(".carousel-item"));
  const len = items.length;

  let current = 0;

  function setCarousel(index) {
    current = ((index % len) + len) % len;
    const trackWidth = trackEl.clientWidth;
    const spacing = Math.min(180, Math.max(100, Math.floor(trackWidth / 6)));

    items.forEach((it, i) => {
      let delta = i - current;
      while (delta > len / 2) delta -= len;
      while (delta < -len / 2) delta += len;

      it.classList.remove("left", "right", "center", "off");

      if (delta === 0) {
        it.classList.add("center");
        it.style.transform = `translate(-50%, -50%) translateX(0) scale(1.18)`;
        it.style.opacity = "1";
      } else if (delta === -1) {
        it.classList.add("left");
        it.style.transform = `translate(-50%, -50%) translateX(${-spacing}px) scale(.86)`;
        it.style.opacity = ".78";
      } else if (delta === 1) {
        it.classList.add("right");
        it.style.transform = `translate(-50%, -50%) translateX(${spacing}px) scale(.86)`;
        it.style.opacity = ".78";
      } else {
        it.classList.add("off");
        const out = delta > 0 ? spacing * 4 : -spacing * 4;
        it.style.transform = `translate(-50%, -50%) translateX(${out}px) scale(.6)`;
        it.style.opacity = "0";
      }
    });
  }

  setCarousel(0);
}

/* ---------------- EVENT BINDINGS ---------------- */
window.addEventListener("scroll", () => {
  onScrollToggle();
});

window.addEventListener("load", () => {
  initHeroInitial();
  initCarousel();
  onScrollToggle();
});

window.addEventListener("resize", () => {
  initHeroInitial();
  onScrollToggle();
});
