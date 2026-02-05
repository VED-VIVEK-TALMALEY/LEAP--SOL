// ============================================
// ACHIEVEMENT SYSTEM
// ============================================

import { state } from './state-manager.js';
import { eventBus } from './event-bus.js';
import { createConfetti, showToast } from './animations.js';
import { notificationService } from './notification-service.js';

class AchievementSystem {
    constructor() {
        this.achievements = this.defineAchievements();
        this.init();
    }

    init() {
        // Listen for events that trigger achievements
        eventBus.on('practice:completed', () => this.checkPracticeAchievements());
        eventBus.on('streak:updated', (streak) => this.checkStreakAchievements(streak));
        eventBus.on('league:promoted', (league) => this.checkLeagueAchievements(league));
        eventBus.on('question:mastered', () => this.checkMasteryAchievements());
    }

    defineAchievements() {
        return {
            // First Steps
            firstPractice: {
                id: 'first-practice',
                name: 'First Steps 🎮',
                description: 'Complete your first practice session',
                icon: '🎮',
                category: 'practice',
                requirement: { type: 'practice_count', value: 1 }
            },

            // Streak Achievements
            streak3: {
                id: 'streak-3',
                name: '3-Day Warrior 🔥',
                description: 'Maintain a 3-day streak',
                icon: '🔥',
                category: 'streak',
                requirement: { type: 'streak', value: 3 }
            },
            streak7: {
                id: 'streak-7',
                name: 'Week Champion 🏅',
                description: 'Maintain a 7-day streak',
                icon: '🏅',
                category: 'streak',
                requirement: { type: 'streak', value: 7 }
            },
            streak30: {
                id: 'streak-30',
                name: 'Month Master 👑',
                description: 'Maintain a 30-day streak',
                icon: '👑',
                category: 'streak',
                requirement: { type: 'streak', value: 30 }
            },
            streak100: {
                id: 'streak-100',
                name: 'Century Legend 💎',
                description: 'Maintain a 100-day streak',
                icon: '💎',
                category: 'streak',
                requirement: { type: 'streak', value: 100 }
            },

            // League Achievements
            silverLeague: {
                id: 'silver-league',
                name: 'Silver Achiever 🥈',
                description: 'Reach Silver League',
                icon: '🥈',
                category: 'league',
                requirement: { type: 'league', value: 'silver' }
            },
            goldLeague: {
                id: 'gold-league',
                name: 'Gold Champion 🥇',
                description: 'Reach Gold League',
                icon: '🥇',
                category: 'league',
                requirement: { type: 'league', value: 'gold' }
            },
            diamondLeague: {
                id: 'diamond-league',
                name: 'Diamond Elite 💎',
                description: 'Reach Diamond League',
                icon: '💎',
                category: 'league',
                requirement: { type: 'league', value: 'diamond' }
            },

            // Mastery Achievements
            master10: {
                id: 'master-10',
                name: 'Quick Learner 📚',
                description: 'Master 10 questions',
                icon: '📚',
                category: 'mastery',
                requirement: { type: 'mastered_count', value: 10 }
            },
            master50: {
                id: 'master-50',
                name: 'Knowledge Seeker 🎓',
                description: 'Master 50 questions',
                icon: '🎓',
                category: 'mastery',
                requirement: { type: 'mastered_count', value: 50 }
            },
            master100: {
                id: 'master-100',
                name: 'IELTS Expert 🌟',
                description: 'Master 100 questions',
                icon: '🌟',
                category: 'mastery',
                requirement: { type: 'mastered_count', value: 100 }
            },

            // Momentum Achievements
            momentum500: {
                id: 'momentum-500',
                name: 'Momentum Builder ⚡',
                description: 'Reach 500 momentum score',
                icon: '⚡',
                category: 'momentum',
                requirement: { type: 'momentum', value: 500 }
            },
            momentum1000: {
                id: 'momentum-1000',
                name: 'Unstoppable Force 🚀',
                description: 'Reach 1000 momentum score',
                icon: '🚀',
                category: 'momentum',
                requirement: { type: 'momentum', value: 1000 }
            },

            // Special Achievements
            earlyBird: {
                id: 'early-bird',
                name: 'Early Bird 🌅',
                description: 'Practice before 8 AM',
                icon: '🌅',
                category: 'special',
                requirement: { type: 'practice_time', value: 'before_8am' }
            },
            nightOwl: {
                id: 'night-owl',
                name: 'Night Owl 🦉',
                description: 'Practice after 10 PM',
                icon: '🦉',
                category: 'special',
                requirement: { type: 'practice_time', value: 'after_10pm' }
            },
            perfectDay: {
                id: 'perfect-day',
                name: 'Perfect Day ⭐',
                description: 'Get 100% accuracy in a session',
                icon: '⭐',
                category: 'special',
                requirement: { type: 'accuracy', value: 100 }
            }
        };
    }

