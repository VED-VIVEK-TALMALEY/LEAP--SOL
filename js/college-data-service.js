// ============================================
// COLLEGE DATA SERVICE - Real-time Import
// ============================================

import { db } from './supabase-client.js';

const HIPOLABS_API = 'http://universities.hipolabs.com/search';
const COLLEGE_SCORECARD_API = 'https://api.data.gov/ed/collegescorecard/v1/schools';

export const collegeDataService = {
    /**
     * Search universities from external API
     */
    async searchUniversities(country = 'United States', name = '') {
        try {
            const params = new URLSearchParams({
                country: country,
                ...(name && { name: name })
            });

            const response = await fetch(`${HIPOLABS_API}?${params}`);
            const universities = await response.json();

            return universities.map(uni => ({
                name: uni.name,
                country: uni.country,
                state: uni['state-province'] || '',
                website: uni.web_pages?.[0] || '',
                domains: uni.domains || []
            }));
        } catch (error) {
            console.error('Error fetching universities:', error);
            return [];
        }
    },

    /**
     * Import and cache universities to Supabase
     */
    async importUniversities(country = 'United States') {
        const universities = await this.searchUniversities(country);

        if (universities.length === 0) return { success: false, count: 0 };

        // Transform for database
        const collegeData = universities.map(uni => ({
            name: uni.name,
            country: uni.country,
            state: uni.state,
            website: uni.website,
            logo_url: `https://logo.clearbit.com/${uni.domains[0]}`,
            verified: false,
            created_at: new Date().toISOString()
        }));

        // Upsert to Supabase (if db is available)
        if (db && db.supabase) {
            try {
                const { data, error } = await db.supabase
                    .from('colleges')
                    .upsert(collegeData, {
                        onConflict: 'name',
                        ignoreDuplicates: true
                    });

                if (error) throw error;
                return { success: true, count: collegeData.length };
            } catch (error) {
                console.error('Error importing to database:', error);
            }
        }

        // Cache in localStorage as fallback
        const cached = JSON.parse(localStorage.getItem('universities_cache') || '[]');
        const merged = [...cached, ...collegeData];
        localStorage.setItem('universities_cache', JSON.stringify(merged));

        return { success: true, count: collegeData.length };
    },

    /**
     * Get cached universities or fetch from API
     */
    async getUniversities(filters = {}) {
        // Try database first
        if (db && db.supabase) {
            let query = db.supabase.from('colleges').select('*');

            if (filters.country) {
                query = query.eq('country', filters.country);
            }
            if (filters.search) {
                query = query.ilike('name', `%${filters.search}%`);
            }

            const { data, error } = await query.limit(50);
            if (!error && data?.length > 0) return data;
        }

        // Fallback to cache
        const cached = JSON.parse(localStorage.getItem('universities_cache') || '[]');
        if (cached.length > 0) return cached;

        // Fetch fresh data
        return await this.searchUniversities(filters.country, filters.search);
    },

    /**
     * Enrich college data with IELTS requirements
     */
    enrichWithIELTSRequirements(colleges) {
        // Common IELTS requirements by university tier
        const requirements = {
            'Ivy League': { min: 7.5, recommended: 8.0 },
            'Top 50': { min: 7.0, recommended: 7.5 },
            'Top 100': { min: 6.5, recommended: 7.0 },
            'Default': { min: 6.0, recommended: 6.5 }
        };

        return colleges.map(college => {
            // Simple tier detection (can be enhanced)
            let tier = 'Default';
            const name = college.name.toLowerCase();

            if (name.includes('harvard') || name.includes('stanford') ||
                name.includes('mit') || name.includes('yale')) {
                tier = 'Ivy League';
            } else if (name.includes('university')) {
                tier = 'Top 100';
            }

            return {
                ...college,
                ielts_requirement: requirements[tier].min,
                ielts_recommended: requirements[tier].recommended
            };
        });
    },

    /**
     * Auto-import popular universities on app load
     */
    async autoImportPopular() {
        const countries = ['United States', 'United Kingdom', 'Canada', 'Australia'];
        let totalImported = 0;

        for (const country of countries) {
            const result = await this.importUniversities(country);
            if (result.success) {
                totalImported += result.count;
            }
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return { success: true, total: totalImported };
    },

    /**
     * Get university details with real-time data
     */
    async getUniversityDetails(universityName) {
        // Try cache first
        const universities = await this.getUniversities({ search: universityName });
        if (universities.length > 0) {
            return this.enrichWithIELTSRequirements(universities)[0];
        }

        // Fetch fresh
        const fresh = await this.searchUniversities('', universityName);
        return fresh.length > 0 ? this.enrichWithIELTSRequirements(fresh)[0] : null;
    }
};

// Auto-import on module load (runs once)
if (typeof window !== 'undefined') {
    // Check if we need to import
    const lastImport = localStorage.getItem('last_college_import');
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    if (!lastImport || parseInt(lastImport) < oneDayAgo) {
        console.log('🎓 Importing college data...');
        collegeDataService.autoImportPopular().then(result => {
            console.log(`✅ Imported ${result.total} universities`);
            localStorage.setItem('last_college_import', Date.now().toString());
        });
    }
}
