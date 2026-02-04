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
    }
};
