// Video Showcase - Filtering & Modal (extracted)
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

// Export for reuse
export { initVideoShowcase };
