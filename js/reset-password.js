/**
 * Password Reset Logic - Supabase Integration
 */
(function () {
  "use strict";

  const SUPABASE_URL = "https://frwedgprpfgkmhngbclc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_fOehLASCcRaDMQxWtfOuZg_8WVM5RD9";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
  );

  document.addEventListener("DOMContentLoaded", () => {
    const resetForm = document.getElementById("reset-password-form");
    const messageEl = document.getElementById("reset-message");
    const submitBtn = document.getElementById("reset-submit-btn");

    if (!resetForm) return;

    // Helper to match your custom alert styles
    function showMessage(message, type) {
      if (!messageEl) return;
      messageEl.textContent = message;
      messageEl.className = `form-message ${type}`;
      messageEl.style.display = "block";
    }

    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newPassword = document.getElementById("new-password").value;
      const confirmNewPassword =
        document.getElementById("confirm-password").value;

      if (newPassword !== confirmNewPassword) {
        showMessage("Passwords do not match.", "error");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Updating...";
      }

      // Update password using the session from the emailed link
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        showMessage(error.message, "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Update Password";
        }
      } else {
        showMessage(
          "Success! Your password has been updated. Redirecting...",
          "success",
        );

        // Log out to force a fresh login with the new credentials
        await supabaseClient.auth.signOut();

        // Redirect to home with the login modal trigger
        setTimeout(() => {
          window.location.href = "index.html?login=true";
        }, 2000);
      }
    });

    // Verify session exists (ensure they used the email link)
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        showMessage(
          "Error: No active session found. Please use the link sent to your email.",
          "error",
        );
        if (submitBtn) submitBtn.disabled = true;
      }
    });
  });
})();
