/**
 * Component Loader - Purely fetches and injects HTML
 */
(function () {
  "use strict";

  async function loadComponent(url, placeholderId) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      const html = await response.text();
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) {
        placeholder.innerHTML = html;
      }
    } catch (error) {
      console.error(`Error loading component: ${error.message}`);
    }
  }

  async function initComponents() {
    await Promise.all([
      loadComponent("components/navbar.html", "navbar-placeholder"),
      loadComponent("components/footer.html", "footer-placeholder"),
      loadComponent("components/auth-modal.html", "auth-modal-placeholder"),
    ]);

    // Broadcast that all HTML is injected and ready
    const event = new Event("componentsLoaded");
    document.dispatchEvent(event);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initComponents);
  } else {
    initComponents();
  }
})();
