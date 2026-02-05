import { state } from './js/state-manager.js';
import { router } from './js/router.js';
import { momentumEngine } from './js/momentum-engine.js';
import { leagueSystem } from './js/league-system.js';
import { eventBus } from './js/event-bus.js';
import { authService } from './js/auth-service.js';
import { ParticleSystem, createConfetti, createRipple, showToast } from './js/animations.js';
import { createHomePage } from './components/home-page.js';
import { createDashboardPage } from './components/dashboard-page.js';
import { createLeaguePage } from './components/league-page.js';
import { createSwipeMock } from './components/swipe-mock.js';
import { createMomentumFeed } from './components/momentum-feed.js';
import { createLoginPage } from './components/login-page.js';
import { createRegisterPage } from './components/register-page.js';
import { createCollegeDashboard } from './components/college-dashboard.js';
import { createProfilePage } from './components/profile-page.js';
import { createRivalsPage } from './components/rivals-page.js';
import { createCreatorFeed } from './components/creator-feed.js';
import { createAlumniConnect } from './components/alumni-connect.js';
import { createApplicationTracker } from './components/application-tracker.js';
import { createAcademicProfile } from './components/academic-profile.js';
import { createCollegeSearch } from './components/college-search.js';

function createOnboarding() {
  const container = document.createElement('div');
  container.className = 'onboarding-container';
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: var(--space-xl);
    text-align: center;
  `;

  container.innerHTML = `
    <div style="max-width: 500px;">
      <div style="font-size: 5rem; margin-bottom: var(--space-xl);">🚀</div>
      <h1 style="margin-bottom: var(--space-md);">Welcome to XLR8</h1>
      <p class="text-secondary mb-xl">
        Your Study Abroad Operating System. Build daily IELTS habits, track progress, and connect with universities.
      </p>

      <div class="card mb-lg" style="text-align: left;">
        <label style="display: block; margin-bottom: var(--space-sm); font-weight: var(--font-weight-medium);">
          What's your name?
        </label>
        <input 
          type="text" 
          id="name-input" 
          placeholder="Enter your name"
          style="width: 100%; padding: var(--space-md); background: var(--color-bg-tertiary); border: 2px solid var(--color-bg-elevated); border-radius: var(--radius-md); color: var(--color-text-primary); font-size: var(--font-size-base); font-family: inherit;"
        />
      </div>

      <div class="card mb-lg" style="text-align: left;">
        <label style="display: block; margin-bottom: var(--space-sm); font-weight: var(--font-weight-medium);">
          Target IELTS Score
        </label>
        <select 
          id="target-score-input"
          style="width: 100%; padding: var(--space-md); background: var(--color-bg-tertiary); border: 2px solid var(--color-bg-elevated); border-radius: var(--radius-md); color: var(--color-text-primary); font-size: var(--font-size-base); font-family: inherit;"
        >
          <option value="6.5">6.5</option>
          <option value="7.0">7.0</option>
          <option value="7.5" selected>7.5</option>
          <option value="8.0">8.0</option>
          <option value="8.5">8.5</option>
          <option value="9.0">9.0</option>
        </select>
      </div>

      <div class="card mb-xl" style="text-align: left;">
        <label style="display: block; margin-bottom: var(--space-sm); font-weight: var(--font-weight-medium);">
          Daily Commitment
        </label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm);">
          <button class="commitment-btn" data-minutes="5">5 min</button>
          <button class="commitment-btn active" data-minutes="15">15 min</button>
          <button class="commitment-btn" data-minutes="30">30 min</button>
        </div>
      </div>

      <button class="btn btn-primary btn-lg" id="start-btn" style="width: 100%;">
        Start Your Journey
      </button>
    </div>
  `;

  // Add commitment button styles
  const style = document.createElement('style');
  style.textContent = `
    .commitment-btn {
      padding: var(--space-md);
      background: var(--color-bg-tertiary);
      border: 2px solid var(--color-bg-elevated);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      font-family: inherit;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .commitment-btn:hover {
      background: var(--color-bg-elevated);
    }
    .commitment-btn.active {
      background: var(--color-accent-primary);
      border-color: var(--color-accent-primary);
      color: white;
    }
  `;
  document.head.appendChild(style);

  // Event listeners
  setTimeout(() => {
    let selectedCommitment = 15;

    container.querySelectorAll('.commitment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.commitment-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        selectedCommitment = parseInt(e.currentTarget.dataset.minutes);
      });
    });

    container.querySelector('#start-btn').addEventListener('click', () => {
      const name = container.querySelector('#name-input').value.trim();
      const targetScore = parseFloat(container.querySelector('#target-score-input').value);

      if (!name) {
        alert('Please enter your name');
        return;
      }

      // Save user data
      state.update('user', {
        id: 'user_' + Date.now(),
        name,
        targetScore,
        dailyCommitment: selectedCommitment,
        onboardingComplete: true,
        joinedDate: new Date().toISOString()
      });

      // Initialize momentum
      state.update('momentum', {
        score: 0,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        totalDaysActive: 0,
        activityHistory: []
      });

      // Initialize league
      state.update('leagues', {
        currentLeague: 'bronze',
        leaguePoints: 0,
        peakLeague: 'bronze'
      });

      // Navigate to home
      router.navigate('/');
    });
  }, 0);

  function createPracticePage() {
    const container = document.createElement('div');
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px;';

    container.innerHTML = `
    <h2 class="mb-lg">Practice Sessions</h2>
    
    <div class="card mb-md card-interactive" id="swipe-2min">
      <h4>⚡ Quick Burst</h4>
      <p class="text-secondary">2 minutes • 10 questions</p>
    </div>

    <div class="card mb-md card-interactive" id="swipe-5min">
      <h4>🎯 Daily Practice</h4>
      <p class="text-secondary">5 minutes • 25 questions</p>
    </div>

    <div class="card mb-md card-interactive" id="swipe-10min">
      <h4>🚀 Deep Dive</h4>
      <p class="text-secondary">10 minutes • 50 questions</p>
    </div>

    <nav class="nav">
      <div class="nav-items">
        <div class="nav-item" data-route="/">
          <div class="nav-icon">🏠</div>
          <div class="nav-label">Home</div>
        </div>
        <div class="nav-item active" data-route="/practice">
          <div class="nav-icon">📝</div>
          <div class="nav-label">Practice</div>
        </div>
        <div class="nav-item" data-route="/league">
          <div class="nav-icon">🏆</div>
          <div class="nav-label">League</div>
        </div>
        <div class="nav-item" data-route="/colleges">
          <div class="nav-icon">🎓</div>
          <div class="nav-label">Colleges</div>
        </div>
        <div class="nav-item" data-route="/profile">
          <div class="nav-icon">👤</div>
          <div class="nav-label">Profile</div>
        </div>
      </div>
    </nav>
  `;

    setTimeout(() => {
      container.querySelector('#swipe-2min')?.addEventListener('click', () => router.navigate('/swipe-mock/2min'));
      container.querySelector('#swipe-5min')?.addEventListener('click', () => router.navigate('/swipe-mock/5min'));
      container.querySelector('#swipe-10min')?.addEventListener('click', () => router.navigate('/swipe-mock/10min'));

      container.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const route = e.currentTarget.dataset.route;
          router.navigate(route);
        });
      });
    }, 0);

    return container;
  }


  // ============================================
  // PROFILE PAGE - Now imported from components/profile-page.js
  // ============================================


  // ============================================
  // ROUTE REGISTRATION
  // ============================================

  function registerRoutes() {
    router.setBeforeNavigate((path) => {
      const publicRoutes = ['/login', '/register'];
      if (publicRoutes.includes(path)) {
        return true;
      }

      if (!authService.isOffline() && !authService.isAuthenticated()) {
        router.navigate('/login', false);
        return false;
      }

      const onboardingComplete = state.get('user.onboardingComplete');
      if (!onboardingComplete && path !== '/onboarding') {
        router.navigate('/onboarding', false);
        return false;
      }

      return true;
    });

    router.register('/login', createLoginPage);
    router.register('/register', createRegisterPage);
    router.register('/', createHomePage);
    router.register('/onboarding', createOnboarding);
    router.register('/practice', createPracticePage);
    router.register('/feed', createMomentumFeed);
    router.register('/league', createLeaguePage);
    router.register('/colleges', createCollegeDashboard);
    router.register('/profile', createProfilePage);
    router.register('/rivals', createRivalsPage);
    router.register('/creators', createCreatorFeed);
    router.register('/alumni', createAlumniConnect);
    router.register('/tracker', createApplicationTracker);
    router.register('/academic-profile', createAcademicProfile);
    router.register('/college-search', createCollegeSearch);

    router.register('/swipe-mock/2min', () => createSwipeMock('2min'));
    router.register('/swipe-mock/5min', () => createSwipeMock('5min'));
    router.register('/swipe-mock/10min', () => createSwipeMock('10min'));
  }

  let appInitialized = false;

  function initializeApp() {
    // Prevent multiple initializations
    if (appInitialized) {
      console.warn('App already initialized, skipping...');
      return;
    }
    appInitialized = true;

    console.log('🚀 XLR8 - Study Abroad Operating System');

    // Initialize particle system
    new ParticleSystem(document.body);

    // Register routes
    registerRoutes();

    // Initialize engines
    momentumEngine.initializeEngine();

    // Set up event listeners
    eventBus.on('momentum:updated', (data) => {
      console.log('Momentum updated:', data);
      showToast(`Momentum updated: ${data.score}`, 'success');
    });

    eventBus.on('league:changed', (data) => {
      console.log('League changed:', data);
      if (data.promoted) {
        createConfetti(document.body);
        showToast(`Promoted to ${data.newLeague.toUpperCase()} League! 🎉`, 'success');
      }
    });

    eventBus.on('session:completed', (data) => {
      createConfetti(document.body);
    });

    // Add ripple effect to all buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn, .card-interactive, .quick-action-btn')) {
        const element = e.target.closest('.btn, .card-interactive, .quick-action-btn');
        createRipple(e, element);
      }
    });

    let initialRoute = '/';

    if (authService.isOffline()) {
      const onboardingComplete = state.get('user.onboardingComplete');
      initialRoute = onboardingComplete ? '/' : '/onboarding';
    } else if (!authService.isAuthenticated()) {
      initialRoute = '/login';
    } else {
      const onboardingComplete = state.get('user.onboardingComplete');
      initialRoute = onboardingComplete ? '/' : '/onboarding';
    }

    router.navigate(initialRoute);
  }

  // Start the app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
