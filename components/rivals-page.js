// ============================================
// RIVALS PAGE - Competition & Comparison
// ============================================

import { state } from '../js/state-manager.js';
import { router } from '../js/router.js';
import { rivalsSystem } from '../js/rivals-system.js';

export function createRivalsPage() {
    const container = document.createElement('div');
    container.className = 'rivals-page';
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px;';

    const rival = rivalsSystem.getCurrentRival();
    const comparison = rivalsSystem.getRivalComparison();
    const motivationMsg = rivalsSystem.getMotivationMessage();

    if (!rival || !comparison) {
        container.innerHTML = `
            <div style="text-align: center; padding: var(--space-xxl);">
                <div style="font-size: 4rem; margin-bottom: var(--space-lg);">🎯</div>
                <h2>No Rival Yet</h2>
                <p class="text-secondary mb-lg">
                    Keep practicing! We'll match you with a rival soon.
                </p>
                <button class="btn btn-primary" id="back-btn">Back to Home</button>
            </div>

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
                    <div class="nav-item active" data-route="/rivals">
                        <div class="nav-icon">⚔️</div>
                        <div class="nav-label">Rivals</div>
                    </div>
                    <div class="nav-item" data-route="/profile">
                        <div class="nav-icon">👤</div>
                        <div class="nav-label">Profile</div>
                    </div>
                </div>
            </nav>
        `;

        setTimeout(() => {
            container.querySelector('#back-btn')?.addEventListener('click', () => router.navigate('/'));
            container.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', (e) => router.navigate(e.currentTarget.dataset.route));
            });
        }, 0);

        return container;
    }

    const userAhead = comparison.user.momentum > comparison.rival.momentum;
    const momentumDiff = Math.abs(comparison.user.momentum - comparison.rival.momentum);

    container.innerHTML = `
        <div class="rivals-header mb-lg">
            <h1>⚔️ Your Rival</h1>
            <p class="text-secondary">Silent competition. Real motivation.</p>
        </div>

        <div class="motivation-banner card mb-lg" style="background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary)); color: white; text-align: center; padding: var(--space-lg);">
            <div style="font-size: 1.5rem; font-weight: var(--font-weight-bold);">
                ${motivationMsg}
            </div>
        </div>

        <div class="rival-comparison mb-lg">
            <div class="comparison-header mb-md">
                <h2>Head to Head</h2>
            </div>

            <div class="comparison-grid">
                <!-- User Card -->
                <div class="player-card card ${userAhead ? 'winning' : ''}">
                    <div class="player-header">
                        <div class="player-avatar">
                            ${comparison.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="player-info">
                            <h3>${comparison.user.name}</h3>
                            <span class="badge">${comparison.user.league}</span>
                        </div>
                    </div>
                    <div class="player-stats">
                        <div class="stat-item">
                            <div class="stat-label">Momentum</div>
                            <div class="stat-value">${comparison.user.momentum}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Streak</div>
                            <div class="stat-value">${comparison.user.streak} 🔥</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">League Points</div>
                            <div class="stat-value">${comparison.user.leaguePoints}</div>
                        </div>
                    </div>
                </div>

                <!-- VS Badge -->
                <div class="vs-badge">
                    <div style="font-size: 2rem; font-weight: var(--font-weight-bold);">VS</div>
                    <div class="text-sm text-secondary">${momentumDiff} pts gap</div>
                </div>

                <!-- Rival Card -->
                <div class="player-card card ${!userAhead ? 'winning' : ''}">
                    <div class="player-header">
                        <div class="player-avatar rival-avatar">
                            ${comparison.rival.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="player-info">
                            <h3>${comparison.rival.name}</h3>
                            <span class="badge">${comparison.rival.league}</span>
                        </div>
                    </div>
                    <div class="player-stats">
                        <div class="stat-item">
                            <div class="stat-label">Momentum</div>
                            <div class="stat-value">${comparison.rival.momentum}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Streak</div>
                            <div class="stat-value">${comparison.rival.streak} 🔥</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">League Points</div>
                            <div class="stat-value">${comparison.rival.leaguePoints}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="momentum-chart card mb-lg">
            <h3 class="mb-md">Momentum Comparison</h3>
            <div class="chart-bars">
                <div class="chart-row">
                    <div class="chart-label">You</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar user-bar" style="width: ${(comparison.user.momentum / Math.max(comparison.user.momentum, comparison.rival.momentum)) * 100}%">
                            ${comparison.user.momentum}
                        </div>
                    </div>
                </div>
                <div class="chart-row">
                    <div class="chart-label">Rival</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar rival-bar" style="width: ${(comparison.rival.momentum / Math.max(comparison.user.momentum, comparison.rival.momentum)) * 100}%">
                            ${comparison.rival.momentum}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="action-card card">
            <h3 class="mb-md">🎯 Take Action</h3>
            <p class="text-secondary mb-md">
                ${userAhead
            ? 'Stay ahead! Complete a practice session to maintain your lead.'
            : 'Time to catch up! Start a practice session now.'}
            </p>
            <button class="btn btn-primary btn-lg" id="practice-btn" style="width: 100%;">
                Start Practice Session
            </button>
        </div>

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
                <div class="nav-item active" data-route="/rivals">
                    <div class="nav-icon">⚔️</div>
                    <div class="nav-label">Rivals</div>
                </div>
                <div class="nav-item" data-route="/profile">
                    <div class="nav-icon">👤</div>
                    <div class="nav-label">Profile</div>
                </div>
            </div>
        </nav>
    `;

    setTimeout(() => {
        container.querySelector('#practice-btn')?.addEventListener('click', () => {
            router.navigate('/practice');
        });

        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                router.navigate(e.currentTarget.dataset.route);
            });
        });
    }, 0);

    return container;
}
