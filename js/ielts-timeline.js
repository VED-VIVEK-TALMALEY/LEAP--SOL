// ============================================
// IELTS TIMELINE SERVICE
// ============================================

import { state } from './state-manager.js';
import { db } from './supabase-client.js';

export const ieltsTimeline = {
    /**
     * Get all IELTS scores for a user
     */
    async getHistory(userId) {
        if (!userId) return [];

        const history = await db.getIELTSHistory(userId);
        if (history) return history;

        // Offline fallback - get from state
        return state.get('ieltsHistory') || [];
    },

    /**
     * Add a new IELTS score
     */
    async addScore(userId, scoreData) {
        const score = {
            user_id: userId,
            test_date: scoreData.test_date,
            listening_score: scoreData.listening,
            reading_score: scoreData.reading,
            writing_score: scoreData.writing,
            speaking_score: scoreData.speaking,
            overall_score: this.calculateOverall(scoreData),
            test_type: scoreData.test_type || 'Academic',
            notes: scoreData.notes || ''
        };

        const result = await db.saveIELTSScore(userId, score);

        if (result) {
            // Update local state
            const history = state.get('ieltsHistory') || [];
            history.push(result);
            state.update('ieltsHistory', history);
            return result;
        }

        return null;
    },

    /**
     * Calculate overall IELTS score
     */
    calculateOverall(scores) {
        const { listening, reading, writing, speaking } = scores;
        const avg = (listening + reading + writing + speaking) / 4;
        return Math.round(avg * 2) / 2; // Round to nearest 0.5
    },

    /**
     * Get improvement rate (scores per month)
     */
    getImprovementRate(history) {
        if (history.length < 2) return 0;

        const sorted = [...history].sort((a, b) =>
            new Date(a.test_date) - new Date(b.test_date)
        );

        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const scoreDiff = last.overall_score - first.overall_score;
        const timeDiff = new Date(last.test_date) - new Date(first.test_date);
        const monthsDiff = timeDiff / (1000 * 60 * 60 * 24 * 30);

        return monthsDiff > 0 ? scoreDiff / monthsDiff : 0;
    },

    /**
     * Predict when user will reach target score
     */
    predictTargetDate(history, targetScore) {
        if (history.length === 0) return null;

        const sorted = [...history].sort((a, b) =>
            new Date(a.test_date) - new Date(b.test_date)
        );

        const currentScore = sorted[sorted.length - 1].overall_score;
        if (currentScore >= targetScore) return 'Already achieved!';

        const improvementRate = this.getImprovementRate(history);
        if (improvementRate <= 0) return 'Need more practice data';

        const scoreGap = targetScore - currentScore;
        const monthsNeeded = scoreGap / improvementRate;

        const lastTestDate = new Date(sorted[sorted.length - 1].test_date);
        const predictedDate = new Date(lastTestDate);
        predictedDate.setMonth(predictedDate.getMonth() + Math.ceil(monthsNeeded));

        return predictedDate;
    },

    /**
     * Get timeline data for chart visualization
     */
    getChartData(history) {
        const sorted = [...history].sort((a, b) =>
            new Date(a.test_date) - new Date(b.test_date)
        );

        return {
            labels: sorted.map(s => new Date(s.test_date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            })),
            datasets: [
                {
                    label: 'Overall',
                    data: sorted.map(s => s.overall_score),
                    color: '#5c94fc'
                },
                {
                    label: 'Listening',
                    data: sorted.map(s => s.listening_score),
                    color: '#00aa00'
                },
                {
                    label: 'Reading',
                    data: sorted.map(s => s.reading_score),
                    color: '#ffd700'
                },
                {
                    label: 'Writing',
                    data: sorted.map(s => s.writing_score),
                    color: '#ff6b6b'
                },
                {
                    label: 'Speaking',
                    data: sorted.map(s => s.speaking_score),
                    color: '#a855f7'
                }
            ]
        };
    },

    /**
     * Get score statistics
     */
    getStats(history) {
        if (history.length === 0) {
            return {
                totalTests: 0,
                bestScore: 0,
                latestScore: 0,
                improvement: 0,
                averageScore: 0
            };
        }

        const sorted = [...history].sort((a, b) =>
            new Date(a.test_date) - new Date(b.test_date)
        );

        const scores = sorted.map(s => s.overall_score);
        const bestScore = Math.max(...scores);
        const latestScore = sorted[sorted.length - 1].overall_score;
        const firstScore = sorted[0].overall_score;
        const improvement = latestScore - firstScore;
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        return {
            totalTests: history.length,
            bestScore: bestScore.toFixed(1),
            latestScore: latestScore.toFixed(1),
            improvement: improvement > 0 ? `+${improvement.toFixed(1)}` : improvement.toFixed(1),
            averageScore: averageScore.toFixed(1)
        };
    },

    /**
     * Generate mock IELTS history for demo
     */
    generateMockHistory(userId) {
        const now = new Date();
        const mockHistory = [
            {
                id: 'ielts_001',
                user_id: userId,
                test_date: new Date(now.getFullYear(), now.getMonth() - 6, 15).toISOString().split('T')[0],
                listening_score: 6.5,
                reading_score: 6.0,
                writing_score: 5.5,
                speaking_score: 6.0,
                overall_score: 6.0,
                test_type: 'Academic',
                notes: 'First attempt'
            },
            {
                id: 'ielts_002',
                user_id: userId,
                test_date: new Date(now.getFullYear(), now.getMonth() - 3, 20).toISOString().split('T')[0],
                listening_score: 7.0,
                reading_score: 6.5,
                writing_score: 6.0,
                speaking_score: 6.5,
                overall_score: 6.5,
                test_type: 'Academic',
                notes: 'Improved writing and speaking'
            },
            {
                id: 'ielts_003',
                user_id: userId,
                test_date: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString().split('T')[0],
                listening_score: 7.5,
                reading_score: 7.0,
                writing_score: 6.5,
                speaking_score: 7.0,
                overall_score: 7.0,
                test_type: 'Academic',
                notes: 'Getting closer to target!'
            }
        ];

        state.update('ieltsHistory', mockHistory);
        return mockHistory;
    }
};
