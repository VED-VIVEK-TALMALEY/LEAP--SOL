// ============================================
// ACADEMIC PROFILE COMPONENT - Phase 5
// ============================================

import { state } from '../js/state-manager.js';
import { router } from '../js/router.js';
import { db } from '../js/supabase-client.js';
import { ieltsTimeline } from '../js/ielts-timeline.js';
import { achievementSystem } from '../js/achievement-system.js';

export function createAcademicProfile() {
    const user = state.get('user');
    if (!user) {
        router.navigate('/login');
        return document.createElement('div');
    }

    const container = document.createElement('div');
    container.className = 'academic-profile';
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px;';

    // Load data
    loadProfileData(container, user.id);

    return container;
}

async function loadProfileData(container, userId) {
    // Get IELTS history
    let ieltsHistory = await ieltsTimeline.getHistory(userId);
    if (!ieltsHistory || ieltsHistory.length === 0) {
        ieltsHistory = ieltsTimeline.generateMockHistory(userId);
    }

    // Get academic profile
    let profile = await db.getAcademicProfile(userId);
    if (!profile) {
        profile = {
            user_id: userId,
            bio: '',
            education: [],
            target_universities: [],
            achievements: [],
            is_public: false,
            profile_slug: `user-${userId.substring(0, 8)}`
        };
    }

    // Get achievements
    const achievements = achievementSystem.getUserAchievements();

    // Get stats
    const stats = ieltsTimeline.getStats(ieltsHistory);

    // Render profile
    renderProfile(container, profile, ieltsHistory, achievements, stats, userId);
}

