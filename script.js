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
  const imageContainer = document.querySelector(
    ".masonry-lightbox-image-container"
  );

  let images = [];
  let currentIndex = 0;
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
  }

  // Update lightbox content
  function updateLightbox() {
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
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
    }
  });

  // Event listeners
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", prevImage);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);

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
   COMING SOON TITLE MOUSE FOLLOW
   --------------------------------------------------------- */
function initComingSoonFollow() {
  const container = document.querySelector(".coming-soon-container");
  const title = document.querySelector(".coming-soon-title");
  if (!container || !title) return;

  // Add class to disable glitch translation jitter
  title.classList.add("mouse-follow");
  // Target offsets for each pseudo element
  let targetBeforeX = 0,
    targetBeforeY = 0;
  let targetAfterX = 0,
    targetAfterY = 0;
  let currentBeforeX = 0,
    currentBeforeY = 0;
  let currentAfterX = 0,
    currentAfterY = 0;
  const ease = 0.15;
  const rangeX = 60; // subtle horizontal dispersion
  const rangeY = 25; // subtle vertical dispersion

  // Device orientation support for mobile tilt
  let useDeviceOrientation = false;

  function onMove(e) {
    const rect = container.getBoundingClientRect();
    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const relX = (clientX - rect.left) / rect.width; // 0..1
    const relY = (clientY - rect.top) / rect.height; // 0..1
    // Map to -0.5..0.5
    const nx = relX - 0.5;
    const ny = relY - 0.5;
    // Pink layer (before) moves one direction
    targetBeforeX = nx * rangeX;
    targetBeforeY = ny * rangeY;
    // Cyan layer (after) moves opposite for chromatic separation
    targetAfterX = -nx * rangeX;
    targetAfterY = -ny * rangeY;
  }

  function onDeviceOrientation(e) {
    if (!useDeviceOrientation) return;

    // beta: front-back tilt (-180 to 180), gamma: left-right tilt (-90 to 90)
    const beta = e.beta || 0;
    const gamma = e.gamma || 0;

    // Normalize to -0.5 to 0.5 range
    const nx = Math.max(-0.5, Math.min(0.5, gamma / 90));
    const ny = Math.max(-0.5, Math.min(0.5, (beta - 90) / 90));

    // Apply movement
    targetBeforeX = nx * rangeX;
    targetBeforeY = ny * rangeY;
    targetAfterX = -nx * rangeX;
    targetAfterY = -ny * rangeY;
  }

  function animate() {
    // ease both layers toward targets
    currentBeforeX += (targetBeforeX - currentBeforeX) * ease;
    currentBeforeY += (targetBeforeY - currentBeforeY) * ease;
    currentAfterX += (targetAfterX - currentAfterX) * ease;
    currentAfterY += (targetAfterY - currentAfterY) * ease;
    title.style.setProperty(
      "--glitch-before-x",
      currentBeforeX.toFixed(2) + "px"
    );
    title.style.setProperty(
      "--glitch-before-y",
      currentBeforeY.toFixed(2) + "px"
    );
    title.style.setProperty(
      "--glitch-after-x",
      currentAfterX.toFixed(2) + "px"
    );
    title.style.setProperty(
      "--glitch-after-y",
      currentAfterY.toFixed(2) + "px"
    );
    requestAnimationFrame(animate);
  }

  container.addEventListener("mousemove", onMove);
  container.addEventListener("touchmove", onMove, { passive: true });

  // Request device orientation permission and enable tilt on mobile
  function requestOrientationPermission() {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ requires permission - must be called from user gesture
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            useDeviceOrientation = true;
            window.addEventListener("deviceorientation", onDeviceOrientation, {
              passive: true,
            });
          }
        })
        .catch((err) => {
          // Permission denied - feature disabled
        });
    }
  }

  // Try to enable orientation on first touch/click
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    // iOS 13+ - wait for user interaction
    container.addEventListener("touchstart", requestOrientationPermission, {
      once: true,
      passive: true,
    });
    container.addEventListener("click", requestOrientationPermission, {
      once: true,
    });
  } else if (window.DeviceOrientationEvent) {
    // Android and other devices - enable immediately
    useDeviceOrientation = true;
    window.addEventListener("deviceorientation", onDeviceOrientation, {
      passive: true,
    });
  }

  animate();
}

