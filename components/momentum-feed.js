// ============================================
// MOMENTUM FEED - Productive Doom Scroll
// ============================================

import { state } from '../js/state-manager.js';
import { eventBus } from '../js/event-bus.js';
import { dateUtils } from '../js/utils.js';
import { router } from '../js/router.js';

export class MomentumFeed {
    constructor() {
        this.reelsViewedToday = state.get('feed.reelsViewedToday') || 0;
        this.maxReelsPerDay = 20;
        this.currentReelIndex = 0;
        this.reels = this.generateReels();
    }

    generateReels() {
        const momentum = state.get('momentum.score') || 0;
        const streak = state.get('momentum.streak') || 0;
        const streakPaused = state.get('momentum.streakPaused');
        const mastered = (state.get('swipeMock.mastered') || []).length;
        const leaguePoints = state.get('leagues.leaguePoints') || 0;

        const reels = [];

        // Recovery reel if streak is paused
        if (streakPaused) {
            reels.push({
                type: 'recovery',
                icon: '💪',
                title: 'Welcome Back!',
                content: 'Your streak is paused, not lost. Complete one action today to resume your momentum.',
                action: 'Start Practice',
                actionRoute: '/swipe-mock/2min'
            });
        }

        // Progress reinforcement
        if (mastered > 0) {
            reels.push({
                type: 'progress',
                icon: '🎯',
                title: 'You\'re Making Progress',
                content: `You've mastered ${mastered} questions. Each one brings you closer to your target score.`,
                stat: `${mastered} mastered`,
                color: '#30d158'
            });
        }

        // IELTS Tips
        const tips = [
            {
                icon: '📚',
                title: 'Reading Tip',
                content: 'Skim the questions before reading the passage. This helps you know what to look for.',
                category: 'Reading'
            },
            {
                icon: '✍️',
                title: 'Writing Tip',
                content: 'Use linking words like "moreover", "however", and "consequently" to improve cohesion.',
                category: 'Writing'
            },
            {
                icon: '🎧',
                title: 'Listening Tip',
                content: 'Pay attention to signpost words like "firstly", "in contrast", and "to summarize".',
                category: 'Listening'
            },
            {
                icon: '🗣️',
                title: 'Speaking Tip',
                content: 'Extend your answers with reasons and examples. Don\'t just give yes/no responses.',
                category: 'Speaking'
            },
            {
                icon: '⏰',
                title: 'Time Management',
                content: 'In Reading, spend no more than 20 minutes per passage. Save time for checking answers.',
                category: 'Strategy'
            }
        ];

        // Add 3 random tips
        const shuffledTips = tips.sort(() => Math.random() - 0.5).slice(0, 3);
        shuffledTips.forEach(tip => {
            reels.push({
                type: 'tip',
                ...tip,
                color: '#0a84ff'
            });
        });

        // Social proof
        reels.push({
            type: 'social',
            icon: '🏆',
            title: 'Community Update',
            content: `${Math.floor(Math.random() * 500) + 800} learners practiced today. You're part of something bigger.`,
            stat: 'Active community',
            color: '#5e5ce6'
        });

        // Instant action reel
        reels.push({
            type: 'action',
            icon: '⚡',
            title: 'Quick Challenge',
            content: 'Ready for a 2-minute practice session? It only takes 10 swipes.',
            action: 'Accept Challenge',
            actionRoute: '/swipe-mock/2min'
        });

        // Momentum milestone
        if (momentum >= 50) {
            reels.push({
                type: 'progress',
                icon: '🚀',
                title: 'High Momentum!',
                content: `Your momentum score is ${momentum}. You're in the top tier of consistent learners.`,
                stat: `${momentum} momentum`,
                color: '#ff9f0a'
            });
        }

        // Streak milestone
        if (streak >= 7) {
            reels.push({
                type: 'progress',
                icon: '🔥',
                title: 'Week Streak!',
                content: `${streak} days in a row! You're building a real habit. Keep the fire burning.`,
                stat: `${streak} day streak`,
                color: '#ff453a'
            });
        }

        return reels;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'feed-container';

        // Check if daily cap reached
        if (this.reelsViewedToday >= this.maxReelsPerDay) {
            container.innerHTML = `
        <div class="feed-complete">
          <div class="complete-icon">✨</div>
          <h2>You've completed today's momentum feed</h2>
          <p class="text-secondary">Come back tomorrow for fresh insights and tips!</p>
          <button class="btn btn-primary mt-lg" id="back-home-btn">Back to Home</button>
        </div>
      `;

            setTimeout(() => {
                container.querySelector('#back-home-btn')?.addEventListener('click', () => {
                    router.navigate('/');
                });
            }, 0);

            return container;
        }

        container.innerHTML = `
      <div class="feed-header">
        <button class="btn-icon" id="close-feed-btn">✕</button>
        <div class="feed-progress">
          <span>${this.reelsViewedToday}/${this.maxReelsPerDay}</span>
        </div>
      </div>

      <div class="reels-viewport" id="reels-viewport">
        ${this.reels.map((reel, index) => this.renderReel(reel, index)).join('')}
      </div>

      <div class="feed-footer">
        <div class="swipe-indicator">
          <span>↑</span>
          <span class="text-tertiary text-sm">Swipe up for next</span>
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
          <div class="nav-item active" data-route="/feed">
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

        this.attachEventListeners(container);
        return container;
    }

    renderReel(reel, index) {
        const isActive = index === this.currentReelIndex;

        return `
      <div class="reel ${isActive ? 'active' : ''}" data-index="${index}" style="background: linear-gradient(135deg, ${reel.color || '#1c1c1f'}, #0a0a0b);">
        <div class="reel-content">
          <div class="reel-icon">${reel.icon}</div>
          <h2 class="reel-title">${reel.title}</h2>
          <p class="reel-text">${reel.content}</p>
          
          ${reel.stat ? `
            <div class="reel-stat">
              <span class="stat-badge">${reel.stat}</span>
            </div>
          ` : ''}

          ${reel.action ? `
            <button class="btn btn-primary btn-lg reel-action-btn" data-route="${reel.actionRoute}">
              ${reel.action}
            </button>
          ` : ''}

          ${reel.category ? `
            <div class="reel-category">
              <span class="badge">${reel.category}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    }

    attachEventListeners(container) {
        // Close button
        container.querySelector('#close-feed-btn')?.addEventListener('click', () => {
            router.navigate('/');
        });

        // Action buttons
        container.querySelectorAll('.reel-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const route = e.currentTarget.dataset.route;
                this.incrementViewCount();
                router.navigate(route);
            });
        });

        // Navigation
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const route = e.currentTarget.dataset.route;
                router.navigate(route);
            });
        });

        // Swipe/scroll handling
        const viewport = container.querySelector('#reels-viewport');
        if (viewport) {
            let startY = 0;
            let isDragging = false;

            const handleStart = (e) => {
                isDragging = true;
                startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            };

            const handleEnd = (e) => {
                if (!isDragging) return;
                isDragging = false;

                const endY = e.type.includes('mouse') ? e.clientY : e.changedTouches[0].clientY;
                const diff = startY - endY;

                if (Math.abs(diff) > 50) {
                    if (diff > 0 && this.currentReelIndex < this.reels.length - 1) {
                        // Swipe up - next reel
                        this.nextReel(container);
                    } else if (diff < 0 && this.currentReelIndex > 0) {
                        // Swipe down - previous reel
                        this.previousReel(container);
                    }
                }
            };

            viewport.addEventListener('mousedown', handleStart);
            viewport.addEventListener('touchstart', handleStart);
            viewport.addEventListener('mouseup', handleEnd);
            viewport.addEventListener('touchend', handleEnd);
        }
    }

    nextReel(container) {
        if (this.currentReelIndex < this.reels.length - 1) {
            this.currentReelIndex++;
            this.updateReelDisplay(container);
            this.incrementViewCount();
        }
    }

    previousReel(container) {
        if (this.currentReelIndex > 0) {
            this.currentReelIndex--;
            this.updateReelDisplay(container);
        }
    }

    updateReelDisplay(container) {
        const reels = container.querySelectorAll('.reel');
        reels.forEach((reel, index) => {
            if (index === this.currentReelIndex) {
                reel.classList.add('active');
            } else {
                reel.classList.remove('active');
            }
        });

        // Scroll to active reel
        const activeReel = reels[this.currentReelIndex];
        if (activeReel) {
            activeReel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    incrementViewCount() {
        this.reelsViewedToday++;
        state.set('feed.reelsViewedToday', this.reelsViewedToday);
        state.set('feed.lastReelDate', dateUtils.today());

        // Update progress display
        const progressDisplay = document.querySelector('.feed-progress span');
        if (progressDisplay) {
            progressDisplay.textContent = `${this.reelsViewedToday}/${this.maxReelsPerDay}`;
        }

        // Check if cap reached
        if (this.reelsViewedToday >= this.maxReelsPerDay) {
            eventBus.emit('feed:completed');
            setTimeout(() => {
                router.navigate('/');
            }, 2000);
        }
    }
}

export function createMomentumFeed() {
    const feed = new MomentumFeed();
    return feed.render();
}
