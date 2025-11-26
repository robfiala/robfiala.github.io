/* ---------------------------------------------------------
   VIDEO SHOWCASE - FILTERING & MODAL
   --------------------------------------------------------- */
function initVideoShowcase() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const videoItems = document.querySelectorAll(".video-item");
  const videoPlayBtns = document.querySelectorAll(".video-play-btn");
  const modal = document.getElementById("videoModal");
  const modalClose = modal ? modal.querySelector(".modal-close") : null;
  const videoContainer = document.getElementById("videoContainer");

  if (!filterBtns.length) return;

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter videos
      videoItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // Video modal functionality
  if (!modal || !videoContainer) return;

  function openModal(videoType, videoId) {
    let embedHTML = "";

    if (videoType === "youtube") {
      embedHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else if (videoType === "vimeo") {
      embedHTML = `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    } else if (videoType === "mp4") {
      embedHTML = `<video controls autoplay><source src="${videoId}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }

    videoContainer.innerHTML = embedHTML;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    videoContainer.innerHTML = "";
    document.body.style.overflow = "";
  }

  videoPlayBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const videoType = btn.getAttribute("data-video-type");
      const videoId = btn.getAttribute("data-video-id");
      openModal(videoType, videoId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Close modal on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}
/* ---------------------------------------------------------
   VIDEO SHOWCASE - FILTERING & MODAL
   --------------------------------------------------------- */\nfunction initVideoShowcase() {\n  const filterBtns = document.querySelectorAll(".filter-btn");\n  const videoItems = document.querySelectorAll(".video-item");\n  const videoPlayBtns = document.querySelectorAll(".video-play-btn");\n  const modal = document.getElementById("videoModal");\n  const modalClose = modal ? modal.querySelector(".modal-close") : null;\n  const videoContainer = document.getElementById("videoContainer");\n\n  if (!filterBtns.length) return;\n\n  // Filter functionality\n  filterBtns.forEach((btn) => {\n    btn.addEventListener("click", () => {\n      const filter = btn.getAttribute("data-filter");\n\n      // Update active button\n      filterBtns.forEach((b) => b.classList.remove("active"));\n      btn.classList.add("active");\n\n      // Filter videos\n      videoItems.forEach((item) => {\n        const category = item.getAttribute("data-category");\n        if (filter === "all" || category === filter) {\n          item.classList.remove("hidden");\n        } else {\n          item.classList.add("hidden");\n        }\n      });\n    });\n  });\n\n  // Video modal functionality\n  if (!modal || !videoContainer) return;\n\n  function openModal(videoType, videoId) {\n    let embedHTML = "";\n\n    if (videoType === "youtube") {\n      embedHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;\n    } else if (videoType === "vimeo") {\n      embedHTML = `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;\n    } else if (videoType === "mp4") {\n      embedHTML = `<video controls autoplay><source src="${videoId}" type="video/mp4">Your browser does not support the video tag.</video>`;\n    }\n\n    videoContainer.innerHTML = embedHTML;\n    modal.classList.add("active");\n    document.body.style.overflow = "hidden";\n  }\n\n  function closeModal() {\n    modal.classList.remove("active");\n    videoContainer.innerHTML = "";\n    document.body.style.overflow = "";\n  }\n\n  videoPlayBtns.forEach((btn) => {\n    btn.addEventListener("click", () => {\n      const videoType = btn.getAttribute("data-video-type");\n      const videoId = btn.getAttribute("data-video-id");\n      openModal(videoType, videoId);\n    });\n  });\n\n  if (modalClose) {\n    modalClose.addEventListener("click", closeModal);\n  }\n\n  // Close modal on background click\n  modal.addEventListener("click", (e) => {\n    if (e.target === modal) {\n      closeModal();\n    }\n  });\n\n  // Close modal with Escape key\n  document.addEventListener("keydown", (e) => {\n    if (e.key === "Escape" && modal.classList.contains("active")) {\n      closeModal();\n    }\n  });\n}\n\n/* ---------------------------------------------------------
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
   PHOTOSHOP CAROUSEL
   --------------------------------------------------------- */
function initPhotoshopCarousel() {
  const carousel = document.querySelector(".photoshop-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");

  let currentIndex = 0;
  let timer = null;
  let isTransitioning = false;

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoplay();
    });
  });

  // Pause on hover
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    },
    { passive: true }
  );

  // Respect reduced motion
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!reduceMotion) {
    startAutoplay();
  }
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
    ".gallery-section, .photoshop-section"
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
  initPhotoshopCarousel();
  initGalleryInteractions();
  initNavEnhancements();
  initSectionReveal();
  initElementFades();
  initParallaxHeadings();
  initCategoryTilesCycle();
  initCategoryTileSelection();
  initContactForm();
  initMobileNav();
  initVideoShowcase();

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
   MOBILE NAVIGATION TOGGLE
   --------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    navLinks.classList.toggle("active");
  });

  // Close menu when clicking nav links
  const links = navLinks.querySelectorAll(".nav-cta");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("active");
    }
  });
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
  const containers = document.querySelectorAll(".category-tiles");
  if (!containers.length) return;

  containers.forEach((container) => {
    const tiles = Array.from(container.querySelectorAll(".category-tile"));
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
        container.dispatchEvent(new Event("mouseenter")); // pause cycle
      });
      tile.addEventListener("click", () => {
        // Sync selection on click while allowing normal navigation
        setSelected(tile);
      });
    });
  });
}

/* ---------------------------------------------------------
   CATEGORY TILES CYCLE (subtle highlight)
   --------------------------------------------------------- */
function initCategoryTilesCycle() {
  const containers = document.querySelectorAll(".category-tiles");
  if (!containers.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  containers.forEach((container) => {
    const tiles = Array.from(container.querySelectorAll(".category-tile"));
    if (!tiles.length) return;

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

    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);

    // Initialize from any preselected tile
    const preIdx = tiles.findIndex((t) => t.classList.contains("selected"));
    setSelectedByIndex(preIdx >= 0 ? preIdx : 0);
    start();
  });
}
