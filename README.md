# 🎮 LEAP - Level Up Your IELTS Game

**Where IELTS Prep Meets Gaming. Swipe, Compete, Achieve Your Study Abroad Dreams.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/VED-VIVEK-TALMALEY/LEAP--SOL)

---

## 🚀 What is LEAP?

**LEAP** (Learn, Engage, Achieve, Progress) is a revolutionary gamified IELTS preparation and study abroad platform designed specifically for Gen-Z (18-25 year olds). We transform boring IELTS prep into an addictive, social, and rewarding experience by combining:

- 🎯 **TikTok-style swipe learning** - 5-minute micro-sessions
- 🏆 **Duolingo-style gamification** - Leagues, streaks, momentum
- 📱 **Social competition** - Rivals, leaderboards, achievements
- 🎓 **Study abroad ecosystem** - College database, application tracker, alumni connect

**Stop studying. Start playing. Achieve your dreams.**

---

## ✨ Key Features

### 🎮 Gamified Learning

- **Swipe Mock Tests** - TikTok-style interface for IELTS questions
- **5-Minute Sessions** - Perfect for commutes, breaks, downtime
- **Instant Feedback** - Immediate right/wrong with confetti animations
- **Momentum Score** - Real-time gamified metric that decays if you don't practice

### 🏆 Social Competition

- **League System** - Bronze → Silver → Gold → Platinum → Diamond
- **Weekly Competitions** - Compete with real peers
- **Leaderboards** - See where you rank
- **Streak System** - Daily practice streaks with recovery mode
- **Rivals** (Coming Soon) - Auto-assigned rivals for silent social pressure

### 📊 Progress Tracking

- **Dashboard** - Personalized welcome with quick stats
- **Recent Activity Feed** - Track your learning journey
- **Upcoming Deadlines** - Never miss college application dates
- **Achievement Badges** - Collect and showcase your progress

### 🎓 Study Abroad Ecosystem

- **College Database** - Browse universities with IELTS requirements
- **Application Tracker** - Kanban-style pipeline management
- **Alumni Connect** (Coming Soon) - Learn from successful students
- **Creator Feed** (Coming Soon) - IELTS mentors and tips

### 🎨 Retro Gaming Aesthetic

- **Mario-themed colors** - Nostalgic pixel art design
- **8-bit animations** - Confetti, transitions, effects
- **Hard shadows** - Authentic retro gaming feel
- **Rye & Press Start 2P fonts** - Classic gaming typography

---

## 🛠️ Tech Stack

### Frontend
- **Vite** - Lightning-fast build tool
- **Vanilla JavaScript** - No framework overhead
- **CSS3** - Custom design system with CSS variables
- **Progressive Web App (PWA)** - Mobile-first, installable

### Backend & Services
- **Supabase** - Authentication, database, storage
- **Supabase Storage** - Profile photo uploads
- **Row Level Security (RLS)** - Secure data access

### State Management
- **Custom State Manager** - Reactive state with localStorage persistence
- **Event Bus** - Decoupled component communication

### Routing
- **Custom Router** - SPA routing with dynamic parameters
- **Auth Guards** - Protected routes

---

## 📦 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase account** (for authentication and storage)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/VED-VIVEK-TALMALEY/LEAP--SOL.git
   cd LEAP--SOL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Settings → API
   - Copy **Project URL** and **anon public key**

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🎯 Usage Guide

### Getting Started

1. **Sign Up / Login**
   - Create an account or use offline mode
   - Complete onboarding (name, target score, daily commitment)

2. **Dashboard**
   - View your stats at a glance
   - Quick action buttons for fast navigation
   - Check recent activity and upcoming deadlines

3. **Practice**
   - Choose 5-minute swipe sessions
   - Swipe right for correct, left for incorrect
   - Watch your momentum score grow
   - Maintain daily streaks

4. **Compete**
   - Check your league rank
   - View leaderboards
   - Compete for promotion to higher leagues

5. **Profile**
   - Upload profile photo
   - Customize your profile
   - Track your achievements

### Keyboard Shortcuts

- `→` - Swipe right (correct answer)
- `←` - Swipe left (incorrect answer)
- `Esc` - Close modals
- `Space` - Quick practice

---

## 📱 Features Breakdown

### Phase 1: Foundation ✅ (Complete)

- [x] Dashboard with quick stats
- [x] Photo upload with Supabase Storage
- [x] Swipe-based mock tests
- [x] Momentum score system
- [x] League system
- [x] Profile management
- [x] Streak tracking
- [x] Retro pixel art UI

### Phase 1.5: Enhanced Features ✅ (Complete)

- [x] **Notification System** - Browser notifications for streaks, achievements, rivals
- [x] **Achievement Badges** - 18 achievements across 5 categories (practice, streak, league, mastery, special)
- [x] **Daily Challenges** - 5 daily challenges with momentum & coin rewards
- [x] **Pomodoro Timer** - 25/5 minute work/break cycles with momentum rewards
- [x] **Neumorphic Accents** - Subtle modern depth on cards while maintaining retro theme
- [x] **Sound Effects** - 8-bit retro sounds (correct, incorrect, level up, achievement, etc.)

### Phase 2: Social Ecosystem (In Progress)

- [ ] Rivals system (silent social pressure)
- [ ] Insight engine (IELTS → colleges mapping)
- [ ] Future-self motivation
- [ ] Enhanced momentum feed
- [ ] Top performer hub

### Phase 3: Creator & Alumni

- [ ] Creator feed with verification
- [ ] Alumni connect platform
- [ ] Success story database
- [ ] Mentor matching

### Phase 4: Institution Integration

- [ ] Institution feed
- [ ] Real-time college database
- [ ] Application tracker (Kanban)
- [ ] Deadline automation

