/**
 * Authentication Logic - Supabase Integration
 */
(function () {
  "use strict";

  const SUPABASE_URL = "https://frwedgprpfgkmhngbclc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_fOehLASCcRaDMQxWtfOuZg_8WVM5RD9";

  // Initialize Supabase client
  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
  );

  // Wait for components.js to inject the HTML into the DOM
  document.addEventListener("componentsLoaded", () => {
    const loggedOutContainer = document.getElementById("auth-logged-out");
    const loggedInContainer = document.getElementById("auth-logged-in");
    const userEmailDisplay = document.getElementById("user-email-display");

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const forgotForm = document.getElementById("forgot-password-form");

    // Utility function for message alerts
    function showMessage(element, message, type) {
      if (!element) return;
      element.textContent = message;
      element.className = `form-message ${type}`;
      element.style.display = "block";
    }

    // Update the Navbar UI based on session
    function updateAuthUI(session) {
      if (session) {
        if (loggedOutContainer) loggedOutContainer.classList.add("hidden");
        if (loggedInContainer) loggedInContainer.classList.remove("hidden");
        if (userEmailDisplay) {
          // Display the email in the dropdown trigger
          userEmailDisplay.textContent = session.user.email || "Profile";
        }
      } else {
        if (loggedOutContainer) loggedOutContainer.classList.remove("hidden");
        if (loggedInContainer) loggedInContainer.classList.add("hidden");
        if (userEmailDisplay) userEmailDisplay.textContent = "Profile";
      }
    }

    // Check initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      updateAuthUI(session);
    });

    // Listen to auth state changes
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      updateAuthUI(session);
    });

    // --- Login Handler ---
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const messageEl = document.getElementById("login-message");
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // Loading State
        showMessage(messageEl, "Verifying credentials...", "success");
        if (submitBtn) {
          submitBtn.disabled = true;
          const originalText = submitBtn.textContent;
          submitBtn.textContent = "Loading...";
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          showMessage(messageEl, error.message, "error");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
          }
        } else {
          showMessage(messageEl, "Success!", "success");

          // Force the modal to close using the helper in navbar.js
          setTimeout(() => {
            if (typeof window.closeAuthModal === "function") {
              window.closeAuthModal();
            } else {
              // Fallback if helper isn't found
              const modal = document.getElementById("loginModal");
              if (modal) {
                modal.classList.remove("open");
                document.body.style.overflow = "";
              }
            }

            // Cleanup for next open
            loginForm.reset();
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Login";
            }
            messageEl.style.display = "none";
          }, 600);
        }
      });
    }

    // --- Signup Handler ---
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById(
          "signup-confirm-password",
        ).value;
        const messageEl = document.getElementById("signup-message");

        if (password !== confirmPassword) {
          showMessage(messageEl, "Passwords do not match.", "error");
          return;
        }

        showMessage(messageEl, "Creating account...", "success");

        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
        });

        if (error) {
          showMessage(messageEl, error.message, "error");
        } else {
          showMessage(
            messageEl,
            "Success! Please check your email for confirmation.",
            "success",
          );
          signupForm.reset();

          // Switch back to login tab after 2 seconds
          setTimeout(() => {
            const loginTab = document.getElementById("login-tab");
            if (loginTab) loginTab.click();
          }, 2000);
        }
      });
    }

    // --- Forgot Password Handler ---
    if (forgotForm) {
      forgotForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("forgot-email").value;
        const messageEl = document.getElementById("forgot-message");

        showMessage(messageEl, "Sending reset link...", "success");

        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: window.location.origin + "/reset-password.html",
          },
        );

        if (error) {
          showMessage(messageEl, error.message, "error");
        } else {
          showMessage(
            messageEl,
            "Instructions sent! Check your email.",
            "success",
          );
          forgotForm.reset();
        }
      });
    }

    // Global logout function
    window.logout = async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
      } else {
        // Force dropdown to close
        const userDropdown = document.querySelector(".user-dropdown");
        if (userDropdown) userDropdown.classList.remove("open");
        // Optional: Redirect to home on logout
        window.location.href = "index.html";
      }
    };
  });
})();
