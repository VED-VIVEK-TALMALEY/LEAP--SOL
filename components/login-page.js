// ============================================
// LOGIN PAGE COMPONENT
// ============================================

import { authService } from '../js/auth-service.js';
import { router } from '../js/router.js';
import { showToast, createRipple } from '../js/animations.js';

export function createLoginPage() {
    const container = document.createElement('div');
    container.className = 'auth-container';

    container.innerHTML = `
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">🚀</div>
        <h1>Welcome Back</h1>
        <p class="text-secondary">Sign in to continue your IELTS journey</p>
      </div>

      ${authService.isOffline() ? `
        <div class="alert alert-warning mb-lg">
          <strong>⚠️ Offline Mode</strong>
          <p>Supabase is not configured. You can still use the app, but your data won't sync to the cloud.</p>
          <button class="btn btn-sm btn-ghost mt-sm" id="skip-login-btn">Continue Offline</button>
        </div>
      ` : ''}

      <form class="auth-form" id="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="your@email.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="button" class="btn-link" id="forgot-password-btn">
          Forgot password?
        </button>

        <button type="submit" class="btn btn-gradient btn-lg" id="login-btn" style="width: 100%;">
          Sign In
        </button>

        <div class="auth-divider">
          <span>or</span>
        </div>

        <button type="button" class="btn btn-glass" id="register-link-btn" style="width: 100%;">
          Create New Account
        </button>
      </form>
    </div>
  `;

    // Event listeners
    setTimeout(() => {
        const form = container.querySelector('#login-form');
        const loginBtn = container.querySelector('#login-btn');
        const registerBtn = container.querySelector('#register-link-btn');
        const forgotBtn = container.querySelector('#forgot-password-btn');
        const skipBtn = container.querySelector('#skip-login-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = container.querySelector('#email').value;
            const password = container.querySelector('#password').value;

            loginBtn.disabled = true;
            loginBtn.textContent = 'Signing in...';

            const { data, error } = await authService.signIn(email, password);

            if (error) {
                showToast(error.message, 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In';
            } else {
                showToast('Welcome back! 🎉', 'success');
                router.navigate('/');
            }
        });

        registerBtn?.addEventListener('click', () => {
            router.navigate('/register');
        });

        forgotBtn?.addEventListener('click', async () => {
            const email = container.querySelector('#email').value;
            if (!email) {
                showToast('Please enter your email first', 'warning');
                return;
            }

            const { error } = await authService.resetPassword(email);
            if (error) {
                showToast(error.message, 'error');
            } else {
                showToast('Password reset email sent! Check your inbox.', 'success');
            }
        });

        skipBtn?.addEventListener('click', () => {
            router.navigate('/onboarding');
        });
    }, 0);

    return container;
}
