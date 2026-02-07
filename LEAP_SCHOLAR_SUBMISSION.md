# IELTS Prep Engagement Solution
## Product Case Study Submission

**Submitted by:** [Your Name]  
**Date:** February 2026  
**For:** Leap Scholar - Product Management Internship

---

## 1. Problem Understanding

### User Demographics

**Target Users:** Students aged 18-26 planning to study abroad (UG/PG) and early professionals

**Key Characteristics:**
- High aspiration but low initial clarity about IELTS preparation
- Busy schedules with limited dedicated learning time
- Balancing preparation alongside college/work commitments
- Tech-savvy, mobile-first generation

### Behavioral Traits

**Delayed Preparation Cycle**
- Students typically start serious preparation only 2-3 weeks before the exam
- Procrastination driven by lack of immediate urgency
- Difficulty maintaining long-term commitment (4+ weeks)

**Fluctuating Motivation**
- Initial enthusiasm fades quickly without visible progress
- No short-term wins to sustain momentum
- Overwhelming feeling when looking at 4-week preparation timeline

**Time Constraints**
- College students: Classes, assignments, projects, social life
- Working professionals: 9-5 jobs, commute time, personal commitments
- Average available time: 15-30 minutes per day (fragmented)

### Core Pain Points

1. **No Visible Progress**
   - Traditional prep feels like an endless grind
   - Can't see improvement day-to-day
   - Demotivating when target score feels far away

2. **Inconsistent Practice**
   - Miss 2-3 days → guilt → complete abandonment
   - No recovery mechanism from breaks
   - All-or-nothing mentality

3. **Lack of Habit Formation**
   - IELTS prep doesn't become a daily routine
   - Requires constant willpower and decision-making
   - No triggers or cues to practice

4. **Overwhelming Commitment**
   - 1-2 hour study sessions feel daunting
   - Hard to find large blocks of time
   - Leads to postponement

### Current Engagement Patterns

**What Works:**
- Video content consumption (passive, easy)
- Mock tests (but only near exam date)
- Speaking evaluations (immediate feedback)

**What Doesn't Work:**
- Long-form study sessions
- Self-paced courses without structure
- Generic "study daily" advice

---

## 2. Proposed Solution

### Solution Name: **Streak Milestones**

**One-Line Pitch:**  
A habit-building system that breaks IELTS prep into 5-minute daily sessions with weekly milestone badges that provide visible short-term wins.

### Core Concept

Transform IELTS preparation from a daunting 4-week marathon into a series of achievable daily micro-commitments with clear progress markers every 7 days.

### How It Works

**Daily 5-Minute Sessions**
- Bite-sized practice sessions that fit any schedule
- Swipe-based question interface (TikTok-style)
- 20-25 questions per session
- Instant feedback on each answer

**Streak System**
- Track consecutive days of practice
- Visual streak counter prominently displayed
- Streak freeze: 1 free skip per week (removes guilt)
- Longest streak badge for personal best

**Weekly Milestones**
- Week 1: "First Steps" badge
- Week 2: "Building Momentum" badge
- Week 3: "Halfway Hero" badge
- Week 4: "Almost There" badge
- Exam Ready: "IELTS Champion" badge

**Progress Visualization**
- Progress bar showing days until next milestone
- Daily activity calendar (GitHub-style contribution graph)
- Momentum score that grows with consistent practice

### Why This Solves the Problem

**1. Micro-Commitments Reduce Friction**
- 5 minutes is achievable even on busiest days
- Removes "I don't have time" excuse
- Easy to start → builds habit loop

**2. Streaks Create Consistency**
- Don't want to "break the chain"
- Psychological commitment device
- Streak freeze removes all-or-nothing pressure

**3. Weekly Milestones Provide Short-Term Wins**
- 7 days feels achievable (vs 28 days)
- Regular dopamine hits from badge unlocks
- Visible progress combats motivation dips

