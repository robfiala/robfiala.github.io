/* ---------------------------------------------------------
   SCROLL-DRIVEN HERO + CAROUSEL ANIMATION (cleaned)
   --------------------------------------------------------- */

// Elements
const revealElements = document.querySelectorAll(".reveal");
const heroContentEl = document.querySelector(".hero-content");
const heroTextEl = heroContentEl
  ? heroContentEl.querySelector(".hero-text")
  : null;
const carouselEl = document.querySelector(".carousel");
const carouselSectionEl = document.querySelector(".carousel-section");

// Motion state
const heroMotion = { start: 0, end: 0, ready: false };

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) el.classList.add("visible");
  });
}

function initHeroInitial() {
  if (!heroContentEl) return;
  // reset transforms and opacities
  heroContentEl.style.transform = "translateX(-50%) translateY(0px)";
  if (heroTextEl) heroTextEl.style.opacity = "1";
  if (carouselEl) {
    carouselEl.style.opacity = "0";
    carouselEl.style.pointerEvents = "none";
  }
}

function initHeroMotion() {
  if (!heroContentEl) return;
  const vh = window.innerHeight;
  const rect = heroContentEl.getBoundingClientRect();
  // Motion travel: from top (0) to centered position
  heroMotion.start = 0;
  heroMotion.end = Math.max(0, Math.round(vh / 2 - rect.height / 2));
  heroMotion.ready = true;
  heroContentEl.style.transform = `translateX(-50%) translateY(${heroMotion.start}px)`;
  adjustScrollSpace();
}

function adjustScrollSpace() {
  const spacer = document.querySelector(".scroll-space");
  if (!spacer) return;
  const vh = window.innerHeight;
  const travel = heroMotion.end;
  // Provide enough scroll height: hero travel + extra for fade handoff
  const needed = travel + vh * 0.8;
  spacer.style.height = Math.max(needed, vh * 1.5) + "px";
}

function onScrollToggle() {
  if (!heroMotion.ready) initHeroMotion();
  const scrolled = window.scrollY || document.documentElement.scrollTop;
  const travel = heroMotion.end || 1;
  const progress = Math.max(0, Math.min(scrolled / travel, 1)); // 0..1 over hero travel

  revealOnScroll();
  if (!heroContentEl) return;

  const currentOffset =
    heroMotion.start + (heroMotion.end - heroMotion.start) * progress;
  heroContentEl.style.transform = `translateX(-50%) translateY(${currentOffset}px)`;

  // Fade text between 55% and 85% of travel
  if (heroTextEl) {
    const t = (progress - 0.55) / 0.3; // 0->1
    const textOpacity = 1 - Math.max(0, Math.min(t, 1));
    heroTextEl.style.opacity = String(textOpacity);
  }

  // Carousel fades (earlier start @45%) + bbox debug + minimum visibility
  if (carouselEl) {
    const c = (progress - 0.45) / 0.4; // fade 45% -> 85%
    const carouselOpacity = Math.max(0, Math.min(c, 1));
    const appliedOpacity =
      carouselOpacity < 0.2 && progress > 0.65 ? 0.2 : carouselOpacity;
    carouselEl.style.opacity = String(appliedOpacity);
    carouselEl.style.pointerEvents = appliedOpacity > 0.2 ? "auto" : "none";
    if (carouselSectionEl) {
      carouselSectionEl.style.pointerEvents =
        appliedOpacity > 0.2 ? "auto" : "none";
      carouselSectionEl.style.opacity = String(appliedOpacity);
    }
    // Hide hero content after overlap to avoid covering perception
    if (heroContentEl)
      heroContentEl.style.visibility = progress > 0.62 ? "hidden" : "visible";
    const centerItem = carouselEl.querySelector(".carousel-item.center");
    if (centerItem) {
      const r = centerItem.getBoundingClientRect();
      console.log(
        "[CenterBBox]",
        r.left.toFixed(0),
        r.top.toFixed(0),
        r.width.toFixed(0),
        r.height.toFixed(0)
      );
    } else {
      console.log("[CenterBBox] none");
    }
    console.log(
      "[CarouselOpacity]",
      progress.toFixed(3),
      carouselOpacity.toFixed(3),
      "applied",
      appliedOpacity.toFixed(3)
    );
  }

  // End state classes
  if (progress >= 1) {
    heroContentEl.classList.add("scrolled");
    if (carouselSectionEl) carouselSectionEl.classList.add("scrolled");
  } else {
    heroContentEl.classList.remove("scrolled");
    if (carouselSectionEl) carouselSectionEl.classList.remove("scrolled");
  }
}

/* ---------------- CAROUSEL (keeps previous behavior) ---------------- */
function initCarousel() {
  const trackEl = document.querySelector(".carousel-track");
  if (!trackEl) return;

  const items = Array.from(trackEl.querySelectorAll(".carousel-item"));
  const len = items.length;
  if (!len) return;

  // Immediate background init
  items.forEach((it) => {
    const bg = it.getAttribute("data-bg");
    if (bg) it.style.backgroundImage = `url(${bg})`;
  });

  let current = 0;
  const debugFlat = false; // ensure transform animations active

  function setCarousel(index) {
    current = ((index % len) + len) % len;
    const trackWidth = trackEl.clientWidth || 600;
    // For full-width panels, spacing equals track width so neighbors sit just off-screen
    const spacing = trackWidth;
    items.forEach((it, i) => {
      it.classList.remove("left", "right", "center", "off");
      let delta = i - current;
      while (delta > len / 2) delta -= len;
      while (delta < -len / 2) delta += len;
      if (delta === 0) {
        it.classList.add("center");
        it.style.transform = `translateX(0px)`;
        it.style.opacity = "1";
        it.style.zIndex = "40";
        it.style.pointerEvents = "auto";
        it.setAttribute("aria-current", "true");
      } else if (delta === -1) {
        it.classList.add("left");
        it.style.transform = `translateX(${-spacing}px)`;
        it.style.opacity = ".0";
        it.style.zIndex = "25";
        it.style.pointerEvents = "auto";
        it.removeAttribute("aria-current");
      } else if (delta === 1) {
        it.classList.add("right");
        it.style.transform = `translateX(${spacing}px)`;
        it.style.opacity = ".0";
        it.style.zIndex = "25";
        it.style.pointerEvents = "auto";
        it.removeAttribute("aria-current");
      } else {
        it.classList.add("off");
        const out = delta > 0 ? spacing * 2 : -spacing * 2;
        it.style.transform = `translateX(${out}px)`;
        it.style.opacity = "0";
        it.style.zIndex = "10";
        it.style.pointerEvents = "none";
        it.removeAttribute("aria-current");
      }
    });
  }

  // initial paint
  requestAnimationFrame(() => setCarousel(0));

  // clicks
  items.forEach((it, i) =>
    it.addEventListener("click", (e) => {
      e.preventDefault();
      setCarousel(i);
    })
  );

  // pointer/touch swipe
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

/* ---------------- EVENT BINDINGS ---------------- */
window.addEventListener("scroll", onScrollToggle, { passive: true });

window.addEventListener("load", () => {
  initHeroInitial();
  initHeroMotion();
  initCarousel();
  onScrollToggle();
});

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initHeroInitial();
    initHeroMotion();
    onScrollToggle();
  }, 120);
});
