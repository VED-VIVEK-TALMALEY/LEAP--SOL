// ============================================
// RIVALS SYSTEM - Auto-assignment & Competition
// ============================================

import { state } from './state-manager.js';
import { eventBus } from './event-bus.js';
import { db, supabase, isSupabaseConfigured } from './supabase-client.js';

class RivalsSystem {
    constructor() {
        this.currentRival = null;
        this.rivalHistory = [];
    }

    // Initialize rivals system
    async initialize() {
        if (!isSupabaseConfigured()) {
            console.log('Rivals system running in offline mode');
            this.loadOfflineRival();
            return;
        }

        await this.loadCurrentRival();

        // Check if user needs a rival assignment
        if (!this.currentRival) {
            await this.autoAssignRival();
        }
    }

    // Load current rival from database
    async loadCurrentRival() {
        const user = state.get('user');
        if (!user?.id) return;

        const rival = await db.getRival(user.id);
        if (rival) {
            this.currentRival = rival;
            state.update('rival', rival);
        }
    }

    // Auto-assign a rival based on similar momentum and league
    async autoAssignRival() {
        if (!isSupabaseConfigured()) return;

        const user = state.get('user');
        const momentum = state.get('momentum');
        const leagues = state.get('leagues');

        if (!user?.id || !momentum || !leagues) return;

        try {
            // Find users in same league with similar momentum (±10%)
            const momentumRange = momentum.score * 0.1;
            const minMomentum = momentum.score - momentumRange;
            const maxMomentum = momentum.score + momentumRange;

            const { data: potentialRivals, error } = await supabase
                .from('user_progress')
                .select('user_id, momentum_score')
                .eq('current_league', leagues.currentLeague)
                .gte('momentum_score', minMomentum)
                .lte('momentum_score', maxMomentum)
                .neq('user_id', user.id)
                .limit(10);

            if (error || !potentialRivals || potentialRivals.length === 0) {
                console.log('No suitable rivals found');
                return;
            }

            // Randomly select one
            const selectedRival = potentialRivals[Math.floor(Math.random() * potentialRivals.length)];

            // Assign rival
            const assignedRival = await db.assignRival(user.id, selectedRival.user_id);

            if (assignedRival) {
                this.currentRival = assignedRival;
                state.update('rival', assignedRival);

                eventBus.emit('rival:assigned', {
                    rival: assignedRival
                });

                console.log('✅ Rival assigned:', assignedRival);
            }
        } catch (error) {
            console.error('Error auto-assigning rival:', error);
        }
    }

    // Load offline rival (mock data for offline mode)
    loadOfflineRival() {
        const offlineRival = state.get('rival');
        if (!offlineRival) {
            // Create a mock rival
            const mockRival = {
                id: 'rival_mock_001',
                name: 'Alex Chen',
                avatar_url: null,
                momentum_score: state.get('momentum.score') + Math.floor(Math.random() * 20) - 10,
                streak: state.get('momentum.streak') + Math.floor(Math.random() * 5) - 2,
                league: state.get('leagues.currentLeague'),
                league_points: state.get('leagues.leaguePoints') + Math.floor(Math.random() * 100) - 50
            };

            this.currentRival = mockRival;
            state.update('rival', mockRival);
        } else {
            this.currentRival = offlineRival;
        }
    }

    // Get rival comparison data
    getRivalComparison() {
        const user = state.get('user');
        const momentum = state.get('momentum');
        const leagues = state.get('leagues');
        const rival = this.currentRival;

        if (!rival) return null;

        return {
            user: {
                name: user.name,
                momentum: momentum.score,
                streak: momentum.streak,
                league: leagues.currentLeague,
                leaguePoints: leagues.leaguePoints
            },
            rival: {
                name: rival.name || rival.rival?.name || 'Unknown',
                momentum: rival.momentum_score || rival.rival?.momentum_score || 0,
                streak: rival.streak || rival.rival?.streak || 0,
                league: rival.league || rival.rival?.league || 'bronze',
                leaguePoints: rival.league_points || rival.rival?.league_points || 0
            }
        };
    }

    // Update rival's mock data (for offline mode)
    updateOfflineRival() {
        if (!this.currentRival || isSupabaseConfigured()) return;

        // Simulate rival activity
        const change = Math.floor(Math.random() * 10) - 3;
        this.currentRival.momentum_score = Math.max(0, this.currentRival.momentum_score + change);

        // Random streak update
        if (Math.random() > 0.7) {
            this.currentRival.streak += 1;
        }

        state.update('rival', this.currentRival);

        eventBus.emit('rival:updated', {
            rival: this.currentRival
        });
    }

    // Get current rival
    getCurrentRival() {
        return this.currentRival;
    }

    // Check if user is ahead of rival
    isAheadOfRival() {
        const comparison = this.getRivalComparison();
        if (!comparison) return false;

        return comparison.user.momentum > comparison.rival.momentum;
    }

    // Get motivation message based on rival comparison
    getMotivationMessage() {
        const comparison = this.getRivalComparison();
        if (!comparison) return null;

        const diff = comparison.user.momentum - comparison.rival.momentum;

        if (diff > 20) {
            return `🔥 You're crushing it! ${Math.abs(diff)} points ahead of ${comparison.rival.name}!`;
        } else if (diff > 0) {
            return `💪 You're ahead by ${diff} points. Keep pushing!`;
        } else if (diff === 0) {
            return `⚡ Neck and neck with ${comparison.rival.name}! Time to pull ahead!`;
        } else if (diff > -20) {
            return `🎯 ${comparison.rival.name} is ${Math.abs(diff)} points ahead. Catch up!`;
        } else {
            return `🚀 ${comparison.rival.name} is way ahead. Time to level up!`;
        }
    }
}

// Create singleton instance
export const rivalsSystem = new RivalsSystem();

// Auto-initialize when imported
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => rivalsSystem.initialize(), 1000);
    });
}