### Phase 5: Academic Profile

- [ ] LinkedIn-style profiles
- [ ] IELTS progress timeline
- [ ] Achievement showcase
- [ ] Shareable profile links

---

## 🏗️ Project Structure

```
LEAP--SOL/
├── components/           # UI components
│   ├── auth-styles.css
│   ├── college-dashboard.css
│   ├── college-dashboard.js
│   ├── components.css
│   ├── dashboard-page.js
│   ├── dashboard-styles.css
│   ├── feed-styles.css
│   ├── home-page.js
│   ├── league-page.js
│   ├── login-page.js
│   ├── momentum-feed.js
│   ├── photo-upload.js
│   ├── photo-upload-styles.css
│   ├── profile-page.js
│   ├── profile-styles.css
│   ├── register-page.js
│   └── swipe-mock.js
├── data/                 # Mock data
│   ├── college-database.js
│   └── question-bank.js
├── js/                   # Core JavaScript
│   ├── animations.js
│   ├── auth-service.js
│   ├── event-bus.js
│   ├── league-system.js
│   ├── momentum-engine.js
│   ├── photo-service.js
│   ├── router.js
│   ├── state-manager.js
│   ├── supabase-client.js
│   └── utils.js
├── styles/               # Global styles
│   ├── styles.css
│   └── typography.css
├── app.js                # Main application entry
├── index.html            # HTML entry point
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

---

## 🔒 Security

### Supabase Setup

1. **Storage Bucket**
   - Bucket name: `profile-photos`
   - Public access enabled
   - 5MB file size limit

2. **Row Level Security (RLS)**
   
   Run these SQL commands in Supabase SQL Editor:

   ```sql
   -- Enable RLS on storage
   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

   -- Public viewing
   CREATE POLICY "Public photos viewable"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'profile-photos');

   -- Authenticated upload
   CREATE POLICY "Users can upload own photos"
     ON storage.objects FOR INSERT
     WITH CHECK (
       bucket_id = 'profile-photos' AND
       auth.role() = 'authenticated'
     );
   ```

3. **Environment Variables**
   - Never commit `.env` to git
   - Use `.env.example` as template
   - Anon key is safe for client-side use
   - Never expose service role key

See [supabase-security-setup.md](./supabase-security-setup.md) for detailed instructions.

---

## 🎨 Design System

### Color Palette

- **Sky Blue** (#5c94fc) - Primary background
- **Mario Red** (#ff0000) - Primary accent
- **Luigi Green** (#00aa00) - Secondary accent
- **Coin Gold** (#ffd700) - Text highlights
- **Dark Navy** (#0038a8) - Secondary background

### Typography

- **Headers**: Rye (retro western style)
- **Body**: Press Start 2P (8-bit gaming)
- **Numbers**: Press Start 2P

### Spacing Scale

- XS: 0.25rem (4px)
- SM: 0.5rem (8px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Add environment variables**
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Push to main branch
   - Automatic deployment on every commit

### Netlify

1. **Build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment variables**
   - Add in Netlify dashboard
   - Site settings → Environment variables

---

## 📊 Performance

- **Build size**: 70.05 kB (gzipped)
- **First load**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse score**: 95+

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m '✨ Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Commit Convention

- `✨ feat:` New feature
- `🐛 fix:` Bug fix
- `📝 docs:` Documentation
- `💄 style:` Styling changes
- `♻️ refactor:` Code refactoring
- `⚡ perf:` Performance improvements
- `✅ test:` Tests
- `🔧 chore:` Maintenance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**LEAP Team**
- Built with ❤️ for Gen-Z learners
- Designed for 18-25 year olds planning to study abroad

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/VED-VIVEK-TALMALEY/LEAP--SOL/issues)
- **Discussions**: [GitHub Discussions](https://github.com/VED-VIVEK-TALMALEY/LEAP--SOL/discussions)
- **Email**: support@leap-app.com

---

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **Vite** - Build tool
- **Google Fonts** - Rye & Press Start 2P fonts
- **Mario** - Design inspiration 🍄

---

## 🎮 Fun Facts

- 🍄 Over 1,000 IELTS questions in the database
- ⭐ 5 league tiers to climb
- 🔥 Streak system inspired by Duolingo
- 📱 Swipe interface inspired by TikTok
- 🎨 Retro design inspired by Super Mario Bros

---

## 🗺️ Roadmap

### Q1 2026
- [x] Phase 1: Dashboard & Photo Upload
- [ ] Phase 2: Rivals & Insight Engine

### Q2 2026
- [ ] Phase 3: Creator & Alumni Ecosystem
- [ ] Phase 4: Institution Integration

### Q3 2026
- [ ] Phase 5: Academic Profiles
- [ ] Mobile app (React Native)

### Q4 2026
- [ ] Premium tier launch
- [ ] Creator partnerships
- [ ] 100,000 users milestone

---

## 💡 Why LEAP?

**Traditional IELTS prep is boring. LEAP makes it fun.**

- ✅ **5-minute sessions** instead of 2-hour study blocks
- ✅ **Instant feedback** instead of waiting for results
- ✅ **Social competition** instead of isolated learning
- ✅ **Gamified progress** instead of fear-based motivation
- ✅ **Mobile-first** instead of desktop-heavy
- ✅ **Retro gaming aesthetic** instead of corporate boring

**LEAP: Where Learning Meets Gaming, and Dreams Meet Reality** 🎮🎓✨

---

<div align="center">

**[⭐ Star this repo](https://github.com/VED-VIVEK-TALMALEY/LEAP--SOL)** if you find it helpful!

Made with 🍄 and ❤️ by the LEAP Team

</div>