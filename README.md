# IELTS Prep - Simplified Engagement Solution

A focused IELTS preparation platform built around daily habit formation through micro-learning sessions and streak-based milestones.

## Core Features

### Streak-Based Learning
- Daily 5-minute practice sessions
- Consecutive day streak tracking
- Weekly milestone badges
- Streak freeze protection

### Practice System
- Swipe-based question interface
- Instant feedback on answers
- Multiple session lengths (2min, 5min, 10min)
- Progress tracking

### Gamification
- Momentum score system
- League progression (Bronze → Silver → Gold → Diamond)
- Achievement badges
- Visual progress indicators

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Build Tool:** Vite
- **Database:** MySQL
- **State Management:** Custom state manager with localStorage
- **Routing:** Custom SPA router

## Database Schema

The app uses MySQL with the following tables:
- `users` - User profiles and settings
- `streaks` - Streak tracking and freeze status
- `practice_sessions` - Session history and performance
- `momentum` - Momentum score tracking
- `leagues` - League progression data
- `milestones` - Achievement tracking

See `database-schema.sql` for complete schema.

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd LEAP--SOL
```

2. Install dependencies
```bash
npm install
```

3. Set up MySQL database
```bash
mysql -u root -p < database-schema.sql
```

4. Run development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Project Structure

```
LEAP--SOL/
├── components/          # UI components
│   ├── dashboard-page.js
│   ├── home-page.js
│   ├── league-page.js
│   ├── login-page.js
│   ├── momentum-feed.js
│   ├── profile-page.js
│   ├── register-page.js
│   └── swipe-mock.js
├── js/                  # Core JavaScript
│   ├── animations.js
│   ├── auth-service.js
│   ├── event-bus.js
│   ├── league-system.js
│   ├── momentum-engine.js
│   ├── router.js
│   ├── state-manager.js
│   └── utils.js
├── data/                # Mock data
│   └── question-bank.js
├── styles/              # CSS files
│   └── styles.css
├── app.js               # Main application
├── index.html           # Entry point
└── database-schema.sql  # MySQL schema

```

## Features

### User Onboarding
- Name and target score input
- Daily commitment selection
- Personalized dashboard setup

### Practice Sessions
- 2-minute quick burst (10 questions)
- 5-minute daily practice (25 questions)
- 10-minute deep dive (50 questions)

### Progress Tracking
- Current streak counter
- Longest streak record
- Weekly milestone badges
- Momentum score
- League ranking

### Engagement Mechanics
- Daily practice reminders
- Streak freeze (1 per week)
- Milestone celebrations
- League promotions

## Success Metrics

1. **DAU/MAU Ratio** - Target: 60%+
2. **7-Day Retention** - Target: 70%+ reach Week 1 milestone
3. **Sessions Per Week** - Target: 5+ sessions per user

## License

MIT License

## Submission

This project is submitted as part of the Leap Scholar Product Management Internship application.

**Submission Document:** `LEAP_SCHOLAR_SUBMISSION.md`