/* ---------------------------------------------------------
   MASONRY GALLERY & LIGHTBOX
   --------------------------------------------------------- */
function initMasonryGallery() {
  const section = document.querySelector(".masonry-gallery-section");
  if (!section) return;

  const grid = document.getElementById("masonryGrid");
  const lightbox = document.getElementById("masonryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const closeBtn = document.querySelector(".masonry-lightbox-close");
  const prevBtn = document.querySelector(".masonry-lightbox-prev");
  const nextBtn = document.querySelector(".masonry-lightbox-next");
  const zoomInBtn = document.querySelector(".zoom-in");
  const zoomOutBtn = document.querySelector(".zoom-out");
  const zoomResetBtn = document.querySelector(".zoom-reset");
  const imageContainer = document.querySelector(
    ".masonry-lightbox-image-container"
  );

  let images = [];
  let currentIndex = 0;
  let currentZoom = 1;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const category = section.getAttribute("data-category");

  // Placeholder images for demonstration
  // In production, these would be loaded from:
  // - /pictures/<category>/assets/ for photography pages
  // - /photoshop/assets/ for photoshop page
  const placeholderImages = [
    {
      src: `https://picsum.photos/400/600?random=1&category=${category}`,
      alt: `${category} 1`,
    },
    {
      src: `https://picsum.photos/400/300?random=2&category=${category}`,
      alt: `${category} 2`,
    },
    {
      src: `https://picsum.photos/400/500?random=3&category=${category}`,
      alt: `${category} 3`,
    },
    {
      src: `https://picsum.photos/400/450?random=4&category=${category}`,
      alt: `${category} 4`,
    },
    {
      src: `https://picsum.photos/400/550?random=5&category=${category}`,
      alt: `${category} 5`,
    },
    {
      src: `https://picsum.photos/400/400?random=6&category=${category}`,
      alt: `${category} 6`,
    },
    {
      src: `https://picsum.photos/400/600?random=7&category=${category}`,
      alt: `${category} 7`,
    },
    {
      src: `https://picsum.photos/400/350?random=8&category=${category}`,
      alt: `${category} 8`,
    },
    {
      src: `https://picsum.photos/400/500?random=9&category=${category}`,
      alt: `${category} 9`,
    },
    {
      src: `https://picsum.photos/400/450?random=10&category=${category}`,
      alt: `${category} 10`,
    },
    {
      src: `https://picsum.photos/400/550?random=11&category=${category}`,
      alt: `${category} 11`,
    },
    {
      src: `https://picsum.photos/400/400?random=12&category=${category}`,
      alt: `${category} 12`,
    },
  ];

  images = placeholderImages;

  // Load images into masonry grid
  function loadGallery() {
    grid.innerHTML = "";
    images.forEach((img, index) => {
      const item = document.createElement("div");
      item.className = "masonry-item";
      item.innerHTML = `<img src="${img.src}" alt="${img.alt}" class="masonry-image" loading="lazy">`;
      item.addEventListener("click", () => openLightbox(index));
      grid.appendChild(item);
    });
  }

  // Open lightbox
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    resetZoom();
  }

  // Update lightbox content
  function updateLightbox() {
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    resetZoom();
  }

  // Navigation
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  // Zoom functions
  function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.25, 3);
    applyZoom();
  }

  function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.25, 0.5);
    applyZoom();
  }

  function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    applyZoom();
  }

  function applyZoom() {
    lightboxImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
  }

  // Mouse drag for panning when zoomed
  imageContainer.addEventListener("mousedown", (e) => {
    if (currentZoom > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      imageContainer.classList.add("dragging");
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      applyZoom();
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      imageContainer.classList.remove("dragging");
    }
  });

  // Touch swipe for navigation
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        prevImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "+":
      case "=":
        zoomIn();
        break;
      case "-":
      case "_":
        zoomOut();
        break;
      case "0":
        resetZoom();
        break;
    }
  });

  // Event listeners
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", prevImage);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);
  if (zoomInBtn) zoomInBtn.addEventListener("click", zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", zoomOut);
  if (zoomResetBtn) zoomResetBtn.addEventListener("click", resetZoom);

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Initialize gallery
  loadGallery();
}
/* ---------------------------------------------------------
   BEFORE/AFTER CAROUSEL & LIGHTBOX
   --------------------------------------------------------- */
