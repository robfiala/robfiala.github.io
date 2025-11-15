// Improved scroll + reveal + carousel controllers
// Key fixes:
// - JS controls hero vertical translation from -50vh -> 0 in a stable way
// - CSS animation for hero children disabled so fade is driven by JS
// - faster opacity transitions to avoid "lag" when scrolling back up

const revealElements = document.querySelectorAll(".reveal");
const heroContent = document.querySelector(".hero-content");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) el.classList.add("visible");
    else el.classList.remove("visible");
  });
}

/**
 * Maps scroll position to hero translation and opacity.
 * Behavior:
 * - At scroll=0 -> hero translateY = -50vh (above center) and text opacity=1
 * - As user scrolls down to 1vh -> translateY moves smoothly to 0 (center)
 * - Text opacity stays 1 until ~70% progress, then fades to 0 by 100%
 * - Carousel opacity goes from 0 at 70% to 1 at 100%
 */
function onScrollToggle() {
  const scrolled = window.scrollY || document.documentElement.scrollTop;
  const vh = window.innerHeight;
  if (!heroContent) return;

  // scrollPercent: 0 .. 1 across one viewport height
  const scrollPercent = Math.min(Math.max(scrolled / vh, 0), 1);

  // Compute vertical offset in VH units: -50vh -> 0vh
  // offsetVh ranges -50 .. 0
  const offsetVh = -50 + scrollPercent * 50;
  // convert to px
  const offsetPx = (offsetVh * vh) / 100;

  // Apply transform directly (use translate3d for GPU acceleration)
  heroContent.style.transform = `translate3d(0, ${offsetPx}px, 0)`;

  // Text fade: we want it to remain visible for most of the scroll,
  // then fade out smoothly from 70% -> 100%
  const fadeStart = 0.7;
  const textOpacity =
    scrollPercent < fadeStart
      ? 1
      : Math.max(0, 1 - (scrollPercent - fadeStart) / (1 - fadeStart));
  const heroText = heroContent.querySelector(".hero-text");
  if (heroText) {
    heroText.style.opacity = textOpacity;
  }

  // Carousel fade-in (0 at 70% -> 1 at 100%)
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const carouselOpacity =
      scrollPercent < fadeStart
        ? 0
        : Math.min(1, (scrollPercent - fadeStart) / (1 - fadeStart));
    carousel.style.opacity = carouselOpacity;
    carousel.style.pointerEvents = carouselOpacity > 0 ? "auto" : "none";
  }

  // Update scrolled state for CSS hooks (keeps previous semantics)
  if (scrolled >= vh) {
    heroContent.classList.add("scrolled");
    const cs = document.querySelector(".carousel-section");
    if (cs) cs.classList.add("scrolled");
  } else {
    heroContent.classList.remove("scrolled");
    const cs = document.querySelector(".carousel-section");
    if (cs) cs.classList.remove("scrolled");
  }
}

function toggleProjectsSlide() {
  // legacy-safe: if you rely on a projectsSlide element, keep it working.
  const projectsSlide = document.querySelector(".projects-slide");
  if (!projectsSlide || !heroContent) return;
  const isHeroScrolled = heroContent.classList.contains("scrolled");
  if (isHeroScrolled) {
    projectsSlide.classList.add("visible");
    projectsSlide.setAttribute("aria-hidden", "false");
  } else {
    projectsSlide.classList.remove("visible");
    projectsSlide.setAttribute("aria-hidden", "true");
  }
}

function onScroll() {
  revealOnScroll();
  onScrollToggle();
  toggleProjectsSlide();
}

// Use passive listener for performance
window.addEventListener("scroll", onScroll, { passive: true });

// initial run: force a layout and set hero initial transform to -50vh
function initHeroInitial() {
  if (!heroContent) return;
  const vh = window.innerHeight;
  const initialOffsetPx = (-50 * vh) / 100; // -50vh in px
  heroContent.style.transform = `translate3d(0, ${initialOffsetPx}px, 0)`;

  // Make sure hero text is fully visible initially (CSS animation disabled)
  const heroText = heroContent.querySelector(".hero-text");
  if (heroText) heroText.style.opacity = "1";

  // initial carousel hidden
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.style.opacity = "0";
    carousel.style.pointerEvents = "none";
  }
}

// Run on load and also on resize to keep vh calculations correct
window.addEventListener("load", () => {
  initHeroInitial();
  onScroll();
});
window.addEventListener("resize", () => {
  initHeroInitial();
  onScroll();
});

/* ----------------- CAROUSEL CODE (unchanged, lightly integrated) ----------------- */
function initCarousel() {
  const trackEl = document.querySelector(".carousel-track");
  if (!trackEl) return;

  const items = Array.from(trackEl.querySelectorAll(".carousel-item"));
  const len = items.length;
  if (!len) return;

  let current = 0;

  function setCarousel(index) {
    current = ((index % len) + len) % len;
    const trackWidth = trackEl.clientWidth || 600;
    const spacing = Math.min(180, Math.max(100, Math.floor(trackWidth / 6)));
    items.forEach((it, i) => {
      it.classList.remove("left", "right", "center", "off");
      let delta = i - current;
      while (delta > len / 2) delta -= len;
      while (delta < -len / 2) delta += len;
      if (delta === 0) {
        it.classList.add("center");
        it.style.transform = `translate(-50%,-50%) translateX(0px) scale(1.18)`;
        it.style.opacity = "1";
        it.style.zIndex = "40";
        it.style.pointerEvents = "auto";
        it.setAttribute("aria-current", "true");
      } else if (delta === -1) {
        it.classList.add("left");
        it.style.transform = `translate(-50%,-50%) translateX(${-spacing}px) scale(.86)`;
        it.style.opacity = ".78";
        it.style.zIndex = "25";
        it.style.pointerEvents = "auto";
        it.removeAttribute("aria-current");
      } else if (delta === 1) {
        it.classList.add("right");
        it.style.transform = `translate(-50%,-50%) translateX(${spacing}px) scale(.86)`;
        it.style.opacity = ".78";
        it.style.zIndex = "25";
        it.style.pointerEvents = "auto";
        it.removeAttribute("aria-current");
      } else {
        it.classList.add("off");
        const out = delta > 0 ? spacing * 4 : -spacing * 4;
        it.style.transform = `translate(-50%,-50%) translateX(${out}px) scale(.6)`;
        it.style.opacity = "0";
        it.style.zIndex = "10";
        it.style.pointerEvents = "none";
        it.removeAttribute("aria-current");
      }
    });
  }

  requestAnimationFrame(() => setCarousel(0));

  items.forEach((it, i) =>
    it.addEventListener("click", (e) => {
      e.preventDefault();
      setCarousel(i);
    })
  );

  let pointerStartX = 0;
  let pointerDelta = 0;
  let isDown = false;

  function onPointerDown(e) {
    isDown = true;
    pointerStartX =
      (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;
    pointerDelta = 0;
  }
  function onPointerMove(e) {
    if (!isDown) return;
    const x = (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;
    pointerDelta = x - pointerStartX;
  }
  function onPointerUp() {
    if (!isDown) return;
    isDown = false;
    const threshold = 40;
    if (pointerDelta > threshold) setCarousel(current - 1);
    else if (pointerDelta < -threshold) setCarousel(current + 1);
    pointerDelta = 0;
  }

  trackEl.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  trackEl.addEventListener("touchstart", onPointerDown, { passive: true });
  trackEl.addEventListener("touchmove", onPointerMove, { passive: true });
  trackEl.addEventListener("touchend", onPointerUp);
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", initCarousel);
else initCarousel();
