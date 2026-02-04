// ============================================
// LEAGUE PAGE - Leaderboard & Rankings
// ============================================

import { state } from '../js/state-manager.js';
import { leagueSystem } from '../js/league-system.js';
import { router } from '../js/router.js';

export function createLeaguePage() {
    const currentLeague = leagueSystem.getCurrentLeague();
    const leaguePoints = state.get('leagues.leaguePoints') || 0;
    const weeklyStats = state.get('leagues.weeklyStats') || {};
    const leaderboard = leagueSystem.generateLeaderboard(leaguePoints);

    const currentUser = leaderboard.find(u => u.isCurrentUser);
    const zoneInfo = leagueSystem.getZoneInfo(currentUser?.rank || 20);

    const container = document.createElement('div');
    container.className = 'league-container';

    const leagueEmojis = {
        bronze: '🥉',
        silver: '🥈',
        gold: '🥇',
        diamond: '💎'
    };

    container.innerHTML = `
    <!-- League Header -->
    <div class="league-header">
      <div class="league-badge-large ${currentLeague.name}">
        ${leagueEmojis[currentLeague.name]}
      </div>
      <h2>${currentLeague.name.charAt(0).toUpperCase() + currentLeague.name.slice(1)} League</h2>
      <div class="league-points">${leaguePoints} points</div>
      
      <div class="zone-indicator mt-md">
        <span class="badge ${zoneInfo.zone === 'promotion' ? 'badge-success' :
            zoneInfo.zone === 'demotion' ? 'badge-warning' :
                'badge-bronze'
        }">
          ${zoneInfo.message}
        </span>
      </div>
    </div>

    <!-- Weekly Stats -->
    <div style="padding: var(--space-lg);">
      <h3 class="mb-md">This Week</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md);">
        <div class="card text-center">
          <div class="text-accent" style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">
            ${(weeklyStats.accuracy || 0).toFixed(0)}%
          </div>
          <div class="text-tertiary" style="font-size: var(--font-size-xs);">Accuracy</div>
        </div>
        <div class="card text-center">
          <div class="text-accent" style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">
            ${(weeklyStats.consistency || 0).toFixed(0)}%
          </div>
          <div class="text-tertiary" style="font-size: var(--font-size-xs);">Consistency</div>
        </div>
        <div class="card text-center">
          <div class="text-accent" style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">
            +${(weeklyStats.improvement || 0).toFixed(0)}%
          </div>
          <div class="text-tertiary" style="font-size: var(--font-size-xs);">Improvement</div>
        </div>
      </div>
    </div>

    <!-- Leaderboard -->
    <div class="leaderboard">
      <h3 class="mb-md">Leaderboard</h3>
      ${leaderboard.map(user => `
        <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
          <div class="rank-number ${user.rank <= 3 ? 'top3' : ''}">
            ${user.rank}
          </div>
          <div class="user-info">
            <div class="user-name">${user.name}${user.isCurrentUser ? ' (You)' : ''}</div>
            <div class="user-stats">
              <span>${user.daysActive} days</span>
              <span>•</span>
              <span>${user.accuracy}% accuracy</span>
              ${user.improvement > 0 ? `
                <span>•</span>
                <span class="text-success">+${user.improvement}% ↑</span>
              ` : ''}
            </div>
          </div>
          <div class="user-points">${user.points}</div>
        </div>
      `).join('')}
    </div>

    <!-- Info Card -->
    <div style="padding: var(--space-lg);">
      <div class="card">
        <h4 class="mb-sm">How Rankings Work</h4>
        <p class="text-secondary" style="font-size: var(--font-size-sm); margin-bottom: var(--space-sm);">
          Your league points are calculated based on:
        </p>
        <ul style="color: var(--color-text-secondary); font-size: var(--font-size-sm); padding-left: var(--space-lg);">
          <li>Accuracy (40%)</li>
          <li>Consistency (30%)</li>
          <li>Momentum (20%)</li>
          <li>Improvement (10%)</li>
        </ul>
        <p class="text-tertiary mt-md" style="font-size: var(--font-size-xs);">
          Top 20% get promoted weekly. Bottom 10% get recalibrated.
        </p>
      </div>
    </div>

    <!-- Bottom Navigation -->
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
        <div class="nav-item active" data-route="/league">
          <div class="nav-icon">🏆</div>
          <div class="nav-label">League</div>
        </div>
        <div class="nav-item" data-route="/colleges">
          <div class="nav-icon">🎓</div>
          <div class="nav-label">Colleges</div>
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
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const route = e.currentTarget.dataset.route;
                router.navigate(route);
            });
        });
    }, 0);

    return container;
}
