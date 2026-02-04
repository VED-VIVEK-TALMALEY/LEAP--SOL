// ============================================
// AUTHENTICATION SERVICE
// ============================================

import { supabase, isSupabaseConfigured } from './supabase-client.js';
import { state } from './state-manager.js';
import { eventBus } from './event-bus.js';

export class AuthService {
    constructor() {
        this.currentUser = null;
        this.isOfflineMode = !isSupabaseConfigured();

        if (!this.isOfflineMode) {
            this.initializeAuth().catch(err => {
                console.warn('Auth initialization failed, switching to offline mode:', err);
                this.isOfflineMode = true;
            });
        }
    }

    async initializeAuth() {
        try {
            // Check for existing session
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                this.currentUser = session.user;
                await this.loadUserData();
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN') {
                    this.currentUser = session.user;
                    await this.loadUserData();
                    eventBus.emit('auth:signed-in', this.currentUser);
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    eventBus.emit('auth:signed-out');
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            throw error;
        }
    }

    async signUp(email, password, userData) {
        if (this.isOfflineMode) {
            return { error: { message: 'Supabase not configured. Running in offline mode.' } };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });

        if (!error && data.user) {
            // Create user profile
            await supabase.from('users').insert({
                id: data.user.id,
                email: data.user.email,
                name: userData.name,
                target_score: userData.targetScore,
                daily_commitment: userData.dailyCommitment,
                onboarding_complete: true
            });
        }

        return { data, error };
    }

    async signIn(email, password) {
        if (this.isOfflineMode) {
            return { error: { message: 'Supabase not configured. Running in offline mode.' } };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        return { data, error };
    }

    async signOut() {
        if (this.isOfflineMode) return;

        const { error } = await supabase.auth.signOut();
        if (!error) {
            this.currentUser = null;
            state.reset();
        }
        return { error };
    }

    async resetPassword(email) {
        if (this.isOfflineMode) {
            return { error: { message: 'Supabase not configured.' } };
        }

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        return { data, error };
    }

    async loadUserData() {
        if (!this.currentUser) return;

        // Load user profile
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.currentUser.id)
            .single();

        if (profile) {
            state.update('user', {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                targetScore: profile.target_score,
                dailyCommitment: profile.daily_commitment,
                onboardingComplete: profile.onboarding_complete,
                joinedDate: profile.joined_date
            });
        }

        // Load progress
        const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', this.currentUser.id)
            .single();

        if (progress) {
            state.update('momentum', {
                score: progress.momentum_score || 0,
                streak: progress.streak || 0,
                longestStreak: progress.longest_streak || 0
            });

            state.update('leagues', {
                currentLeague: progress.league || 'bronze',
                leaguePoints: progress.league_points || 0
            });
        }
    }

    async syncProgress() {
        if (this.isOfflineMode || !this.currentUser) return;

        const momentum = state.get('momentum');
        const leagues = state.get('leagues');

        await supabase.from('user_progress').upsert({
            user_id: this.currentUser.id,
            momentum_score: momentum.score,
            streak: momentum.streak,
            longest_streak: momentum.longestStreak,
            league: leagues.currentLeague,
            league_points: leagues.leaguePoints,
            updated_at: new Date().toISOString()
        });
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isOffline() {
        return this.isOfflineMode;
    }
}

export const authService = new AuthService();

// Auto-sync progress every 30 seconds
if (!authService.isOffline()) {
    setInterval(() => {
        if (authService.isAuthenticated()) {
            authService.syncProgress();
        }
    }, 30000);
}
