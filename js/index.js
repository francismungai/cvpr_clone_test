/**
 * Index Page - CVPR 2026
 */

(function () {
  "use strict";

  // Initialize when DOM is ready
  function init() {
    initAccordions();
  }

  // Accordion functionality for announcements
  function initAccordions() {
    const announcements = document.querySelectorAll(".announcement");

    announcements.forEach((announcement) => {
      const header = announcement.querySelector(".announcement-header");

      if (header) {
        header.addEventListener("click", function () {
          const isOpen = announcement.classList.toggle("open");
          this.setAttribute("aria-expanded", isOpen);

          // Close other announcements (accordion behavior)
          if (isOpen) {
            announcements.forEach((other) => {
              if (other !== announcement) {
                other.classList.remove("open");
                other
                  .querySelector(".announcement-header")
                  ?.setAttribute("aria-expanded", "false");
              }
            });
          }
        });

        // Keyboard accessibility
        header.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.click();
          }
        });
      }
    });
  }

  // Run init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