**4. Visual Progress Fights Demotivation**
- See improvement day-by-day
- Momentum score quantifies effort
- Activity calendar shows consistency

### Key Differentiators

**vs Traditional Courses:**
- Micro-sessions vs hour-long classes
- Daily habit vs sporadic studying

**vs Mock Tests:**
- Continuous engagement vs last-minute cramming
- Habit formation vs one-time assessment

**vs Generic Apps:**
- IELTS-specific content
- Milestone-based motivation system
- Streak freeze innovation

### Technical Implementation

**Frontend:**
- Simple HTML/CSS/JavaScript
- Mobile-responsive design
- Swipe gesture support

**Backend:**
- MySQL database
- User authentication
- Session tracking
- Streak calculation logic

**Data Stored:**
- User profile (name, target score, commitment)
- Daily practice sessions
- Streak data (current, longest, freeze status)
- Milestone achievements
- Momentum score

---

## 3. User Experience Flow

### First-Time User Journey

**Step 1: Onboarding (2 minutes)**

User lands on app → Simple welcome screen

*"Build your IELTS score, 5 minutes at a time"*

**Inputs:**
- Name
- Target IELTS score (6.5 - 9.0)
- Daily commitment (5/15/30 minutes)

**Output:** Personalized dashboard

---

**Step 2: First Practice Session (5 minutes)**

Dashboard shows:
- "Start Your First Session" prominent button
- Streak counter: 0 days
- Next milestone: Week 1 badge (7 days away)

User clicks → Swipe practice begins

**Session Flow:**
1. Question appears with 4 options
2. User swipes right (correct) or left (incorrect)
3. Instant feedback: ✓ or ✗ with explanation
4. Next question loads immediately
5. After 5 minutes: Session complete!

**Post-Session:**
- Confetti animation
- "Day 1 streak started! 🔥"
- Momentum score: +10 points
- Progress bar: 1/7 days to Week 1 badge

---

**Step 3: Building the Habit (Days 2-6)**

**Daily Notification:**
- "Keep your streak alive! 🔥"
- Sent at user's preferred time

**User Opens App:**
- Streak counter: X days
- Progress to next milestone visible
- Quick "Start Practice" button

**Completes Session:**
- Streak increases
- Momentum score grows
- Progress bar fills

**If User Misses a Day:**
- Notification: "Use your streak freeze?"
- One-tap recovery
- Streak preserved, freeze used

---

**Step 4: First Milestone (Day 7)**

User completes Day 7 session:

**Celebration:**
- Big animation
- "Week 1 Complete! 🎉"
- "First Steps" badge unlocked
- Badge displayed on profile

**Next Goal Shown:**
- "7 more days to Week 2 badge"
- Progress bar resets
- Momentum continues

---

**Step 5: Long-Term Engagement (Weeks 2-4)**

**Weekly Cycle Repeats:**
- Daily 5-minute sessions
- Streak grows
- Milestones every 7 days

**Additional Engagement:**
- View activity calendar
- Check momentum score
- See all earned badges
- Track questions answered

**Exam Preparation:**
- After 4 weeks: "IELTS Champion" badge
- Suggested: Take full mock test
- Confidence boost from consistent practice

---

### Re-Engagement Scenarios

**Scenario 1: User Misses 1 Day**
- Notification: "Your streak is at risk!"
- Option to use streak freeze
- Easy one-tap recovery

**Scenario 2: User Misses 2+ Days**
- Streak breaks (no freeze available)
- Notification: "Start a new streak today"
- Emphasis on longest streak achievement
- Fresh start, no guilt

**Scenario 3: User Completes Milestone**
- Share badge on social media
- "Challenge a friend" feature
- Motivation boost to continue

---

### Key Interaction Points

**Dashboard (Home Screen)**
- Current streak count (large, prominent)
- Progress bar to next milestone
- "Start Practice" button
- Recent activity feed

