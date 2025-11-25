/* ---------------------------------------------------------
   VERTICAL FULL-SCREEN SCROLL EXPERIENCE
   Inspired by landonorris.com with fade-in panels
   --------------------------------------------------------- */

// Intersection Observer for panel fade-in on scroll
function initScrollPanels() {
  const panels = document.querySelectorAll(".hero-panel");

  const observerOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: "0px",
  };

  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, observerOptions);

  panels.forEach((panel) => {
    panelObserver.observe(panel);
  });
}

// Parallax effect on scroll for background images
let ticking = false;

function updateParallax() {
  const panels = document.querySelectorAll(".hero-panel.in-view");
  const scrolled = window.scrollY;

  panels.forEach((panel) => {
    const panelTop = panel.offsetTop;
    const panelHeight = panel.offsetHeight;
    const panelBg = panel.querySelector(".panel-bg");

    if (
      scrolled + window.innerHeight > panelTop &&
      scrolled < panelTop + panelHeight
    ) {
      const offset = (scrolled - panelTop) * 0.4;
      if (panelBg) {
        panelBg.style.transform = `translateY(${offset}px) scale(1)`;
      }
    }
  });

  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

// Hide scroll indicator after first scroll
function hideScrollIndicator() {
  const indicator = document.querySelector(".scroll-indicator");
  if (indicator && window.scrollY > 100) {
    indicator.style.opacity = "0";
    window.removeEventListener("scroll", hideScrollIndicator);
  }
}

/* ---------------------------------------------------------
   BEFORE/AFTER SLIDER FUNCTIONALITY
   --------------------------------------------------------- */
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll(".before-after-container");

  containers.forEach((container) => {
    const wrapper = container.querySelector(".ba-wrapper");
    const slider = container.querySelector(".ba-slider");
    const afterImage = container.querySelector(".ba-after");
    let isDragging = false;
    let rafId = null;

    function updateSlider(clientX) {
      const rect = wrapper.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;

      slider.style.left = `${percent}%`;
      afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }

    // Mouse events
    wrapper.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(e.clientX);
      wrapper.style.cursor = "ew-resize";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateSlider(e.clientX);
        rafId = null;
      });
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      wrapper.style.cursor = "ew-resize";
    });

    // Touch events
    wrapper.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
      },
      { passive: true }
    );

    wrapper.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          updateSlider(e.touches[0].clientX);
          rafId = null;
        });
      },
      { passive: true }
    );

    wrapper.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Hover effect - reveal on hover
    wrapper.addEventListener("mouseenter", () => {
      if (!isDragging) {
        slider.style.transition = "left 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)";
        afterImage.style.transition =
          "clip-path 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)";
        slider.style.left = "75%";
        afterImage.style.clipPath = "inset(0 25% 0 0)";
      }
    });

    wrapper.addEventListener("mouseleave", () => {
      if (!isDragging) {
        slider.style.transition = "left 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)";
        afterImage.style.transition =
          "clip-path 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)";
        slider.style.left = "50%";
        afterImage.style.clipPath = "inset(0 50% 0 0)";
      }
    });

    // Reset transitions when dragging starts
    wrapper.addEventListener("mousedown", () => {
      slider.style.transition = "none";
      afterImage.style.transition = "none";
    });

    wrapper.addEventListener(
      "touchstart",
      () => {
        slider.style.transition = "none";
        afterImage.style.transition = "none";
      },
      { passive: true }
    );
  });
}

/* ---------------------------------------------------------
   GALLERY HOVER ENHANCEMENTS
   --------------------------------------------------------- */
function initGalleryInteractions() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      // Add subtle shadow pulse
      item.style.boxShadow = "0 12px 48px rgba(162, 89, 255, 0.15)";
    });

    item.addEventListener("mouseleave", () => {
      item.style.boxShadow = "none";
    });

    // Optional: Add click handler for lightbox or detail view
    item.addEventListener("click", () => {
      // Could open a modal/lightbox here
      console.log("Gallery item clicked:", item);
    });
  });
}

/* ---------------------------------------------------------
   ENHANCED NAV MICRO-INTERACTIONS
   --------------------------------------------------------- */
function initNavEnhancements() {
  const navLogo = document.querySelector(".nav-logo");
  const navCta = document.querySelector(".nav-cta");

  if (navLogo) {
    navLogo.addEventListener("mouseenter", () => {
      navLogo.style.transform = "scale(1.05)";
    });
    navLogo.addEventListener("mouseleave", () => {
      navLogo.style.transform = "scale(1)";
    });
  }

  if (navCta) {
    navCta.addEventListener("mouseenter", () => {
      navCta.style.transform = "translateY(-2px)";
    });
    navCta.addEventListener("mouseleave", () => {
      navCta.style.transform = "translateY(0)";
    });
  }
}

/* ---------------------------------------------------------
   SMOOTH SECTION REVEAL
   --------------------------------------------------------- */