function initBeforeAfterCarousel() {
  const carousel = document.querySelector(".ba-carousel");
  if (!carousel) return;

  const slides = Array.from(document.querySelectorAll(".ba-slide"));
  const indicators = Array.from(document.querySelectorAll(".ba-indicator"));
  const prevBtn = document.querySelector(".ba-nav-prev");
  const nextBtn = document.querySelector(".ba-nav-next");
  const lightbox = document.getElementById("baLightbox");
  const lightboxClose = document.querySelector(".ba-lightbox-close");
  const lightboxPrev = document.querySelector(".ba-lightbox-prev");
  const lightboxNext = document.querySelector(".ba-lightbox-next");

  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Slide data
  const slideData = slides.map((slide) => ({
    beforeImg: slide.querySelector(".ba-before").src,
    afterImg: slide.querySelector(".ba-after").src,
    title: slide.querySelector(".ba-slide-title").textContent,
    description: slide.querySelector(".ba-slide-description").textContent,
  }));

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  // Indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToSlide(index));
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    }
  });

  // Touch/Swipe support
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Click to open lightbox
  slides.forEach((slide, index) => {
    const comparison = slide.querySelector(".ba-comparison");
    if (comparison) {
      comparison.addEventListener("click", () => openLightbox(index));
    }
  });

  function openLightbox(index) {
    const data = slideData[index];
    document.getElementById("lightboxBefore").src = data.beforeImg;
    document.getElementById("lightboxAfter").src = data.afterImg;
    document.getElementById("lightboxTitle").textContent = data.title;
    document.getElementById("lightboxDescription").textContent =
      data.description;

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    currentSlide = index;
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const data = slideData[currentSlide];
    document.getElementById("lightboxBefore").src = data.beforeImg;
    document.getElementById("lightboxAfter").src = data.afterImg;
    document.getElementById("lightboxTitle").textContent = data.title;
    document.getElementById("lightboxDescription").textContent =
      data.description;
  }

  // Lightbox controls
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      prevSlide();
      updateLightbox();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      nextSlide();
      updateLightbox();
    });
  }

  // Close lightbox on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation in lightbox
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("active")) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
        updateLightbox();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        updateLightbox();
      }
    }
  });

  // Touch/swipe in lightbox
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  lightbox.addEventListener(
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
        updateLightbox();
      }
    },
    { passive: true }
  );
}
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

/* ---------------------------------------------------------
   SCROLL INDICATOR FADE OUT
   --------------------------------------------------------- */
function initScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (!scrollIndicator) return;

  let ticking = false;

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;

        // Fade out after scrolling 100px
        if (scrollY > 100) {
          scrollIndicator.classList.add("hidden");
        } else {
          scrollIndicator.classList.remove("hidden");
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
}

/* ---------------------------------------------------------
   LENS RING CAROUSEL ROTATION
   --------------------------------------------------------- */
function initLensRingCarousels() {
  const shutterRing = document.getElementById("shutterRing");
  const focalRing = document.getElementById("focalRing");

  if (!shutterRing && !focalRing) return;

  let ticking = false;

  function updateRotation() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Don't rotate the ring itself - move each value individually
    if (shutterRing) {
      const shutterRotation = scrollY * 0.15; // degrees
      updateValuePositions(shutterRing, shutterRotation);
    }

    if (focalRing) {
      const focalRotation = scrollY * 0.2; // slightly faster
      updateValuePositions(focalRing, focalRotation);
    }

    ticking = false;
  }

  function updateValuePositions(ring, scrollRotation) {
    const values = ring.querySelectorAll(".lens-value");
    const radius = 50; // pixels from center

    values.forEach((value, index) => {
      // Each value has a base position (30deg apart)
      const baseRotation = index * 30;

      // Calculate actual rotation with scroll
      const actualRotation = baseRotation - scrollRotation;
      const radians = (actualRotation * Math.PI) / 180;

      // Calculate X and Y positions on the circle
      const x = Math.sin(radians) * radius;
      const z = Math.cos(radians) * radius;

      // Only show values with positive Z (facing viewer)
      let opacity = 0;
      if (z > -10) {
        if (z > 10) {
          opacity = 1;
        } else {
          opacity = (z + 10) / 20;
        }
      }

      // Position the value at calculated X/Z but always facing forward
      // Use translate3d for X and Z positioning, keeping text always horizontal and facing camera
      value.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotate(-90deg)`;
      value.style.opacity = opacity;
    });
  }

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateRotation);
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  updateRotation(); // Initial state
}

// Initialize on load
window.addEventListener("load", () => {
  initScrollPanels();
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
  initBeforeAfterCarousel();
  initMasonryGallery();
  initScrollIndicator();
  initLensRingCarousels();

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