**Practice Session**
- Swipe interface
- Instant feedback
- Timer (optional, non-intrusive)
- Question counter

**Profile**
- All earned badges
- Longest streak
- Total questions answered
- Momentum score
- Activity calendar

**Notifications**
- Daily practice reminder
- Streak risk warning
- Milestone achievement
- Encouragement messages

---

## 4. Success Metrics

### Primary Metrics

**1. DAU/MAU Ratio (Daily Active Users / Monthly Active Users)**

**Target:** 60%+ within 4 weeks

**Why This Matters:**
- Measures daily habit formation
- High ratio = users practicing daily
- Industry benchmark: 20-30% (we aim for 2x)

**How to Measure:**
- Track daily logins
- Track monthly unique users
- Calculate ratio: (DAU / MAU) × 100

**Success Indicators:**
- Week 1: 40% DAU/MAU
- Week 2: 50% DAU/MAU
- Week 3: 55% DAU/MAU
- Week 4: 60%+ DAU/MAU

---

**2. 7-Day Retention Rate**

**Target:** 70%+ users reach Week 1 milestone

**Why This Matters:**
- First milestone is critical
- Proves short-term win hypothesis
- Predicts long-term engagement

**How to Measure:**
- Track users who complete Day 7
- Calculate: (Users at Day 7 / Total signups) × 100

**Success Indicators:**
- 70%+ reach Week 1 badge
- 50%+ reach Week 2 badge
- 35%+ reach Week 3 badge
- 25%+ complete all 4 weeks

---

**3. Average Sessions Per Week**

**Target:** 5+ sessions per user per week

**Why This Matters:**
- Measures actual engagement depth
- 5/7 days = strong habit formation
- Accounts for streak freeze usage

**How to Measure:**
- Count practice sessions per user
- Calculate weekly average
- Segment by user cohort

**Success Indicators:**
- Week 1: 4 sessions/week average
- Week 2: 5 sessions/week average
- Week 3-4: 5.5+ sessions/week average

---

### Secondary Metrics

**Streak Freeze Usage Rate**
- % of users who use streak freeze
- Indicates feature value
- Target: 40-50% usage

**Milestone Completion Rate**
- % of users who unlock each badge
- Funnel analysis: Week 1 → Week 2 → Week 3 → Week 4
- Identifies drop-off points

**Average Session Duration**
- Should stay around 5 minutes
- Too long = friction
- Too short = not engaging

**Questions Answered Per Session**
- Target: 20-25 questions
- Measures engagement quality

---

### Measurement Timeline

**Week 1:** Baseline establishment
- Track initial signups
- Monitor first session completion
- Measure Day 1-7 retention

**Week 2-3:** Optimization
- A/B test notification timing
- Test milestone reward variations
- Refine streak freeze messaging

**Week 4:** Evaluation
- Calculate final DAU/MAU
- Analyze 7-day retention
- Review sessions per week
- Prepare iteration plan

---

### Success Criteria

**Minimum Viable Success:**
- 50% DAU/MAU ratio
- 60% reach Week 1 milestone
- 4+ sessions per week average

**Strong Success:**
- 60% DAU/MAU ratio
- 70% reach Week 1 milestone
- 5+ sessions per week average

**Exceptional Success:**
- 70%+ DAU/MAU ratio
- 80%+ reach Week 1 milestone
- 6+ sessions per week average

---

## Conclusion

The Streak Milestones solution addresses the core problem of inconsistent IELTS preparation by:

1. **Reducing friction** through 5-minute micro-sessions
2. **Building habits** with daily streak tracking
3. **Providing short-term wins** via weekly milestone badges
4. **Visualizing progress** to combat motivation dips

This approach transforms IELTS prep from an overwhelming 4-week commitment into a series of achievable daily actions with clear, frequent rewards.

**Next Steps:**
- Build MVP with core features
- Test with 100 beta users
- Measure against success metrics
- Iterate based on data

---

**Thank you for reviewing this submission.**
