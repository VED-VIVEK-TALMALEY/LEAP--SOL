-- ============================================
-- XLR8 DATABASE SCHEMA - Phase 234
-- ============================================
-- Run this in your Supabase SQL Editor

-- ============================================
-- PHASE 2: SOCIAL ECOSYSTEM
-- ============================================

-- Rivals Table
CREATE TABLE IF NOT EXISTS rivals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rival_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_interaction TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, rival_id)
);

CREATE INDEX idx_rivals_user_id ON rivals(user_id);
CREATE INDEX idx_rivals_rival_id ON rivals(rival_id);

-- Enable RLS
ALTER TABLE rivals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rivals
CREATE POLICY "Users can view their own rivals"
    ON rivals FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = rival_id);

CREATE POLICY "System can assign rivals"
    ON rivals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PHASE 3: CREATOR & ALUMNI
-- ============================================

-- Creators Table
CREATE TABLE IF NOT EXISTS creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    category TEXT[], -- ['ielts_tips', 'study_abroad', 'motivation']
    follower_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creators_verified ON creators(verified);
CREATE INDEX idx_creators_category ON creators USING GIN(category);

-- Creator Content Table
CREATE TABLE IF NOT EXISTS creator_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'video', 'article', 'tip'
    content_url TEXT,
    excerpt TEXT,
    thumbnail_url TEXT,
    tags TEXT[],
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creator_content_creator_id ON creator_content(creator_id);
CREATE INDEX idx_creator_content_tags ON creator_content USING GIN(tags);

-- Alumni Table
CREATE TABLE IF NOT EXISTS alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    university TEXT NOT NULL,
    course TEXT NOT NULL,
    country TEXT NOT NULL,
    graduation_year INTEGER,
    ielts_score DECIMAL(3,1),
    bio TEXT,
    linkedin_url TEXT,
    available_for_connect BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alumni_university ON alumni(university);
CREATE INDEX idx_alumni_country ON alumni(country);
CREATE INDEX idx_alumni_available ON alumni(available_for_connect);

-- Mentors Table
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    expertise TEXT[], -- ['ielts', 'applications', 'visa', 'scholarships']
    university TEXT,
    course TEXT,
    country TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mentors_expertise ON mentors USING GIN(expertise);
CREATE INDEX idx_mentors_available ON mentors(available);
CREATE INDEX idx_mentors_country ON mentors(country);

-- Mentor Connections Table
CREATE TABLE IF NOT EXISTS mentor_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'completed'
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mentor_connections_mentor_id ON mentor_connections(mentor_id);
CREATE INDEX idx_mentor_connections_user_id ON mentor_connections(user_id);
CREATE INDEX idx_mentor_connections_status ON mentor_connections(status);

-- Success Stories Table
CREATE TABLE IF NOT EXISTS success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_avatar_url TEXT,
    university TEXT NOT NULL,
    course TEXT NOT NULL,
    country TEXT NOT NULL,
    initial_ielts DECIMAL(3,1),
    final_ielts DECIMAL(3,1),
    story_content TEXT NOT NULL,
    key_takeaways TEXT[],
    timeline_months INTEGER,
    featured BOOLEAN DEFAULT FALSE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_success_stories_university ON success_stories(university);
CREATE INDEX idx_success_stories_featured ON success_stories(featured);
CREATE INDEX idx_success_stories_final_ielts ON success_stories(final_ielts);

-- ============================================
-- PHASE 4: INSTITUTION INTEGRATION
-- ============================================

-- Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    logo_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    website_url TEXT,
    description TEXT,
    follower_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_institutions_verified ON institutions(verified);
CREATE INDEX idx_institutions_country ON institutions(country);

-- Institution Content Table
CREATE TABLE IF NOT EXISTS institution_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'announcement', 'event', 'deadline', 'news'
    content TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_institution_content_institution_id ON institution_content(institution_id);
CREATE INDEX idx_institution_content_type ON institution_content(content_type);
CREATE INDEX idx_institution_content_event_date ON institution_content(event_date);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    university TEXT NOT NULL,
    course TEXT NOT NULL,
    country TEXT,
    deadline DATE,
    status TEXT NOT NULL DEFAULT 'interested', -- 'interested', 'preparing', 'submitted', 'result'
    progress INTEGER DEFAULT 0, -- 0-100
    notes TEXT,
    result TEXT, -- 'accepted', 'rejected', 'waitlisted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_deadline ON applications(deadline);

