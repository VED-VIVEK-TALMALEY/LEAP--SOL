// ============================================
// REGISTER PAGE COMPONENT
// ============================================

import { authService } from '../js/auth-service.js';
import { router } from '../js/router.js';
import { showToast } from '../js/animations.js';

export function createRegisterPage() {
    const container = document.createElement('div');
    container.className = 'auth-container';

    container.innerHTML = `
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">🎓</div>
        <h1>Start Your Journey</h1>
        <p class="text-secondary">Create your account and begin preparing for IELTS</p>
      </div>

      <form class="auth-form" id="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="John Doe"
            required
          />
        </div>

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
            autocomplete="new-password"
            minlength="6"
          />
          <small class="text-tertiary">At least 6 characters</small>
        </div>

        <div class="form-group">
          <label for="target-score">Target IELTS Score</label>
          <select id="target-score" name="targetScore" required>
            <option value="6.5">6.5</option>
            <option value="7.0">7.0</option>
            <option value="7.5" selected>7.5</option>
            <option value="8.0">8.0</option>
            <option value="8.5">8.5</option>
            <option value="9.0">9.0</option>
          </select>
        </div>

        <div class="form-group">
          <label>Daily Commitment</label>
          <div class="commitment-options">
            <button type="button" class="commitment-option" data-minutes="5">
              <span class="commitment-time">5 min</span>
              <span class="commitment-label">Quick</span>
            </button>
            <button type="button" class="commitment-option active" data-minutes="15">
              <span class="commitment-time">15 min</span>
              <span class="commitment-label">Standard</span>
            </button>
            <button type="button" class="commitment-option" data-minutes="30">
              <span class="commitment-time">30 min</span>
              <span class="commitment-label">Intensive</span>
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-gradient btn-lg" id="register-btn" style="width: 100%;">
          Create Account
        </button>

        <div class="auth-divider">
          <span>or</span>
        </div>

        <button type="button" class="btn btn-glass" id="login-link-btn" style="width: 100%;">
          Already have an account? Sign In
        </button>
      </form>
    </div>
  `;

    // Event listeners
    setTimeout(() => {
        let selectedCommitment = 15;
        const form = container.querySelector('#register-form');
        const registerBtn = container.querySelector('#register-btn');
        const loginBtn = container.querySelector('#login-link-btn');

        // Commitment selection
        container.querySelectorAll('.commitment-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('.commitment-option').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                selectedCommitment = parseInt(e.currentTarget.dataset.minutes);
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = container.querySelector('#name').value.trim();
            const email = container.querySelector('#email').value;
            const password = container.querySelector('#password').value;
            const targetScore = parseFloat(container.querySelector('#target-score').value);

            if (!name) {
                showToast('Please enter your name', 'warning');
                return;
            }

            registerBtn.disabled = true;
            registerBtn.textContent = 'Creating account...';

            const { data, error } = await authService.signUp(email, password, {
                name,
                targetScore,
                dailyCommitment: selectedCommitment
            });

            if (error) {
                showToast(error.message, 'error');
                registerBtn.disabled = false;
                registerBtn.textContent = 'Create Account';
            } else {
                showToast('Account created! Welcome to LEAP! 🎉', 'success');
                router.navigate('/');
            }
        });

        loginBtn?.addEventListener('click', () => {
            router.navigate('/login');
        });
    }, 0);

    return container;
}
