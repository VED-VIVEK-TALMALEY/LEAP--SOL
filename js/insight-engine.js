// ============================================
// INSIGHT ENGINE - IELTS → College Mapping
// ============================================

import { state } from './state-manager.js';
import { collegeDatabase, getCoursesMatchingIELTS } from '../data/college-database.js';

class InsightEngine {
    constructor() {
        this.insights = [];
    }

    // Generate personalized insights based on user's IELTS progress
    generateInsights() {
        const user = state.get('user');
        const momentum = state.get('momentum');

        if (!user) return [];

        const targetScore = user.targetScore || 7.5;
        const currentScore = this.estimateCurrentScore();

        this.insights = [];

        // Insight 1: Matching colleges
        this.insights.push(this.getMatchingCollegesInsight(currentScore, targetScore));

        // Insight 2: Score gap analysis
        this.insights.push(this.getScoreGapInsight(currentScore, targetScore));

        // Insight 3: Momentum-based prediction
        if (momentum) {
            this.insights.push(this.getMomentumPrediction(currentScore, targetScore, momentum));
        }

        // Insight 4: Deadline urgency
        this.insights.push(this.getDeadlineUrgency());

        return this.insights;
    }

    // Estimate current IELTS score based on practice performance
    estimateCurrentScore() {
        const momentum = state.get('momentum');
        const user = state.get('user');

        if (!momentum || !user) return 6.0;

        // Simple estimation: base score + momentum bonus
        // Momentum 0-100 = 6.0-7.5, 100-200 = 7.5-8.5, 200+ = 8.5-9.0
        const baseScore = 6.0;
        const momentumBonus = Math.min(momentum.score / 100, 3.0);

        return Math.min(9.0, baseScore + momentumBonus);
    }

    // Get matching colleges insight
    getMatchingCollegesInsight(currentScore, targetScore) {
        const scoreToUse = Math.max(currentScore, targetScore);

        const matchingCourses = getCoursesMatchingIELTS({
            overall: scoreToUse,
            writing: scoreToUse - 0.5,
            reading: scoreToUse - 0.5,
            listening: scoreToUse - 0.5,
            speaking: scoreToUse - 0.5
        });

        const topUniversities = matchingCourses
            .filter(c => c.admitTrends.acceptanceRate < 0.2)
            .slice(0, 3);

        return {
            type: 'matching_colleges',
            icon: '🎯',
            title: 'Colleges Within Reach',
            description: `${matchingCourses.length} courses match your target score of ${targetScore}`,
            data: {
                totalMatching: matchingCourses.length,
                topUniversities: topUniversities.map(c => c.college.name),
                targetScore: scoreToUse
            },
            priority: 'high'
        };
    }

    // Get score gap analysis
    getScoreGapInsight(currentScore, targetScore) {
        const gap = targetScore - currentScore;

        let message, priority, icon;

        if (gap <= 0) {
            icon = '✅';
            message = `You've reached your target! Consider applying to reach schools.`;
            priority = 'success';
        } else if (gap <= 0.5) {
            icon = '🎯';
            message = `Just ${gap.toFixed(1)} points away from your target!`;
            priority = 'high';
        } else if (gap <= 1.0) {
            icon = '📈';
            message = `${gap.toFixed(1)} points to go. Keep practicing daily!`;
            priority = 'medium';
        } else {
            icon = '🚀';
            message = `${gap.toFixed(1)} points gap. Focus on consistent practice.`;
            priority = 'medium';
        }

        return {
            type: 'score_gap',
            icon,
            title: 'Your Progress',
            description: message,
            data: {
                currentScore: currentScore.toFixed(1),
                targetScore: targetScore.toFixed(1),
                gap: gap.toFixed(1)
            },
            priority
        };
    }