function renderProfile(container, profile, ieltsHistory, achievements, stats, userId) {
    const user = state.get('user');
    const userName = user?.user_metadata?.name || user?.email || 'User';

    // Generate avatar URL using UI Avatars
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=5c94fc&color=fff&size=200&bold=true`;

    container.innerHTML = `
        <div class="profile-header card mb-lg">
            <div class="profile-cover" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 150px; border-radius: var(--radius-lg) var(--radius-lg) 0 0;"></div>
            <div class="profile-info" style="padding: var(--space-lg); margin-top: -60px;">
                <div style="display: flex; gap: var(--space-lg); align-items: flex-end;">
                    <img src="${avatarUrl}" alt="${userName}" class="profile-avatar" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid var(--color-bg-primary); box-shadow: var(--shadow-elevated);">
                    <div style="flex: 1; padding-bottom: var(--space-sm);">
                        <h1 style="margin: 0;">${userName}</h1>
                        <p class="text-secondary">${profile.bio || 'IELTS Learner | Study Abroad Aspirant'}</p>
                        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-sm);">
                            ${profile.linkedin_url ? `<a href="${profile.linkedin_url}" target="_blank" class="btn btn-secondary btn-sm">🔗 LinkedIn</a>` : ''}
                            <button class="btn btn-secondary btn-sm" id="share-profile-btn">📤 Share Profile</button>
                            <button class="btn btn-secondary btn-sm" id="edit-profile-btn">✏️ Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-lg);">
            <div class="stat-card card">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${stats.latestScore}</div>
                <div class="stat-label">Latest IELTS Score</div>
            </div>
            <div class="stat-card card">
                <div class="stat-icon">🎯</div>
                <div class="stat-value">${stats.bestScore}</div>
                <div class="stat-label">Best Score</div>
            </div>
            <div class="stat-card card">
                <div class="stat-icon">📈</div>
                <div class="stat-value">${stats.improvement}</div>
                <div class="stat-label">Improvement</div>
            </div>
            <div class="stat-card card">
                <div class="stat-icon">📝</div>
                <div class="stat-value">${stats.totalTests}</div>
                <div class="stat-label">Tests Taken</div>
            </div>
        </div>

        <div class="card mb-lg">
            <div class="card-header">
                <h2>📈 IELTS Progress Timeline</h2>
                <button class="btn btn-primary btn-sm" id="add-score-btn">+ Add Score</button>
            </div>
            <div class="timeline-chart" id="timeline-chart">
                ${renderTimelineChart(ieltsHistory)}
            </div>
        </div>

        <div class="card mb-lg">
            <h2 class="mb-md">🏆 Achievements</h2>
            <div class="achievement-grid">
                ${renderAchievements(achievements)}
            </div>
        </div>

        <div class="card mb-lg">
            <h2 class="mb-md">🎓 Target Universities</h2>
            ${renderTargetUniversities(profile.target_universities)}
        </div>

        <nav class="nav">
            <div class="nav-items">
                <div class="nav-item" data-route="/">
                    <div class="nav-icon">🏠</div>
                    <div class="nav-label">Home</div>
                </div>
                <div class="nav-item" data-route="/colleges">
                    <div class="nav-icon">🎓</div>
                    <div class="nav-label">Colleges</div>
                </div>
                <div class="nav-item" data-route="/tracker">
                    <div class="nav-icon">📋</div>
                    <div class="nav-label">Tracker</div>
                </div>
                <div class="nav-item active" data-route="/academic-profile">
                    <div class="nav-icon">👤</div>
                    <div class="nav-label">Profile</div>
                </div>
            </div>
        </nav>
    `;

    setTimeout(() => {
        // Navigation
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => router.navigate(e.currentTarget.dataset.route));
        });

        // Share profile button
        container.querySelector('#share-profile-btn')?.addEventListener('click', () => {
            showShareModal(profile, container);
        });

        // Edit profile button
        container.querySelector('#edit-profile-btn')?.addEventListener('click', () => {
            showEditModal(profile, container, userId);
        });

        // Add score button
        container.querySelector('#add-score-btn')?.addEventListener('click', () => {
            showAddScoreModal(container, userId);
        });
    }, 0);
}

function renderTimelineChart(history) {
    if (history.length === 0) {
        return '<p class="text-secondary text-center">No IELTS scores recorded yet. Add your first score to see your progress!</p>';
    }

    const chartData = ieltsTimeline.getChartData(history);
    const maxScore = 9;
    const chartHeight = 300;

    // Simple line chart using SVG
    const sorted = [...history].sort((a, b) => new Date(a.test_date) - new Date(b.test_date));
    const points = sorted.map((score, index) => {
        const x = (index / (sorted.length - 1 || 1)) * 100;
        const y = 100 - (score.overall_score / maxScore) * 100;
        return `${x},${y}`;
    }).join(' ');

    return `
        <div style="padding: var(--space-lg);">
            <svg viewBox="0 0 100 100" style="width: 100%; height: ${chartHeight}px; background: var(--color-bg-secondary); border-radius: var(--radius-md);">
                <!-- Grid lines -->
                ${[0, 3, 6, 9].map(score => {
        const y = 100 - (score / maxScore) * 100;
        return `
                        <line x1="0" y1="${y}" x2="100" y2="${y}" stroke="var(--color-bg-elevated)" stroke-width="0.2" />
                        <text x="2" y="${y - 1}" fill="var(--color-text-tertiary)" font-size="3">${score}</text>
                    `;
    }).join('')}
                
                <!-- Line chart -->
                <polyline points="${points}" fill="none" stroke="#5c94fc" stroke-width="0.5" />
                
                <!-- Data points -->
                ${sorted.map((score, index) => {
        const x = (index / (sorted.length - 1 || 1)) * 100;
        const y = 100 - (score.overall_score / maxScore) * 100;
        return `<circle cx="${x}" cy="${y}" r="1.5" fill="#5c94fc" />`;
    }).join('')}
            </svg>
            
            <div style="display: flex; justify-content: space-between; margin-top: var(--space-md); flex-wrap: wrap; gap: var(--space-sm);">
                ${sorted.map(score => `
                    <div class="timeline-item">
                        <div class="text-xs text-tertiary">${new Date(score.test_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                        <div class="text-sm font-bold">${score.overall_score}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAchievements(achievements) {
    if (!achievements || achievements.length === 0) {
        return '<p class="text-secondary">No achievements unlocked yet. Keep practicing!</p>';
    }

    return achievements.slice(0, 12).map(achievement => `
        <div class="achievement-badge">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name text-xs">${achievement.name}</div>
        </div>
    `).join('');
}

function renderTargetUniversities(universities) {
    if (!universities || universities.length === 0) {
        return '<p class="text-secondary">No target universities added yet.</p>';
    }

    return `
        <div style="display: grid; gap: var(--space-md);">
            ${universities.map(uni => `
                <div class="university-card" style="display: flex; gap: var(--space-md); padding: var(--space-md); background: var(--color-bg-secondary); border-radius: var(--radius-md);">
                    <img src="https://source.unsplash.com/100x100/?university,${encodeURIComponent(uni.name)}" alt="${uni.name}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;">
                    <div>
                        <h4 style="margin: 0;">${uni.name}</h4>
                        <p class="text-secondary text-sm">${uni.course}</p>
                        <p class="text-tertiary text-xs">🌍 ${uni.country}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showShareModal(profile, container) {
    const shareUrl = `${window.location.origin}/profile/${profile.profile_slug}`;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content card" style="max-width: 500px; padding: var(--space-xl);">
            <h2 class="mb-lg">📤 Share Your Profile</h2>
            
            <div class="form-group mb-md">
                <label>Profile URL</label>
                <div style="display: flex; gap: var(--space-sm);">
                    <input type="text" id="share-url" class="form-input" value="${shareUrl}" readonly style="flex: 1;">
                    <button class="btn btn-primary" id="copy-url-btn">Copy</button>
                </div>
            </div>
            
            <div class="form-group mb-lg">
                <label style="display: flex; align-items: center; gap: var(--space-sm); cursor: pointer;">
                    <input type="checkbox" id="public-toggle" ${profile.is_public ? 'checked' : ''}>
                    <span>Make profile public</span>
                </label>
                <p class="text-tertiary text-xs">Public profiles can be viewed by anyone with the link</p>
            </div>
            
            <button class="btn btn-secondary" id="close-modal-btn" style="width: 100%;">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#copy-url-btn')?.addEventListener('click', () => {
        const input = modal.querySelector('#share-url');
        input.select();
        navigator.clipboard.writeText(shareUrl);
        alert('Profile URL copied to clipboard!');
    });

    modal.querySelector('#close-modal-btn')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function showEditModal(profile, container, userId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content card" style="max-width: 600px; padding: var(--space-xl); max-height: 80vh; overflow-y: auto;">
            <h2 class="mb-lg">✏️ Edit Academic Profile</h2>
            
            <div class="form-group mb-md">
                <label>Bio</label>
                <textarea id="bio-input" class="form-input" rows="3" placeholder="Tell us about yourself...">${profile.bio || ''}</textarea>
            </div>
            
            <div class="form-group mb-md">
                <label>LinkedIn URL</label>
                <input type="url" id="linkedin-input" class="form-input" value="${profile.linkedin_url || ''}" placeholder="https://linkedin.com/in/yourprofile">
            </div>
            
            <div class="form-group mb-md">
                <label>Portfolio URL</label>
                <input type="url" id="portfolio-input" class="form-input" value="${profile.portfolio_url || ''}" placeholder="https://yourportfolio.com">
            </div>
            
            <div class="form-group mb-lg">
                <label>Field of Study</label>
                <input type="text" id="field-input" class="form-input" value="${profile.field_of_study || ''}" placeholder="e.g., Computer Science">
            </div>
            
            <div style="display: flex; gap: var(--space-sm);">
                <button class="btn btn-secondary" id="cancel-btn" style="flex: 1;">Cancel</button>
                <button class="btn btn-primary" id="save-btn" style="flex: 1;">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#cancel-btn')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#save-btn')?.addEventListener('click', async () => {
        const updates = {
            bio: modal.querySelector('#bio-input').value,
            linkedin_url: modal.querySelector('#linkedin-input').value,
            portfolio_url: modal.querySelector('#portfolio-input').value,
            field_of_study: modal.querySelector('#field-input').value
        };

        await db.updateAcademicProfile(userId, updates);
        modal.remove();

        // Reload profile
        loadProfileData(container, userId);
    });
}

function showAddScoreModal(container, userId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content card" style="max-width: 500px; padding: var(--space-xl);">
            <h2 class="mb-lg">📝 Add IELTS Score</h2>
            
            <div class="form-group mb-md">
                <label>Test Date</label>
                <input type="date" id="date-input" class="form-input" required>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-md);">
                <div class="form-group">
                    <label>Listening</label>
                    <input type="number" id="listening-input" class="form-input" min="0" max="9" step="0.5" placeholder="7.5">
                </div>
                <div class="form-group">
                    <label>Reading</label>
                    <input type="number" id="reading-input" class="form-input" min="0" max="9" step="0.5" placeholder="7.0">
                </div>
                <div class="form-group">
                    <label>Writing</label>
                    <input type="number" id="writing-input" class="form-input" min="0" max="9" step="0.5" placeholder="6.5">
                </div>
                <div class="form-group">
                    <label>Speaking</label>
                    <input type="number" id="speaking-input" class="form-input" min="0" max="9" step="0.5" placeholder="7.0">
                </div>
            </div>
            
            <div class="form-group mb-lg">
                <label>Notes (optional)</label>
                <textarea id="notes-input" class="form-input" rows="2" placeholder="Any notes about this test..."></textarea>
            </div>
            
            <div style="display: flex; gap: var(--space-sm);">
                <button class="btn btn-secondary" id="cancel-btn" style="flex: 1;">Cancel</button>
                <button class="btn btn-primary" id="save-score-btn" style="flex: 1;">Add Score</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#cancel-btn')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#save-score-btn')?.addEventListener('click', async () => {
        const scoreData = {
            test_date: modal.querySelector('#date-input').value,
            listening: parseFloat(modal.querySelector('#listening-input').value),
            reading: parseFloat(modal.querySelector('#reading-input').value),
            writing: parseFloat(modal.querySelector('#writing-input').value),
            speaking: parseFloat(modal.querySelector('#speaking-input').value),
            notes: modal.querySelector('#notes-input').value
        };

        if (!scoreData.test_date || !scoreData.listening || !scoreData.reading || !scoreData.writing || !scoreData.speaking) {
            alert('Please fill in all score fields');
            return;
        }

        await ieltsTimeline.addScore(userId, scoreData);
        modal.remove();

        // Reload profile
        loadProfileData(container, userId);
    });
}
