/**
 * Navbar UI Logic
 */
(function () {
  "use strict";

  document.addEventListener("componentsLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const loginBtn = document.getElementById("login-btn");
    const dropdowns = document.querySelectorAll(".nav-dropdown");

    // --- Mobile Menu Toggle ---
    if (menuToggle && mobileNav) {
      menuToggle.addEventListener("click", function () {
        const isOpen = mobileNav.classList.toggle("open");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen);
      });
    }

    // --- Login Button opens modal ---
    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        const modal = document.getElementById("loginModal");
        if (modal) {
          modal.classList.add("open");
          modal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";

          const firstInput = modal.querySelector("input");
          if (firstInput) setTimeout(() => firstInput.focus(), 100);
        }
      });
    }

    // --- Desktop Nav Dropdowns (Calls/Attend) ---
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".nav-dropdown-trigger");

      if (trigger) {
        trigger.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          // Close other open dropdowns first
          dropdowns.forEach((d) => {
            if (d !== dropdown) d.classList.remove("open");
          });

          const isOpen = dropdown.classList.toggle("open");
          trigger.setAttribute("aria-expanded", isOpen);
        });
      }
    });

    // --- User Profile Dropdown (Event Delegation) ---
    // Using delegation because this element is often toggled by Auth state
    document.addEventListener("click", function (e) {
      const userTrigger = e.target.closest(".user-dropdown-trigger");
      const userDropdown = e.target.closest(".user-dropdown");

      if (userTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = userDropdown.classList.toggle("open");
        userTrigger.setAttribute("aria-expanded", isOpen);
      } else {
        // Close user dropdown if clicking elsewhere
        const activeUserDropdown = document.querySelector(
          ".user-dropdown.open",
        );
        if (activeUserDropdown && !e.target.closest(".user-dropdown")) {
          activeUserDropdown.classList.remove("open");
          activeUserDropdown
            .querySelector(".user-dropdown-trigger")
            ?.setAttribute("aria-expanded", "false");
        }
      }

      // Close standard nav dropdowns if clicking elsewhere
      if (!e.target.closest(".nav-dropdown")) {
        dropdowns.forEach((d) => {
          d.classList.remove("open");
          d.querySelector(".nav-dropdown-trigger")?.setAttribute(
            "aria-expanded",
            "false",
          );
        });
      }
    });

    // --- Global Helpers ---
    window.closeAuthModal = function () {
      const modal = document.getElementById("loginModal");
      if (modal) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    };

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        // Close Modal
        window.closeAuthModal();
        // Close Dropdowns
        dropdowns.forEach((d) => d.classList.remove("open"));
        document.querySelector(".user-dropdown")?.classList.remove("open");
      }
    });

    // --- Auto-Open Login Modal from Redirect ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("login") === "true") {
      const modal = document.getElementById("loginModal");
      if (modal) {
        // Trigger the same logic as the login button
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // If you want to show a "Password updated" message in the modal itself:
        const loginMessage = document.getElementById("login-message");
        if (loginMessage) {
          loginMessage.textContent =
            "Password updated! Please log in with your new password.";
          loginMessage.className = "form-message success";
          loginMessage.style.display = "block";
        }

        // Clean up the URL so refreshing doesn't keep opening the modal
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    }
  });
})();
