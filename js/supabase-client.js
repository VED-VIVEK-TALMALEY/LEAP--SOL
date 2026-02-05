// ============================================
// SUPABASE CLIENT - Database Connection
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not found. Running in offline mode.');
    console.warn('To enable cloud sync, create a .env file with:');
    console.warn('VITE_SUPABASE_URL=your_url');
    console.warn('VITE_SUPABASE_ANON_KEY=your_key');
}

let supabase = null;

try {
    if (supabaseUrl && supabaseAnonKey) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
} catch (error) {
    console.error('Failed to create Supabase client:', error);
    supabase = null;
}

export { supabase };

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabase !== null;
};

// Database helper functions
export const db = {
    // Users
    async getUser(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        return error ? null : data;
    },

    async updateUser(userId, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        return error ? null : data;
    },

    // Progress
    async saveProgress(userId, progressData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                ...progressData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        return error ? null : data;
    },

    async getProgress(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();
        return error ? null : data;
    },

    // Answers
    async saveAnswer(userId, questionId, correct) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('user_answers')
            .insert({
                user_id: userId,
                question_id: questionId,
                correct,
                answered_at: new Date().toISOString()
            })
            .select()
            .single();
        return error ? null : data;
    },

    // Rivals
    async getRival(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('rivals')
            .select('*, rival:users!rival_id(*)')
            .eq('user_id', userId)
            .single();
        return error ? null : data;
    },

    async assignRival(userId, rivalId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('rivals')
            .insert({
                user_id: userId,
                rival_id: rivalId
            })
            .select()
            .single();
        return error ? null : data;
    },

    // Applications
    async getApplications(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return error ? null : data;
    },

    async createApplication(userId, appData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('applications')
            .insert({
                user_id: userId,
                ...appData
            })
            .select()
            .single();
        return error ? null : data;
    },

    async updateApplication(appId, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('applications')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', appId)
            .select()
            .single();
        return error ? null : data;
    },

    // Creators
    async getCreators(filters = {}) {
        if (!supabase) return null;
        let query = supabase.from('creators').select('*');

        if (filters.verified !== undefined) {
            query = query.eq('verified', filters.verified);
        }
        if (filters.category) {
            query = query.contains('category', [filters.category]);
        }

        const { data, error } = await query;
        return error ? null : data;
    },

    // Alumni
    async getAlumni(filters = {}) {
        if (!supabase) return null;
        let query = supabase.from('alumni').select('*').eq('available_for_connect', true);

        if (filters.country) {
            query = query.eq('country', filters.country);
        }
        if (filters.university) {
            query = query.ilike('university', `%${filters.university}%`);
        }

        const { data, error } = await query;
        return error ? null : data;
    },

    // Success Stories
    async getSuccessStories(filters = {}) {
        if (!supabase) return null;
        let query = supabase.from('success_stories').select('*');

        if (filters.featured) {
            query = query.eq('featured', true);
        }
        if (filters.university) {
            query = query.ilike('university', `%${filters.university}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        return error ? null : data;
    },

    // Phase 5: IELTS History
    async getIELTSHistory(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('ielts_history')
            .select('*')
            .eq('user_id', userId)
            .order('test_date', { ascending: true });
        return error ? null : data;
    },

    async saveIELTSScore(userId, scoreData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('ielts_history')
            .insert({
                user_id: userId,
                ...scoreData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        return error ? null : data;
    },

    async updateIELTSScore(scoreId, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('ielts_history')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', scoreId)
            .select()
            .single();
        return error ? null : data;
    },

    async deleteIELTSScore(scoreId) {
        if (!supabase) return null;
        const { error } = await supabase
            .from('ielts_history')
            .delete()
            .eq('id', scoreId);
        return !error;
    },

    // Phase 5: Academic Profiles
    async getAcademicProfile(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('academic_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        return error ? null : data;
    },

    async getPublicProfile(slug) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('academic_profiles')
            .select('*')
            .eq('profile_slug', slug)
            .eq('is_public', true)
            .single();
        return error ? null : data;
    },

    async createAcademicProfile(userId, profileData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('academic_profiles')
            .insert({
                user_id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        return error ? null : data;
    },

    async updateAcademicProfile(userId, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('academic_profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .select()
            .single();
        return error ? null : data;
    }
};