-- Application Documents Table
CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL, -- 'transcript', 'ielts', 'sop', 'lor', 'resume', 'other'
    completed BOOLEAN DEFAULT FALSE,
    file_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_application_documents_application_id ON application_documents(application_id);
CREATE INDEX idx_application_documents_completed ON application_documents(completed);

-- ============================================
-- RLS POLICIES FOR PHASE 3 & 4
-- ============================================

-- Creators
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view creators" ON creators FOR SELECT USING (true);

-- Creator Content
ALTER TABLE creator_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view creator content" ON creator_content FOR SELECT USING (true);

-- Alumni
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available alumni" ON alumni FOR SELECT USING (available_for_connect = true);

-- Mentors
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available mentors" ON mentors FOR SELECT USING (available = true);

-- Mentor Connections
ALTER TABLE mentor_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own connections" ON mentor_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create connections" ON mentor_connections FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Success Stories
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view success stories" ON success_stories FOR SELECT USING (true);

-- Institutions
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view institutions" ON institutions FOR SELECT USING (true);

-- Institution Content
ALTER TABLE institution_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view institution content" ON institution_content FOR SELECT USING (true);

-- Applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own applications" ON applications FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on application_documents
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own application documents
CREATE POLICY "Users can view own application documents"
    ON application_documents FOR SELECT
    USING (
        application_id IN (
            SELECT id FROM applications WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own application documents"
    ON application_documents FOR ALL
    USING (
        application_id IN (
            SELECT id FROM applications WHERE user_id = auth.uid()
        )
    );

-- ============================================
-- PHASE 5: ACADEMIC PROFILE TABLES
-- ============================================

-- IELTS History Table
CREATE TABLE ielts_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    listening_score DECIMAL(3,1) CHECK (listening_score >= 0 AND listening_score <= 9),
    reading_score DECIMAL(3,1) CHECK (reading_score >= 0 AND reading_score <= 9),
    writing_score DECIMAL(3,1) CHECK (writing_score >= 0 AND writing_score <= 9),
    speaking_score DECIMAL(3,1) CHECK (speaking_score >= 0 AND speaking_score <= 9),
    overall_score DECIMAL(3,1) CHECK (overall_score >= 0 AND overall_score <= 9),
    test_type VARCHAR(50) DEFAULT 'Academic', -- 'Academic' or 'General'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Academic Profiles Table
CREATE TABLE academic_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    education JSONB DEFAULT '[]'::jsonb, -- Array of education entries
    target_universities JSONB DEFAULT '[]'::jsonb, -- Array of target schools
    achievements JSONB DEFAULT '[]'::jsonb, -- Array of achievement IDs
    bio TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    current_education_level VARCHAR(100),
    field_of_study VARCHAR(200),
    target_degree VARCHAR(100),
    target_countries TEXT[], -- Array of country codes
    is_public BOOLEAN DEFAULT false,
    profile_slug VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Phase 5
CREATE INDEX idx_ielts_history_user_id ON ielts_history(user_id);
CREATE INDEX idx_ielts_history_test_date ON ielts_history(test_date DESC);
CREATE INDEX idx_academic_profiles_user_id ON academic_profiles(user_id);
CREATE INDEX idx_academic_profiles_slug ON academic_profiles(profile_slug);
CREATE INDEX idx_academic_profiles_public ON academic_profiles(is_public) WHERE is_public = true;

-- Enable RLS on Phase 5 tables
ALTER TABLE ielts_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ielts_history
CREATE POLICY "Users can view own IELTS history"
    ON ielts_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own IELTS scores"
    ON ielts_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own IELTS scores"
    ON ielts_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own IELTS scores"
    ON ielts_history FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for academic_profiles
CREATE POLICY "Users can view own academic profile"
    ON academic_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by everyone"
    ON academic_profiles FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can insert own academic profile"
    ON academic_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own academic profile"
    ON academic_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own academic profile"
    ON academic_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
