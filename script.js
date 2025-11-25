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

// Initialize on load
window.addEventListener("load", () => {
  initScrollPanels();
  initBeforeAfterSliders();
  initGalleryInteractions();
  initNavEnhancements();
  initSectionReveal();

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