    checkPracticeAchievements() {
        const swipeMock = state.get('swipeMock');
        const totalSwipes = swipeMock.totalSwipes || 0;

        if (totalSwipes === 1) {
            this.unlock('firstPractice');
        }

        // Check time-based achievements
        const hour = new Date().getHours();
        if (hour < 8) {
            this.unlock('earlyBird');
        } else if (hour >= 22) {
            this.unlock('nightOwl');
        }
    }

    checkStreakAchievements(streak) {
        if (streak >= 3) this.unlock('streak3');
        if (streak >= 7) this.unlock('streak7');
        if (streak >= 30) this.unlock('streak30');
        if (streak >= 100) this.unlock('streak100');
    }

    checkLeagueAchievements(league) {
        if (league === 'silver') this.unlock('silverLeague');
        if (league === 'gold') this.unlock('goldLeague');
        if (league === 'diamond') this.unlock('diamondLeague');
    }

    checkMasteryAchievements() {
        const swipeMock = state.get('swipeMock');
        const masteredCount = (swipeMock.mastered || []).length;

        if (masteredCount >= 10) this.unlock('master10');
        if (masteredCount >= 50) this.unlock('master50');
        if (masteredCount >= 100) this.unlock('master100');
    }

    checkMomentumAchievements(momentum) {
        if (momentum >= 500) this.unlock('momentum500');
        if (momentum >= 1000) this.unlock('momentum1000');
    }

    unlock(achievementId) {
        const user = state.get('user');
        const unlockedAchievements = user.achievements || [];

        // Check if already unlocked
        if (unlockedAchievements.includes(achievementId)) {
            return;
        }

        // Unlock achievement
        unlockedAchievements.push(achievementId);
        state.update('user', {
            ...user,
            achievements: unlockedAchievements
        });

        // Get achievement details
        const achievement = Object.values(this.achievements).find(a => a.id === achievementId);
        if (!achievement) return;

        // Celebrate!
        createConfetti();
        showToast(`🎉 ${achievement.name}`, 'success');
        notificationService.notifyAchievement(achievement);

        // Emit event
        eventBus.emit('achievement:unlocked', achievement);
    }

    getUnlockedAchievements() {
        const user = state.get('user');
        const unlockedIds = user.achievements || [];
        return Object.values(this.achievements).filter(a => unlockedIds.includes(a.id));
    }

    getLockedAchievements() {
        const user = state.get('user');
        const unlockedIds = user.achievements || [];
        return Object.values(this.achievements).filter(a => !unlockedIds.includes(a.id));
    }

    getProgress(achievementId) {
        const achievement = Object.values(this.achievements).find(a => a.id === achievementId);
        if (!achievement) return 0;

        const { type, value } = achievement.requirement;
        const swipeMock = state.get('swipeMock');
        const momentum = state.get('momentum');
        const leagues = state.get('leagues');

        switch (type) {
            case 'practice_count':
                return Math.min(100, (swipeMock.totalSwipes / value) * 100);
            case 'streak':
                return Math.min(100, (momentum.streak / value) * 100);
            case 'mastered_count':
                return Math.min(100, ((swipeMock.mastered || []).length / value) * 100);
            case 'momentum':
                return Math.min(100, (momentum.score / value) * 100);
            default:
                return 0;
        }
    }
}

export const achievementSystem = new AchievementSystem();
