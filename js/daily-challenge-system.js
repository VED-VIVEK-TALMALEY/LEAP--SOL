// ============================================
// DAILY CHALLENGES SYSTEM
// ============================================

import { state } from './state-manager.js';
import { eventBus } from './event-bus.js';
import { showToast } from './animations.js';

class DailyChallengeSystem {
    constructor() {
        this.challenges = this.defineChallenges();
        this.init();
    }

    init() {
        this.checkAndResetDaily();
        eventBus.on('practice:completed', () => this.updateProgress());
    }

    defineChallenges() {
        return [
            {
                id: 'daily-practice',
                name: 'Daily Practice',
                description: 'Complete 3 practice sessions',
                icon: '📝',
                type: 'practice_count',
                target: 3,
                reward: { momentum: 50, coins: 10 }
            },
            {
                id: 'perfect-streak',
                name: 'Perfect Accuracy',
                description: 'Get 100% accuracy in any session',
                icon: '⭐',
                type: 'accuracy',
                target: 100,
                reward: { momentum: 100, coins: 20 }
            },
            {
                id: 'speed-demon',
                name: 'Speed Demon',
                description: 'Answer 20 questions in 5 minutes',
                icon: '⚡',
                type: 'speed',
                target: 20,
                reward: { momentum: 75, coins: 15 }
            },
            {
                id: 'early-riser',
                name: 'Early Riser',
                description: 'Practice before 9 AM',
                icon: '🌅',
                type: 'time_based',
                target: 'before_9am',
                reward: { momentum: 30, coins: 5 }
            },
            {
                id: 'consistency-king',
                name: 'Consistency King',
                description: 'Practice at 3 different times today',
                icon: '👑',
                type: 'session_spread',
                target: 3,
                reward: { momentum: 60, coins: 12 }
            }
        ];
    }

    checkAndResetDaily() {
        const lastReset = state.get('dailyChallenges.lastReset');
        const today = new Date().toDateString();

        if (lastReset !== today) {
            // Reset daily challenges
            const resetChallenges = this.challenges.map(c => ({
                ...c,
                progress: 0,
                completed: false
            }));

            state.update('dailyChallenges', {
                challenges: resetChallenges,
                lastReset: today
            });
        }
    }

    updateProgress() {
        const challenges = state.get('dailyChallenges.challenges') || [];
        const swipeMock = state.get('swipeMock');
        const momentum = state.get('momentum');

        challenges.forEach(challenge => {
            if (challenge.completed) return;

            let progress = 0;

            switch (challenge.type) {
                case 'practice_count':
                    progress = swipeMock.sessionsToday || 0;
                    break;
                case 'accuracy':
                    progress = swipeMock.lastSessionAccuracy || 0;
                    break;
                case 'speed':
                    progress = swipeMock.lastSessionQuestions || 0;
                    break;
                case 'time_based':
                    const hour = new Date().getHours();
                    progress = hour < 9 ? 1 : 0;
                    break;
                case 'session_spread':
                    progress = swipeMock.sessionTimesCount || 0;
                    break;
            }

            challenge.progress = progress;

            // Check if completed
            if (progress >= challenge.target && !challenge.completed) {
                this.completeChallenge(challenge);
            }
        });

        state.update('dailyChallenges.challenges', challenges);
    }

    completeChallenge(challenge) {
        challenge.completed = true;

        // Award rewards
        const momentum = state.get('momentum');
        const user = state.get('user');

        state.update('momentum', {
            ...momentum,
            score: (momentum.score || 0) + challenge.reward.momentum
        });

        state.update('user', {
            ...user,
            coins: (user.coins || 0) + challenge.reward.coins
        });

        // Celebrate
        showToast(`🎉 Challenge Complete: ${challenge.name}`, 'success');
        eventBus.emit('challenge:completed', challenge);
    }

    getTodaysChallenges() {
        this.checkAndResetDaily();
        return state.get('dailyChallenges.challenges') || [];
    }

    getCompletedCount() {
        const challenges = this.getTodaysChallenges();
        return challenges.filter(c => c.completed).length;
    }
}

export const dailyChallengeSystem = new DailyChallengeSystem();