function initSectionReveal() {
  const sections = document.querySelectorAll(
    ".gallery-section, .before-after-section"
  );

  const revealOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        // Add visible class for styled elements like .brand-divider
        entry.target.classList.add("visible");
      }
    });
  }, revealOptions);

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition =
      "opacity 1s cubic-bezier(0.22, 0.61, 0.36, 1), transform 1s cubic-bezier(0.22, 0.61, 0.36, 1)";
    revealObserver.observe(section);
  });
}

/* ---------------------------------------------------------
   GENERIC ELEMENT FADE-IN
   --------------------------------------------------------- */
function initElementFades() {
  const fadeItems = document.querySelectorAll(".anim-fade");
  if (!fadeItems.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeItems.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------
   PARALLAX HEADINGS (LIGHTWEIGHT)
   --------------------------------------------------------- */
function initParallaxHeadings() {
  const headings = document.querySelectorAll(".parallax-heading");
  if (!headings.length) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion || window.innerWidth < 680) return;

  function update() {
    const scrollY = window.scrollY;
    const shift = Math.max(-18, Math.min(18, scrollY * 0.04)); // clamp movement
    headings.forEach((h) => {
      h.style.transform = `translateY(${shift}px)`;
    });
  }
  window.addEventListener(
    "scroll",
    () => {
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();
}

// Initialize on load
window.addEventListener("load", () => {
  initScrollPanels();
  initBeforeAfterSliders();
  initGalleryInteractions();
  initNavEnhancements();
  initSectionReveal();
  initElementFades();
  initParallaxHeadings();
  initCategoryTilesCycle();
  initCategoryTileSelection();
  initContactForm();

  // Add scroll listener for parallax
  window.addEventListener("scroll", onScroll, { passive: true });

  // Hide scroll indicator on first scroll
  window.addEventListener("scroll", hideScrollIndicator, { passive: true });

  // Show first panel immediately
  const firstPanel = document.querySelector(".hero-panel");
  if (firstPanel) {
    firstPanel.classList.add("in-view");
  }
});

/* ---------------------------------------------------------
   CONTACT FORM HANDLER
   --------------------------------------------------------- */
function initContactForm() {
  // Forms removed; no handler needed on GitHub Pages
}

/* ---------------------------------------------------------
   CATEGORY SLIDESHOW
   --------------------------------------------------------- */
function initCategorySlideshow() {
  const slideshow = document.querySelector(".category-slideshow");
  if (!slideshow) return;
  const slides = Array.from(slideshow.querySelectorAll(".cs-slide"));
  const dots = Array.from(slideshow.querySelectorAll(".cs-dot"));
  let idx = 0;
  let timer = null;

  function setActive(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  function start() {
    stop();
    timer = setInterval(() => setActive(idx + 1), 5000);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      setActive(i);
      start();
    });
  });

  // Pause on hover for desktop
  slideshow.addEventListener("mouseenter", stop);
  slideshow.addEventListener("mouseleave", start);

  // Respect reduced motion
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) {
    // No auto-play; keep manual dots only
    setActive(0);
    return;
  }

  setActive(0);
  start();
}

/* ---------------------------------------------------------
   CATEGORY TILE SELECTION
   --------------------------------------------------------- */
function initCategoryTileSelection() {
  const tiles = Array.from(
    document.querySelectorAll(".category-tiles .category-tile")
  );
  if (!tiles.length) return;

  // Default: first selected
  let selected =
    tiles.find((t) => t.classList.contains("selected")) || tiles[0];
  if (selected) selected.classList.add("selected");

  function setSelected(tile) {
    tiles.forEach((t) => t.classList.remove("selected"));
    tile.classList.add("selected");
  }

  // Hover selects; click navigates normally
  tiles.forEach((tile) => {
    tile.addEventListener("mouseenter", () => {
      setSelected(tile);
      const container = document.querySelector(".category-tiles");
      if (container) {
        container.dispatchEvent(new Event("mouseenter")); // pause cycle
      }
    });
    tile.addEventListener("click", () => {
      // Sync selection on click while allowing normal navigation
      setSelected(tile);
    });
  });
}

/* ---------------------------------------------------------
   CATEGORY TILES CYCLE (subtle highlight)
   --------------------------------------------------------- */
function initCategoryTilesCycle() {
  const tiles = Array.from(
    document.querySelectorAll(".category-tiles .category-tile")
  );
  if (!tiles.length) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  let i = 0;
  let timer = null;

  function setSelectedByIndex(n) {
    i = n % tiles.length;
    tiles.forEach((t) => t.classList.remove("selected"));
    tiles[i].classList.add("selected");
  }

  function start() {
    stop();
    timer = setInterval(() => {
      setSelectedByIndex(i + 1);
    }, 6000);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  const container = document.querySelector(".category-tiles");
  if (container) {
    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);
  }
  // Initialize from any preselected tile
  const preIdx = tiles.findIndex((t) => t.classList.contains("selected"));
  setSelectedByIndex(preIdx >= 0 ? preIdx : 0);
  start();
}
