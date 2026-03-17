/**
 * Dates Page Logic - CVPR 2026
 * Handles live countdown timers and timezone detection
 */

(function () {
  "use strict";

  // Automatically detect and display the user's local timezone
  function initTimezone() {
    const tzElement = document.getElementById("user-timezone");
    if (tzElement) {
      // This built-in JS object safely grabs the system timezone (e.g., "America/Chicago")
      const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
      tzElement.textContent = userTZ;
    }
  }

  function initCountdowns() {
    const countdownElements = document.querySelectorAll(
      ".countdown[data-target]",
    );

    function updateTimers() {
      const now = new Date().getTime();

      countdownElements.forEach((el) => {
        const targetString = el.getAttribute("data-target");

        if (
          !targetString ||
          targetString === "Passed" ||
          targetString === "--"
        ) {
          return;
        }

        const targetDate = new Date(targetString).getTime();
        const distance = targetDate - now;

        if (distance < 0) {
          el.textContent = "Passed";
          el.classList.remove("countdown--active");

          const row = el.closest("tr");
          if (row) {
            row.classList.add("date-row--past");
            row.classList.remove("date-row--current");
            row
              .querySelectorAll("td, span, a")
              .forEach((child) => child.classList.add("muted"));
          }
          return;
        }

        const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor(
          (distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24),
        );
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const w = String(weeks).padStart(2, "0");
        const d = String(days).padStart(2, "0");
        const h = String(hours).padStart(2, "0");
        const m = String(minutes).padStart(2, "0");
        const s = String(seconds).padStart(2, "0");

        el.textContent = `${w}w ${d}d ${h}:${m}:${s}`;
      });
    }

    updateTimers();
    setInterval(updateTimers, 1000);
  }

  // Ensure DOM is fully loaded before trying to find the elements
  function initializePage() {
    initTimezone();
    initCountdowns();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
  } else {
    initializePage();
  }
})();
