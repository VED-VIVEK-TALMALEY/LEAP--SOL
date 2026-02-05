// ============================================
// DASHBOARD PAGE - Post-Login Landing
// ============================================

import { state } from '../js/state-manager.js';
import { router } from '../js/router.js';
import { momentumEngine } from '../js/momentum-engine.js';
import { leagueSystem } from '../js/league-system.js';
import { animateNumber } from '../js/animations.js';

export function createDashboardPage() {
    const user = state.get('user');
    const momentum = state.get('momentum');
    const leagues = state.get('leagues');
    const swipeMock = state.get('swipeMock');

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    const container = document.createElement('div');
    container.className = 'dashboard-container';
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px;';

    // Get recent activity
    const recentActivity = getRecentActivity();
    const upcomingDeadlines = getUpcomingDeadlines();

    container.innerHTML = `
    <!-- Welcome Header -->
    <div class="dashboard-header">
      <div class="welcome-section">
        ${user.photoUrl ? `
          <img src="${user.photoUrl}" alt="Profile" class="dashboard-avatar profile-photo" />
        ` : `
          <div class="dashboard-avatar">
            ${user.avatar || user.name?.charAt(0).toUpperCase() || '🎮'}
          </div>
        `}
        <div class="welcome-text">
          <h2 class="welcome-greeting">${greeting}, ${user.name || 'User'}! 🎮</h2>
          <p class="welcome-subtitle">Ready to level up your IELTS game?</p>
        </div>
      </div>
    </div>

    <!-- Quick Stats Overview -->
    <div class="quick-stats">
      <div class="stat-card card">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-value" id="momentum-value">0</div>
          <div class="stat-label">Momentum</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-value" id="streak-value">0</div>
          <div class="stat-label">Day Streak</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <div class="stat-value">${leagues.leaguePoints || 0}</div>
          <div class="stat-label">League Points</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <div class="stat-value">${swipeMock.totalSwipes || 0}</div>
          <div class="stat-label">Total Swipes</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card mb-md">
      <h3 class="mb-md">⚡ Quick Start</h3>
      <div class="quick-actions-grid">
        <button class="action-btn" data-route="/practice">
          <div class="action-icon">📝</div>
          <div class="action-label">Practice</div>
        </button>
        <button class="action-btn" data-route="/feed">
          <div class="action-icon">📱</div>
          <div class="action-label">Feed</div>
        </button>
        <button class="action-btn" data-route="/league">
          <div class="action-icon">🏆</div>
          <div class="action-label">League</div>
        </button>
        <button class="action-btn" data-route="/colleges">
          <div class="action-icon">🎓</div>
          <div class="action-label">Colleges</div>
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    ${recentActivity.length > 0 ? `
      <div class="card mb-md">
        <h3 class="mb-md">📊 Recent Activity</h3>
        <div class="activity-list">
          ${recentActivity.map(activity => `
            <div class="activity-item">
              <div class="activity-icon">${activity.icon}</div>
              <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Upcoming Deadlines -->
    ${upcomingDeadlines.length > 0 ? `
      <div class="card mb-md">
        <h3 class="mb-md">⏰ Upcoming Deadlines</h3>
        <div class="deadline-list">
          ${upcomingDeadlines.map(deadline => `
            <div class="deadline-item">
              <div class="deadline-date">
                <div class="deadline-day">${deadline.day}</div>
                <div class="deadline-month">${deadline.month}</div>
              </div>
              <div class="deadline-content">
                <div class="deadline-title">${deadline.title}</div>
                <div class="deadline-college">${deadline.college}</div>
              </div>
              <div class="deadline-badge ${deadline.urgent ? 'urgent' : ''}">
                ${deadline.daysLeft} days
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- League Preview -->
    <div class="card mb-md">
      <div class="flex justify-between items-center mb-md">
        <h3>🏆 Your League</h3>
        <button class="btn btn-sm btn-ghost" id="view-league-btn">View All →</button>
      </div>
      <div class="league-preview-card">
        <div class="badge badge-${leagues.currentLeague}" style="font-size: var(--font-size-lg);">
          ${(leagues.currentLeague || 'bronze').toUpperCase()}
        </div>
        <div class="league-stats">
          <div class="league-stat">
            <div class="league-stat-value">${leagues.leaguePoints || 0}</div>
            <div class="league-stat-label">Points</div>
          </div>
          <div class="league-stat">
            <div class="league-stat-value">${leagues.rank || '-'}</div>
            <div class="league-stat-label">Rank</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-items">
        <div class="nav-item active" data-route="/">
          <div class="nav-icon">🏠</div>
          <div class="nav-label">Home</div>
        </div>
        <div class="nav-item" data-route="/practice">
          <div class="nav-icon">📝</div>
          <div class="nav-label">Practice</div>
        </div>
        <div class="nav-item" data-route="/feed">
          <div class="nav-icon">📱</div>
          <div class="nav-label">Feed</div>
        </div>
        <div class="nav-item" data-route="/league">
          <div class="nav-icon">🏆</div>
          <div class="nav-label">League</div>
        </div>
        <div class="nav-item" data-route="/profile">
          <div class="nav-icon">👤</div>
          <div class="nav-label">Profile</div>
        </div>
      </div>
    </nav>
  `;

    // Attach event listeners
    setTimeout(() => {
        // Animate numbers
        const momentumEl = container.querySelector('#momentum-value');
        const streakEl = container.querySelector('#streak-value');
        if (momentumEl) animateNumber(momentumEl, 0, momentum.score || 0, 1500);
        if (streakEl) animateNumber(streakEl, 0, momentum.streak || 0, 1000);

        // Quick action buttons
        container.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const route = e.currentTarget.dataset.route;
                if (route) router.navigate(route);
            });
        });

        // View league button
        container.querySelector('#view-league-btn')?.addEventListener('click', () => {
            router.navigate('/league');
        });

        // Navigation
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const route = e.currentTarget.dataset.route;
                router.navigate(route);
            });
        });
    }, 0);

    return container;
}

// Helper function to get recent activity
function getRecentActivity() {
    const activities = [];
    const momentum = state.get('momentum');
    const swipeMock = state.get('swipeMock');

    if (momentum.lastPracticeDate) {
        const lastPractice = new Date(momentum.lastPracticeDate);
        const now = new Date();
        const diffHours = Math.floor((now - lastPractice) / (1000 * 60 * 60));

        activities.push({
            icon: '📝',
            title: 'Completed practice session',
            time: diffHours < 1 ? 'Just now' : diffHours < 24 ? `${diffHours}h ago` : `${Math.floor(diffHours / 24)}d ago`
        });
    }

    if (swipeMock.mastered && swipeMock.mastered.length > 0) {
        activities.push({
            icon: '⭐',
            title: `Mastered ${swipeMock.mastered.length} questions`,
            time: 'Today'
        });
    }

    if (momentum.streak > 0) {
        activities.push({
            icon: '🔥',
            title: `${momentum.streak} day streak maintained`,
            time: 'Ongoing'
        });
    }

    return activities.slice(0, 5);
}

// Helper function to get upcoming deadlines
function getUpcomingDeadlines() {
    // This would come from application tracker in a real implementation
    const applications = state.get('applications') || [];

    return applications
        .filter(app => app.deadline && app.status !== 'submitted')
        .map(app => {
            const deadline = new Date(app.deadline);
            const now = new Date();
            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

            return {
                day: deadline.getDate(),
                month: deadline.toLocaleString('default', { month: 'short' }),
                title: app.program || 'Application',
                college: app.college || 'University',
                daysLeft,
                urgent: daysLeft <= 7
            };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 3);
}
