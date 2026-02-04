// ============================================
// LEAGUE SYSTEM - Rankings & Progression
// ============================================

import { state } from './state-manager.js';
import { eventBus } from './event-bus.js';
import { numberUtils } from './utils.js';

export class LeagueSystem {
    constructor() {
        this.leagues = [
            { name: 'bronze', minPoints: 0, maxPoints: 999, color: '#cd7f32' },
            { name: 'silver', minPoints: 1000, maxPoints: 2499, color: '#c0c0c0' },
            { name: 'gold', minPoints: 2500, maxPoints: 4999, color: '#ffd700' },
            { name: 'diamond', minPoints: 5000, maxPoints: Infinity, color: '#b9f2ff' }
        ];
    }

    // Calculate league points
    calculateLeaguePoints() {
        const accuracy = this.calculateAccuracy();
        const consistency = this.calculateConsistency();
        const momentum = state.get('momentum.score') || 0;
        const improvement = this.calculateImprovement();

        const points = Math.round(
            accuracy * 40 +
            consistency * 30 +
            momentum * 0.2 + // Momentum contributes to points
            improvement * 10
        );

        return numberUtils.clamp(points, 0, 10000);
    }

    // Calculate accuracy (0-100)
    calculateAccuracy() {
        const swipeMock = state.get('swipeMock');
        const sessionHistory = swipeMock.sessionHistory || [];

        if (sessionHistory.length === 0) return 0;

        // Get last 100 questions
        let totalQuestions = 0;
        let correctAnswers = 0;

        for (let i = sessionHistory.length - 1; i >= 0 && totalQuestions < 100; i--) {
            const session = sessionHistory[i];
            session.questions.forEach(q => {
                if (totalQuestions < 100) {
                    totalQuestions++;
                    if (q.correct) correctAnswers++;
                }
            });
        }

        return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    }

    // Calculate consistency (0-100)
    calculateConsistency() {
        const history = state.get('momentum.activityHistory') || [];
        if (history.length === 0) return 0;

        const last7Days = history.slice(-7);
        return (last7Days.length / 7) * 100;
    }

    // Calculate improvement (0-100)
    calculateImprovement() {
        const swipeMock = state.get('swipeMock');
        const sessionHistory = swipeMock.sessionHistory || [];

        if (sessionHistory.length < 2) return 0;

        // Compare last week vs previous week
        const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const cutoff2Weeks = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        let lastWeekCorrect = 0, lastWeekTotal = 0;
        let prevWeekCorrect = 0, prevWeekTotal = 0;

        sessionHistory.forEach(session => {
            const sessionDate = new Date(session.date);
            session.questions.forEach(q => {
                if (sessionDate >= cutoff) {
                    lastWeekTotal++;
                    if (q.correct) lastWeekCorrect++;
                } else if (sessionDate >= cutoff2Weeks) {
                    prevWeekTotal++;
                    if (q.correct) prevWeekCorrect++;
                }
            });
        });

        if (prevWeekTotal === 0) return 0;

        const lastWeekAccuracy = lastWeekTotal > 0 ? lastWeekCorrect / lastWeekTotal : 0;
        const prevWeekAccuracy = prevWeekCorrect / prevWeekTotal;

        const improvement = ((lastWeekAccuracy - prevWeekAccuracy) / prevWeekAccuracy) * 100;

        // Convert to 0-100 scale (50% improvement = 100 points)
        return numberUtils.clamp((improvement / 0.5) * 100, 0, 100);
    }

    // Get current league
    getCurrentLeague() {
        const points = state.get('leagues.leaguePoints') || 0;

        for (const league of this.leagues) {
            if (points >= league.minPoints && points <= league.maxPoints) {
                return league;
            }
        }

        return this.leagues[0]; // Default to bronze
    }

    // Update league points and check for promotion/demotion
    updateLeaguePoints() {
        const newPoints = this.calculateLeaguePoints();
        const currentLeague = state.get('leagues.currentLeague');
        const newLeague = this.getCurrentLeague();

        state.set('leagues.leaguePoints', newPoints);

        // Check for league change
        if (newLeague.name !== currentLeague) {
            const promoted = this.leagues.findIndex(l => l.name === newLeague.name) >
                this.leagues.findIndex(l => l.name === currentLeague);

            state.set('leagues.currentLeague', newLeague.name);

            // Update peak league if promoted
            if (promoted) {
                const peakLeague = state.get('leagues.peakLeague');
                const peakIndex = this.leagues.findIndex(l => l.name === peakLeague);
                const newIndex = this.leagues.findIndex(l => l.name === newLeague.name);

                if (newIndex > peakIndex) {
                    state.set('leagues.peakLeague', newLeague.name);
                }
            }

            eventBus.emit('league:changed', {
                newLeague: newLeague.name,
                promoted,
                points: newPoints
            });
        }

        // Update weekly stats
        state.update('leagues.weeklyStats', {
            accuracy: this.calculateAccuracy(),
            consistency: this.calculateConsistency(),
            improvement: this.calculateImprovement()
        });
    }

    // Generate mock leaderboard (for demo purposes)
    generateLeaderboard(userPoints) {
        const currentLeague = this.getCurrentLeague();
        const leaderboard = [];

        // Generate 20 mock users in current league
        for (let i = 0; i < 20; i++) {
            const pointsInRange = Math.floor(
                currentLeague.minPoints +
                Math.random() * (currentLeague.maxPoints - currentLeague.minPoints)
            );

            leaderboard.push({
                id: `user_${i}`,
                name: this.generateUsername(),
                points: pointsInRange,
                daysActive: Math.floor(Math.random() * 90) + 1,
                accuracy: Math.floor(Math.random() * 40) + 60,
                improvement: Math.floor(Math.random() * 30)
            });
        }

        // Add current user
        leaderboard.push({
            id: 'current_user',
            name: state.get('user.name') || 'You',
            points: userPoints,
            daysActive: state.get('momentum.totalDaysActive') || 0,
            accuracy: this.calculateAccuracy(),
            improvement: this.calculateImprovement(),
            isCurrentUser: true
        });

        // Sort by points
        leaderboard.sort((a, b) => b.points - a.points);

        // Add ranks
        leaderboard.forEach((user, index) => {
            user.rank = index + 1;
        });

        return leaderboard;
    }

    // Generate random username
    generateUsername() {
        const adjectives = ['Swift', 'Bright', 'Bold', 'Keen', 'Sharp', 'Quick', 'Smart', 'Wise'];
        const nouns = ['Learner', 'Scholar', 'Student', 'Achiever', 'Seeker', 'Thinker'];
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 999)}`;
    }

    // Get promotion/demotion zone info
    getZoneInfo(rank, totalUsers = 20) {
        const promotionCutoff = Math.ceil(totalUsers * 0.2); // Top 20%
        const demotionCutoff = Math.floor(totalUsers * 0.9); // Bottom 10%

        if (rank <= promotionCutoff) {
            return { zone: 'promotion', message: 'Promotion Zone! 🎉' };
        } else if (rank >= demotionCutoff) {
            return { zone: 'demotion', message: 'Recalibration Zone' };
        } else {
            return { zone: 'safe', message: 'Safe Zone' };
        }
    }
}

// Create singleton instance
export const leagueSystem = new LeagueSystem();
