// SCROLL + REVEAL HANDLERS
const revealElements = document.querySelectorAll(".reveal");
const heroContent = document.querySelector(".hero-content");
const projectsSlide = document.querySelector(".projects-slide");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) el.classList.add("visible");
  });
}

function onScrollToggle() {
  const scrolled = window.scrollY || document.documentElement.scrollTop;
  const heroContent = document.querySelector(".hero-content");
  const carouselSection = document.querySelector(".carousel-section");
  const carousel = document.querySelector(".carousel");

  if (heroContent) {
    // Title movement: moves UP from -50vh to 0 as user scrolls through 100vh
    const vh = window.innerHeight;
    const scrollPercent = Math.min(scrolled / vh, 1); // 0 to 1 over full viewport

    // Start at -50vh (top of viewport, half clipped)
    // End at 0vh (centered)
    // Total movement: 50vh
    const offsetVh = -50 + scrollPercent * 50; // -50 to 0
    const offsetPx = (offsetVh * vh) / 100; // Convert to pixels

    heroContent.style.transform = `translateY(${offsetPx}px)`;

    // Text fade: disappears after 70% of scroll
    const textOpacity = Math.max(0, 1 - scrollPercent / 0.7);
    const heroText = heroContent.querySelector(".hero-text");
    if (heroText) {
      heroText.style.opacity = textOpacity;
    }

    // Carousel fade: appears after 70% of scroll
    if (carousel) {
      const carouselOpacity = Math.max(0, (scrollPercent - 0.7) / 0.3); // 0 to 1 from 70%-100%
      carousel.style.opacity = carouselOpacity;
      carousel.style.pointerEvents = carouselOpacity > 0 ? "auto" : "none";
    }

    // Class management
    if (scrolled >= vh) {
      heroContent.classList.add("scrolled");
      if (carouselSection) carouselSection.classList.add("scrolled");
    } else {
      heroContent.classList.remove("scrolled");
      if (carouselSection) carouselSection.classList.remove("scrolled");
    }
  }
}
function toggleProjectsSlide() {
  if (!projectsSlide) return;
  const isHeroScrolled =
    heroContent && heroContent.classList.contains("scrolled");
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

window.addEventListener("scroll", onScroll, { passive: true });

// initial run
revealOnScroll();
onScrollToggle();
toggleProjectsSlide();

/* CAROUSEL LOGIC - initialize when DOM is ready to ensure elements exist */
function initCarousel() {
  const trackEl = document.querySelector(".carousel-track");
  if (!trackEl) return;

  const items = Array.from(trackEl.querySelectorAll(".carousel-item"));
  const len = items.length;
  console.info("initCarousel — items:", len);
  if (!len) return;

  let current = 0;

  function setCarousel(index) {
    current = ((index % len) + len) % len;
    // spacing based on track width (falls back to 140)
    const trackWidth = trackEl.clientWidth || 600;
    const spacing = Math.min(180, Math.max(100, Math.floor(trackWidth / 6)));
    items.forEach((it, i) => {
      it.classList.remove("left", "right", "center", "off");
      let delta = i - current;
      while (delta > len / 2) delta -= len;
      while (delta < -len / 2) delta += len;
      // center
      if (delta === 0) {
        it.classList.add("center");
        it.style.transform = `translate(-50%,-50%) translateX(0px) scale(1.18)`;
        it.style.opacity = "1";
        it.style.zIndex = "40";
        it.style.pointerEvents = "auto";
        it.setAttribute("aria-current", "true");
      } else if (delta === -1) {
        // left neighbor
        it.classList.add("left");
        it.style.transform = `translate(-50%,-50%) translateX(${-spacing}px) scale(.86)`;
        it.style.opacity = ".78";
        it.style.zIndex = "25";
        it.style.pointerEvents = "auto";
        it.removeAttribute("aria-current");
      } else if (delta === 1) {
        // right neighbor
        it.classList.add("right");
        it.style.transform = `translate(-50%,-50%) translateX(${spacing}px) scale(.86)`;
        it.style.opacity = ".78";
        it.style.zIndex = "25";
        it.style.pointerEvents = "auto";
        it.removeAttribute("aria-current");
      } else {
        // off-screen
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

  // initial paint
  requestAnimationFrame(() => setCarousel(0));

  // click behavior
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

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", initCarousel);
else initCarousel();