// Initialize mouse follow after other showcase init
initComingSoonFollow();
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
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    },
    { threshold: 0.5 }
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
  const nav = document.querySelector(".minimal-nav");
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

        // Top nav frosted banner: reinforce opacity when scrolled
        if (nav) {
          if (scrollY > 8) {
            nav.classList.add("scrolled");
          } else {
            nav.classList.remove("scrolled");
          }
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

    // Get section positions
    const photographySection = document.getElementById("photography");
    const videographySection = document.getElementById("videography");

    // Don't rotate the ring itself - move each value individually
    if (shutterRing && photographySection) {
      const sectionTop = photographySection.offsetTop;
      const scrollFromSection = scrollY - sectionTop;
      const shutterRotation = scrollFromSection * 0.15; // degrees
      // Offset so 1/125 (index 6) is at front when at photography section
      // 6 * 30 = 180 degrees offset
      const offsetRotation = shutterRotation + 180;
      const snappedShutterRotation = Math.round(offsetRotation / 30) * 30;
      updateValuePositions(shutterRing, snappedShutterRotation);
    }

    if (focalRing && videographySection) {
      const sectionTop = videographySection.offsetTop;
      const scrollFromSection = scrollY - sectionTop;
      const focalRotation = scrollFromSection * 0.2; // slightly faster
      // Offset so 50mm (index 3) is at front when at videography section
      // 3 * 30 = 90 degrees offset
      const offsetRotation = focalRotation + 90;
      const snappedFocalRotation = Math.round(offsetRotation / 30) * 30;
      updateValuePositions(focalRing, snappedFocalRotation);
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

      // Check if this is the front-most value (highest Z value)
      const isFront = z > 45; // Front position threshold

      // Style based on position
      if (isFront) {
        value.style.color = "#8b5cf6";
        value.style.fontSize = "0.95rem";
        value.style.fontWeight = "700";
        value.style.textShadow =
          "0 0 12px rgba(139, 92, 246, 0.25), 0 2px 10px rgba(0, 0, 0, 0.9)";
      } else {
        value.style.color = "#ffffff";
        value.style.fontSize = "0.8rem";
        value.style.fontWeight = "600";
        value.style.textShadow = "0 2px 10px rgba(0, 0, 0, 0.9)";
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

/* --------------------------------------------------------- 
   Interactive Blur Focus Effect
   --------------------------------------------------------- */
function initInteractiveBlur() {
  const capturedPanel = document.getElementById("panel-2");
  const craftedPanel = document.getElementById("panel-3");
  const capturedSharp = document.getElementById("capturedSharp");
  const craftedSharp = document.getElementById("craftedSharp");

  const pairs = [
    { panel: capturedPanel, sharp: capturedSharp },
    { panel: craftedPanel, sharp: craftedSharp },
  ];

  pairs.forEach(({ panel, sharp }) => {
    if (!panel || !sharp) return;

    panel.addEventListener("mousemove", (e) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update mask position to create a circular reveal with soft edges
      const radius = 300; // pixels
      sharp.style.webkitMaskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 60%, transparent 100%)`;
      sharp.style.maskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 60%, transparent 100%)`;
    });

    panel.addEventListener("mouseleave", () => {
      sharp.style.webkitMaskImage = `radial-gradient(circle 0px at 50% 50%, black 60%, transparent 100%)`;
      sharp.style.maskImage = `radial-gradient(circle 0px at 50% 50%, black 60%, transparent 100%)`;
    });
  });
}

/* ---------------------------------------------------------
   DEVICE TILT EFFECTS (Mobile)
   --------------------------------------------------------- */
function initDeviceTiltEffects() {
  // Only run on devices with orientation support
  if (!window.DeviceOrientationEvent) return;

  const contactPanel = document.querySelector(".contact-panel");
  const categoryTiles = document.querySelectorAll(
    ".category-tile:not(.single-tile)"
  );
  const categoryTitles = document.querySelectorAll(".category-title");
  const socialLinks = document.querySelectorAll(".social-links a");
  const ctaButtons = document.querySelectorAll(".cta-button");

  let permissionGranted = false;
  let permissionRequested = false;
  let lastUpdate = 0;
  const throttleMs = 50; // Throttle to 20fps for better performance

  function handleOrientation(e) {
    if (!permissionGranted) return;

    // Validate orientation data
    if (e.beta === null || e.gamma === null) return;

    // Throttle updates for performance
    const now = Date.now();
    if (now - lastUpdate < throttleMs) return;
    lastUpdate = now;

    const beta = e.beta; // front-back tilt (-180 to 180)
    const gamma = e.gamma; // left-right tilt (-90 to 90)

    // Normalize tilt values
    const tiltX = gamma * 0.5; // -45 to 45
    const tiltY = (beta - 90) * 0.5; // adjusted for portrait

    // Parallax effect on contact panel
    if (contactPanel && isElementInViewport(contactPanel)) {
      const parallaxX = Math.max(-15, Math.min(15, gamma * 0.3));
      const parallaxY = Math.max(-15, Math.min(15, (beta - 90) * 0.3));
      contactPanel.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
    }

    // 3D tilt on category tiles (excluding single-tile for videography)
    categoryTiles.forEach((tile) => {
      if (isElementInViewport(tile)) {
        const rotateX = Math.max(-5, Math.min(5, -tiltY * 0.08));
        const rotateY = Math.max(-5, Math.min(5, tiltX * 0.08));
        tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    // Subtle tilt on category title text for depth (independent from tile)
    categoryTitles.forEach((title) => {
      if (isElementInViewport(title)) {
        const rotateX = Math.max(-8, Math.min(8, -tiltY * 0.12));
        const rotateY = Math.max(-8, Math.min(8, tiltX * 0.12));
        title.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      }
    });

    // Floating effect on social links
    socialLinks.forEach((link, index) => {
      if (isElementInViewport(link)) {
        const offsetX = Math.max(
          -8,
          Math.min(8, tiltX * (0.15 + index * 0.02))
        );
        const offsetY = Math.max(
          -8,
          Math.min(8, tiltY * (0.15 + index * 0.02))
        );
        link.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    });

    // Subtle depth on CTA buttons
    ctaButtons.forEach((button) => {
      if (isElementInViewport(button)) {
        const rotateX = Math.max(-2, Math.min(2, -tiltY * 0.03));
        const rotateY = Math.max(-2, Math.min(2, tiltX * 0.03));
        button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });
  }

  function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  // Request permission for iOS 13+
  function requestOrientationPermission() {
    if (permissionRequested) return;
    permissionRequested = true;

    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            permissionGranted = true;
            window.addEventListener("deviceorientation", handleOrientation, {
              passive: true,
            });
          }
        })
        .catch((err) => {
          // Tilt permission denied - feature disabled
        });
    }
  }

  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    // iOS 13+ - request permission on first scroll or after a short delay
    setTimeout(() => {
      const scrollTrigger = () => {
        if (!permissionRequested && window.scrollY > 50) {
          requestOrientationPermission();
          window.removeEventListener("scroll", scrollTrigger);
        }
      };
      window.addEventListener("scroll", scrollTrigger, { passive: true });
    }, 1000);
  } else if (window.DeviceOrientationEvent) {
    // Android and other devices - auto enable
    permissionGranted = true;
    window.addEventListener("deviceorientation", handleOrientation, {
      passive: true,
    });
  }
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
  initInteractiveBlur();
  initDeviceTiltEffects();

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
