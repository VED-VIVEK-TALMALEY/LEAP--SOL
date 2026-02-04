// ============================================
// MOMENTUM ENGINE - Core Habit System
// ============================================

import { state } from './state-manager.js';
import { dateUtils, numberUtils } from './utils.js';
import { eventBus } from './event-bus.js';

export class MomentumEngine {
    constructor() {
        this.initializeEngine();
    }

    initializeEngine() {
        // Check if we need to update daily state
        const lastActivity = state.get('momentum.lastActivityDate');
        const today = dateUtils.today();

        if (lastActivity && lastActivity !== today) {
            this.handleDayTransition(lastActivity, today);
        }
    }

    // Handle transition between days
    handleDayTransition(lastDate, currentDate) {
        const daysMissed = dateUtils.daysBetween(lastDate, currentDate) - 1;

        if (daysMissed > 0) {
            // Pause streak, don't reset
            if (daysMissed === 1) {
                // Grace period - no penalty
                console.log('Grace period applied');
            } else {
                // Pause streak
                state.update('momentum', {
                    streakPaused: true,
                    pausedAt: lastDate
                });
                eventBus.emit('streak:paused', { daysMissed });
            }
        }
    }

    // Calculate momentum score (0-100)
    calculateMomentumScore() {
        const consistency = this.calculateConsistency();
        const effort = this.calculateEffort();
        const skillBalance = this.calculateSkillBalance();
        const recovery = this.calculateRecovery();

        const momentum = (
            consistency * 0.4 +
            effort * 0.3 +
            skillBalance * 0.2 +
            recovery * 0.1
        );

        return numberUtils.clamp(Math.round(momentum), 0, 100);
    }

    // Calculate consistency score (0-100)
    calculateConsistency() {
        const history = state.get('momentum.activityHistory') || [];
        if (history.length === 0) return 0;

        const last7Days = history.slice(-7);
        const last14Days = history.slice(-14);
        const last30Days = history.slice(-30);

        // Weight recent activity more heavily
        const score7 = (last7Days.length / 7) * 100 * 0.5;
        const score14 = (last14Days.length / 14) * 100 * 0.3;
        const score30 = (last30Days.length / 30) * 100 * 0.2;

        return score7 + score14 + score30;
    }

    // Calculate effort score (0-100)
    calculateEffort() {
        const history = state.get('momentum.activityHistory') || [];
        if (history.length === 0) return 0;

        const last7Days = history.slice(-7);
        const totalEffort = last7Days.reduce((sum, day) => sum + (day.effort || 0), 0);
        const avgEffort = totalEffort / last7Days.length;

        // Effort is 0-10 scale, convert to 0-100
        return avgEffort * 10;
    }

    // Calculate skill balance score (0-100)
    calculateSkillBalance() {
        const swipeMock = state.get('swipeMock');
        const sessionHistory = swipeMock.sessionHistory || [];

        if (sessionHistory.length === 0) return 100; // No penalty if just starting

        // Count questions per skill in last 7 days
        const skillCounts = { reading: 0, writing: 0, listening: 0, speaking: 0 };
        const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        sessionHistory.forEach(session => {
            if (new Date(session.date) >= cutoffDate) {
                session.questions.forEach(q => {
                    skillCounts[q.skill] = (skillCounts[q.skill] || 0) + 1;
                });
            }
        });

        const counts = Object.values(skillCounts);
        const total = counts.reduce((a, b) => a + b, 0);

        if (total === 0) return 100;

        // Calculate standard deviation (lower is better)
        const mean = total / 4;
        const variance = counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / 4;
        const stdDev = Math.sqrt(variance);

        // Convert to score (0 stdDev = 100, high stdDev = lower score)
        const balanceScore = Math.max(0, 100 - (stdDev / mean) * 50);

        return balanceScore;
    }

    // Calculate recovery score (0-100)
    calculateRecovery() {
        const streakPaused = state.get('momentum.streakPaused');
        const pausedAt = state.get('momentum.pausedAt');
        const currentStreak = state.get('momentum.streak');
        const longestStreak = state.get('momentum.longestStreak');

        if (!streakPaused) return 0; // No recovery needed

        if (currentStreak === 0) return 0; // Just started recovery

        // Comeback score: reward for returning
        const streakBeforePause = longestStreak;
        const recoverySpeed = currentStreak / Math.max(1, dateUtils.daysBetween(pausedAt, dateUtils.today()));

        const comebackScore = Math.min(100, streakBeforePause * recoverySpeed * 10);

        return comebackScore;
    }

