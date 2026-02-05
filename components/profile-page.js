// ============================================
// PROFILE PAGE - Enhanced with Edit Mode
// ============================================

import { state } from '../js/state-manager.js';
import { router } from '../js/router.js';
import { showToast } from '../js/animations.js';

export function createProfilePage() {
    const user = state.get('user');
    const momentum = state.get('momentum');
    const leagues = state.get('leagues');
    const swipeMock = state.get('swipeMock');

    let isEditMode = false;

    const container = document.createElement('div');
    container.className = 'profile-container';
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px; max-width: 800px; margin: 0 auto;';

    function renderProfile() {
        container.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar-container">
          <div class="profile-avatar" id="avatar">
            ${user.avatar || user.name?.charAt(0).toUpperCase() || '🎮'}
          </div>
          ${isEditMode ? '<button class="btn-avatar-edit" id="change-avatar">📷</button>' : ''}
        </div>
        
        <div class="profile-info">
          ${isEditMode ? `
            <input 
              type="text" 
              id="edit-name" 
              class="profile-edit-input" 
              value="${user.name || ''}"
              placeholder="Your Name"
            />
            <input 
              type="text" 
              id="edit-bio" 
              class="profile-edit-input" 
              value="${user.bio || ''}"
              placeholder="Your bio (optional)"
            />
          ` : `
            <h2 class="profile-name">${user.name || 'User'}</h2>
            ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
          `}
          <p class="profile-target">🎯 Target: IELTS ${user.targetScore || 7.5}</p>
        </div>

        <div class="profile-actions">
          ${!isEditMode ? `
            <button class="btn btn-primary" id="edit-profile-btn">✏️ Edit</button>
          ` : `
            <button class="btn btn-success" id="save-profile-btn">💾 Save</button>
            <button class="btn btn-secondary" id="cancel-edit-btn">❌ Cancel</button>
          `}
        </div>
      </div>

      ${isEditMode ? `
        <div class="card mb-md">
          <h4 class="mb-md">🎮 Customize Profile</h4>
          
          <div class="form-group">
            <label>Target IELTS Score</label>
            <select id="edit-target-score" class="profile-edit-select">
              <option value="6.0" ${user.targetScore === 6.0 ? 'selected' : ''}>6.0</option>
              <option value="6.5" ${user.targetScore === 6.5 ? 'selected' : ''}>6.5</option>
              <option value="7.0" ${user.targetScore === 7.0 ? 'selected' : ''}>7.0</option>
              <option value="7.5" ${user.targetScore === 7.5 ? 'selected' : ''}>7.5</option>
              <option value="8.0" ${user.targetScore === 8.0 ? 'selected' : ''}>8.0</option>
              <option value="8.5" ${user.targetScore === 8.5 ? 'selected' : ''}>8.5</option>
              <option value="9.0" ${user.targetScore === 9.0 ? 'selected' : ''}>9.0</option>
            </select>
          </div>

          <div class="form-group">
            <label>Daily Commitment (minutes)</label>
            <select id="edit-commitment" class="profile-edit-select">
              <option value="5" ${user.dailyCommitment === 5 ? 'selected' : ''}>5 minutes</option>
              <option value="10" ${user.dailyCommitment === 10 ? 'selected' : ''}>10 minutes</option>
              <option value="15" ${user.dailyCommitment === 15 ? 'selected' : ''}>15 minutes</option>
              <option value="30" ${user.dailyCommitment === 30 ? 'selected' : ''}>30 minutes</option>
              <option value="60" ${user.dailyCommitment === 60 ? 'selected' : ''}>60 minutes</option>
            </select>
          </div>

          <div class="form-group">
            <label>Social Links (optional)</label>
            <input 
              type="url" 
              id="edit-website" 
              class="profile-edit-input" 
              value="${user.website || ''}"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      ` : ''}

      <div class="card mb-md">
        <h4 class="mb-md">📊 Your Stats</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${momentum.score || 0}</div>
            <div class="stat-label">Momentum</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${momentum.streak || 0}</div>
            <div class="stat-label">Streak</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${momentum.longestStreak || 0}</div>
            <div class="stat-label">Best Streak</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${swipeMock.totalSwipes || 0}</div>
            <div class="stat-label">Total Swipes</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${(swipeMock.mastered || []).length}</div>
            <div class="stat-label">Mastered</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${momentum.totalDaysActive || 0}</div>
            <div class="stat-label">Days Active</div>
          </div>
        </div>
      </div>

      <div class="card mb-md">
        <h4 class="mb-md">🏆 League Progress</h4>
        <div class="league-info">
          <div class="badge badge-${leagues.currentLeague}" style="font-size: var(--font-size-lg);">
            ${(leagues.currentLeague || 'bronze').toUpperCase()}
          </div>
          <div class="league-points">
            <div class="stat-value">${leagues.leaguePoints || 0}</div>
            <div class="stat-label">Points</div>
          </div>
        </div>
      </div>

      ${!isEditMode ? `
        <button class="btn btn-secondary mb-md" id="reset-btn" style="width: 100%;">
          🔄 Reset Progress (Demo)
        </button>
      ` : ''}

      <nav class="nav">
        <div class="nav-items">
          <div class="nav-item" data-route="/">
            <div class="nav-icon">🏠</div>
            <div class="nav-label">Home</div>
          </div>
          <div class="nav-item" data-route="/practice">
            <div class="nav-icon">📝</div>
            <div class="nav-label">Practice</div>
          </div>
          <div class="nav-item" data-route="/league">
            <div class="nav-icon">🏆</div>
            <div class="nav-label">League</div>
          </div>
          <div class="nav-item" data-route="/colleges">
            <div class="nav-icon">🎓</div>
            <div class="nav-label">Colleges</div>
          </div>
          <div class="nav-item active" data-route="/profile">
            <div class="nav-icon">👤</div>
            <div class="nav-label">Profile</div>
          </div>
        </div>
      </nav>
    `;

        attachEventListeners();
    }

    function attachEventListeners() {
        // Edit mode toggle
        const editBtn = container.querySelector('#edit-profile-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                isEditMode = true;
                renderProfile();
            });
        }

        // Cancel edit
        const cancelBtn = container.querySelector('#cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                isEditMode = false;
                renderProfile();
            });
        }

        // Save profile
        const saveBtn = container.querySelector('#save-profile-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const name = container.querySelector('#edit-name')?.value.trim();
                const bio = container.querySelector('#edit-bio')?.value.trim();
                const targetScore = parseFloat(container.querySelector('#edit-target-score')?.value);
                const dailyCommitment = parseInt(container.querySelector('#edit-commitment')?.value);
                const website = container.querySelector('#edit-website')?.value.trim();

                if (!name) {
                    showToast('Please enter your name', 'error');
                    return;
                }

                // Update user state
                state.update('user', {
                    ...user,
                    name,
                    bio,
                    targetScore,
                    dailyCommitment,
                    website
                });

                isEditMode = false;
                renderProfile();
                showToast('Profile updated! 🎉', 'success');
            });
        }

        // Change avatar
        const avatarBtn = container.querySelector('#change-avatar');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => {
                const avatars = ['🎮', '🍄', '⭐', '🏆', '🎯', '🚀', '💎', '👾', '🎪', '🎨'];
                const currentAvatar = user.avatar || user.name?.charAt(0).toUpperCase();
                const currentIndex = avatars.indexOf(currentAvatar);
                const nextIndex = (currentIndex + 1) % avatars.length;

                state.update('user', {
                    ...user,
                    avatar: avatars[nextIndex]
                });

                container.querySelector('#avatar').textContent = avatars[nextIndex];
            });
        }

        // Reset progress
        const resetBtn = container.querySelector('#reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all progress? This will clear all data.')) {
                    state.reset();
                    window.location.reload();
                }
            });
        }

        // Navigation
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const route = e.currentTarget.dataset.route;
                router.navigate(route);
            });
        });
    }

    renderProfile();
    return container;
}
