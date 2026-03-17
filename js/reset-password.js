const SUPABASE_URL = 'https://frwedgprpfgkmhngbclc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fOehLASCcRaDMQxWtfOuZg_8WVM5RD9';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-password-form');
    const messageEl = document.getElementById('reset-message');
    const backToHome = document.getElementById('back-to-home-container');

    // When the user clicks the link in their email, Supabase processes the hash in the URL 
    // and automatically logs them in establishing an active session on this loaded page.
    
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            messageEl.textContent = 'Passwords do not match.';
            messageEl.className = 'text-danger mt-2';
            return;
        }

        messageEl.textContent = 'Updating password...';
        messageEl.className = 'text-primary mt-2';

        // Update the user's password using the active session from the emailed link (or if they are already logged in)
        const { data, error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) {
            messageEl.textContent = error.message;
            messageEl.className = 'text-danger mt-2';
        } else {
            messageEl.textContent = 'Success! Your password has been successfully updated.';
            messageEl.className = 'text-success mt-2 fw-bold';
            resetForm.style.display = 'none';
            backToHome.classList.remove('d-none');
            
            // Log out the user to force them to log in with the new password
            await supabaseClient.auth.signOut();
        }
    });

    // Check if the user is actually authenticated
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            messageEl.textContent = 'Error: No active session found. You must use the link sent to your email or be logged in to reset your password.';
            messageEl.className = 'text-danger mt-2';
            resetForm.querySelector('button[type="submit"]').disabled = true;
            backToHome.classList.remove('d-none');
        }
    });
});
