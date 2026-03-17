/**
 * Auth Modal UI Logic (Tab switching, closing, etc.)
 */
(function () {
  "use strict";

  document.addEventListener("componentsLoaded", () => {
    const modal = document.getElementById("loginModal");
    if (!modal) return;

    const closeBtn = modal.querySelector(".modal-close");
    const tabs = modal.querySelectorAll(".modal-tab");
    const panels = modal.querySelectorAll(".modal-panel");
    const forgotPasswordBtn = document.getElementById("show-forgot-password");
    const backToLoginBtn = document.getElementById("back-to-login");

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function switchTab(targetId) {
      tabs.forEach((tab) => {
        const isActive = tab.getAttribute("aria-controls") === targetId;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", isActive);
      });
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetId);
      });
    }

    // Close interactions
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });

    // Tab interactions
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        switchTab(this.getAttribute("aria-controls"));
      });
    });

    if (forgotPasswordBtn) {
      forgotPasswordBtn.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab("forgot-panel");
      });
    }

    if (backToLoginBtn) {
      backToLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab("login-panel");
      });
    }
  });
})();
