// ============================================
// HOME PAGE - Main Dashboard
// ============================================

import { state } from '../js/state-manager.js';
import { momentumEngine } from '../js/momentum-engine.js';
import { leagueSystem } from '../js/league-system.js';
import { router } from '../js/router.js';
import { animateNumber, createProgressRing } from '../js/animations.js';

export function createHomePage() {
  const momentum = state.get('momentum.score') || 0;
  const streak = state.get('momentum.streak') || 0;
  const streakPaused = state.get('momentum.streakPaused');
  const dailyAction = momentumEngine.getDailyAction();
  const insights = momentumEngine.getInsights();
  const currentLeague = leagueSystem.getCurrentLeague();
  const leaguePoints = state.get('leagues.leaguePoints') || 0;

  const container = document.createElement('div');
  container.className = 'home-container';

  container.innerHTML = `
    <!-- Hero Section with Momentum Score -->
    <div class="hero-section">
      <div class="momentum-score-display glow float" id="momentum-display">
        <div class="momentum-score-value gradient-text" id="momentum-value">0</div>
      </div>
      <div class="momentum-label">Momentum Score</div>
      
      <div class="streak-display ${streakPaused ? 'paused' : ''}">
        <span class="streak-icon">${streakPaused ? '⏸️' : '🔥'}</span>
        <span><span id="streak-value">0</span> day ${streak === 1 ? 'streak' : 'streak'}</span>
        ${streakPaused ? '<span class="text-warning">(Paused)</span>' : ''}
      </div>
    </div>

    <!-- Insights -->
    ${insights.length > 0 ? `
      <div class="insights-section" style="padding: var(--space-lg);">
        ${insights.map(insight => `
          <div class="card card-glass mb-md" style="border-left: 4px solid ${insight.type === 'success' ? 'var(--color-accent-success)' :
      insight.type === 'warning' ? 'var(--color-accent-warning)' :
        'var(--color-accent-primary)'
    }">
            <p class="text-secondary mb-sm">${insight.message}</p>
            ${insight.action ? `<button class="btn btn-sm btn-gradient">${insight.action}</button>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Daily Action -->
    <div class="daily-action-section">
      <h3 class="mb-md">Today's Action</h3>
      <div class="action-card card-glass">
        <div class="action-header">
          <h4>${dailyAction.title}</h4>
          <div class="action-duration">
            <span>⏱️</span>
            <span>${dailyAction.duration} min</span>
          </div>
        </div>
        <p class="text-secondary mb-lg">${dailyAction.description}</p>
        <button class="btn btn-gradient btn-lg" id="start-action-btn" style="width: 100%;">
          Start Now
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h3 style="padding: 0 var(--space-lg); margin-bottom: var(--space-md);">Quick Actions</h3>
      <div class="quick-actions">
        <button class="quick-action-btn card-glass" data-mode="2min">
          <div class="quick-action-icon">⚡</div>
          <div class="quick-action-label">2 min</div>
          <div class="text-tertiary" style="font-size: var(--font-size-xs);">10 swipes</div>
        </button>
        <button class="quick-action-btn card-glass" data-mode="5min">
          <div class="quick-action-icon">🎯</div>
          <div class="quick-action-label">5 min</div>
          <div class="text-tertiary" style="font-size: var(--font-size-xs);">25 swipes</div>
        </button>
        <button class="quick-action-btn card-glass" data-route="/feed">
          <div class="quick-action-icon">📱</div>
          <div class="quick-action-label">Feed</div>
          <div class="text-tertiary" style="font-size: var(--font-size-xs);">Reels</div>
        </button>
      </div>
    </div>

    <!-- League Preview -->
    <div class="league-preview" style="padding: var(--space-lg);">
      <div class="flex justify-between items-center mb-md">
        <h3>Your League</h3>
        <button class="btn btn-ghost btn-sm" id="view-league-btn">View All →</button>
      </div>
      <div class="card card-glass" style="text-align: center;">
        <div class="badge badge-${currentLeague.name}" style="font-size: var(--font-size-lg); padding: var(--space-sm) var(--space-lg);">
          ${currentLeague.name.toUpperCase()}
        </div>
        <div class="mt-md">
          <div class="text-accent gradient-text" style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);">
            ${leaguePoints}
          </div>
          <div class="text-tertiary" style="font-size: var(--font-size-sm);">League Points</div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
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
    if (momentumEl) animateNumber(momentumEl, 0, momentum, 1500);
    if (streakEl) animateNumber(streakEl, 0, streak, 1000);

    // Start action button
    container.querySelector('#start-action-btn')?.addEventListener('click', () => {
      router.navigate('/swipe-mock/5min');
    });

    // Quick action buttons
    container.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        const route = e.currentTarget.dataset.route;

        if (route) {
          router.navigate(route);
        } else if (mode) {
          router.navigate(`/swipe-mock/${mode}`);
        }
      });
    });

    // View league button
    container.querySelector('#view-league-btn')?.addEventListener('click', () => {
      router.navigate('/league');
    });

    // Navigation items
    container.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const route = e.currentTarget.dataset.route;
        router.navigate(route);
      });
    });
  }, 0);

  return container;
}