    // Get momentum-based prediction
    getMomentumPrediction(currentScore, targetScore, momentum) {
        const daysToTarget = this.estimateDaysToTarget(currentScore, targetScore, momentum);

        let message, icon;

        if (daysToTarget <= 30) {
            icon = '🔥';
            message = `At your current pace, you'll hit ${targetScore} in ~${daysToTarget} days!`;
        } else if (daysToTarget <= 60) {
            icon = '💪';
            message = `Keep this momentum! Target achievable in ~${daysToTarget} days.`;
        } else {
            icon = '⚡';
            message = `Increase practice frequency to reach ${targetScore} faster.`;
        }

        return {
            type: 'momentum_prediction',
            icon,
            title: 'Time to Target',
            description: message,
            data: {
                daysToTarget,
                currentMomentum: momentum.score,
                streak: momentum.streak
            },
            priority: 'medium'
        };
    }

    // Estimate days to reach target score
    estimateDaysToTarget(currentScore, targetScore, momentum) {
        const gap = targetScore - currentScore;
        if (gap <= 0) return 0;

        // Assume 0.1 score improvement per 10 days of consistent practice
        // Adjust based on momentum (higher momentum = faster improvement)
        const baseRate = 0.01; // 0.01 points per day
        const momentumMultiplier = 1 + (momentum.score / 200);
        const dailyImprovement = baseRate * momentumMultiplier;

        return Math.ceil(gap / dailyImprovement);
    }

    // Get deadline urgency insight
    getDeadlineUrgency() {
        const now = new Date();
        const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

        // Get upcoming deadlines from college database
        const upcomingDeadlines = [];
        for (const college of collegeDatabase) {
            for (const course of college.courses) {
                const deadline = new Date(course.deadline);
                if (deadline >= now && deadline <= threeMonthsFromNow) {
                    upcomingDeadlines.push({
                        college: college.name,
                        course: course.name,
                        deadline: course.deadline,
                        daysUntil: Math.ceil((deadline - now) / (24 * 60 * 60 * 1000))
                    });
                }
            }
        }

        upcomingDeadlines.sort((a, b) => a.daysUntil - b.daysUntil);

        let message, icon, priority;

        if (upcomingDeadlines.length === 0) {
            icon = '📅';
            message = 'No urgent deadlines in the next 3 months.';
            priority = 'low';
        } else if (upcomingDeadlines[0].daysUntil <= 30) {
            icon = '⚠️';
            message = `${upcomingDeadlines.length} deadlines coming up! Nearest in ${upcomingDeadlines[0].daysUntil} days.`;
            priority = 'urgent';
        } else {
            icon = '📆';
            message = `${upcomingDeadlines.length} deadlines in next 3 months.`;
            priority = 'medium';
        }

        return {
            type: 'deadline_urgency',
            icon,
            title: 'Upcoming Deadlines',
            description: message,
            data: {
                upcomingCount: upcomingDeadlines.length,
                nearest: upcomingDeadlines[0] || null,
                allDeadlines: upcomingDeadlines.slice(0, 5)
            },
            priority
        };
    }

    // Get college recommendations based on score
    getCollegeRecommendations(ieltsScore) {
        const matching = getCoursesMatchingIELTS({
            overall: ieltsScore,
            writing: ieltsScore - 0.5,
            reading: ieltsScore - 0.5,
            listening: ieltsScore - 0.5,
            speaking: ieltsScore - 0.5
        });

        // Categorize by acceptance rate
        const reach = matching.filter(c => c.admitTrends.acceptanceRate < 0.15);
        const target = matching.filter(c => c.admitTrends.acceptanceRate >= 0.15 && c.admitTrends.acceptanceRate < 0.25);
        const safety = matching.filter(c => c.admitTrends.acceptanceRate >= 0.25);

        return {
            reach: reach.slice(0, 3),
            target: target.slice(0, 3),
            safety: safety.slice(0, 3),
            total: matching.length
        };
    }

    // Get all insights
    getAllInsights() {
        return this.insights;
    }

    // Get insights by priority
    getInsightsByPriority(priority) {
        return this.insights.filter(i => i.priority === priority);
    }
}

// Create singleton instance
export const insightEngine = new InsightEngine();