    // Record daily activity
    recordActivity(actions, effort) {
        const today = dateUtils.today();
        const history = state.get('momentum.activityHistory') || [];

        // Check if already recorded today
        const todayIndex = history.findIndex(h => h.date === today);

        if (todayIndex >= 0) {
            // Update today's record
            history[todayIndex].actions += actions;
            history[todayIndex].effort = Math.max(history[todayIndex].effort, effort);
        } else {
            // Add new record
            history.push({ date: today, actions, effort });
        }

        // Update streak
        this.updateStreak();

        // Update state
        state.update('momentum', {
            activityHistory: history,
            lastActivityDate: today,
            totalDaysActive: history.length
        });

        // Recalculate momentum score
        const newScore = this.calculateMomentumScore();
        state.set('momentum.score', newScore);

        // Emit event
        eventBus.emit('momentum:updated', { score: newScore });
    }

    // Update streak
    updateStreak() {
        const today = dateUtils.today();
        const lastActivity = state.get('momentum.lastActivityDate');
        const currentStreak = state.get('momentum.streak');
        const streakPaused = state.get('momentum.streakPaused');

        if (!lastActivity) {
            // First day
            state.set('momentum.streak', 1);
            state.set('momentum.longestStreak', 1);
            return;
        }

        const daysSince = dateUtils.daysBetween(lastActivity, today);

        if (daysSince === 0) {
            // Same day, no change
            return;
        } else if (daysSince === 1) {
            // Consecutive day
            const newStreak = currentStreak + 1;
            state.set('momentum.streak', newStreak);

            // Update longest if needed
            const longestStreak = state.get('momentum.longestStreak');
            if (newStreak > longestStreak) {
                state.set('momentum.longestStreak', newStreak);
            }

            // Unpause if was paused
            if (streakPaused) {
                state.set('momentum.streakPaused', false);
                state.set('momentum.comebackScore', this.calculateRecovery());
                eventBus.emit('streak:resumed', { streak: newStreak });
            }
        }
    }

    // Get daily action recommendation
    getDailyAction() {
        const momentum = state.get('momentum.score') || 0;
        const commitment = state.get('user.dailyCommitment') || 15;
        const swipeMock = state.get('swipeMock');
        const needsWork = swipeMock.needsWork || [];

        // Determine action based on momentum and needs
        if (needsWork.length > 10) {
            return {
                type: 'swipe-mock',
                title: 'Review Needs Work',
                description: `You have ${needsWork.length} questions to review`,
                duration: Math.min(commitment, 10),
                effort: 7
            };
        } else if (momentum < 30) {
            return {
                type: 'swipe-mock',
                title: 'Quick Practice',
                description: 'Build momentum with a 2-minute session',
                duration: 2,
                effort: 3
            };
        } else if (momentum < 60) {
            return {
                type: 'swipe-mock',
                title: 'Daily Practice',
                description: 'Maintain your momentum',
                duration: Math.min(commitment, 5),
                effort: 5
            };
        } else {
            return {
                type: 'swipe-mock',
                title: 'Deep Practice',
                description: 'Push your limits today',
                duration: Math.min(commitment, 10),
                effort: 8
            };
        }
    }

    // Get momentum insights
    getInsights() {
        const momentum = state.get('momentum.score') || 0;
        const streak = state.get('momentum.streak') || 0;
        const streakPaused = state.get('momentum.streakPaused');
        const insights = [];

        if (momentum < 30) {
            insights.push({
                type: 'warning',
                message: 'Your momentum is low. Start with just 2 minutes today.',
                action: 'Start Quick Practice'
            });
        } else if (momentum >= 70) {
            insights.push({
                type: 'success',
                message: `Amazing! You're in the top 20% of learners.`,
                action: null
            });
        }

        if (streak >= 7 && !streakPaused) {
            insights.push({
                type: 'success',
                message: `${streak} day streak! You're building a real habit.`,
                action: null
            });
        }

        if (streakPaused) {
            insights.push({
                type: 'info',
                message: 'Your streak is paused. Complete today\'s action to resume.',
                action: 'Resume Streak'
            });
        }

        return insights;
    }
}

// Create singleton instance
export const momentumEngine = new MomentumEngine();
