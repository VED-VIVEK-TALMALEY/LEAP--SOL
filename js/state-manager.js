// ============================================
// STATE MANAGER - Centralized Reactive State
// ============================================

class StateManager {
  constructor() {
    this.state = this.getInitialState();
    this.listeners = new Map();
    this.loadFromStorage();
  }

  getInitialState() {
    return {
      user: {
        id: null,
        name: '',
        targetScore: 7.5,
        currentScores: { reading: 0, writing: 0, listening: 0, speaking: 0 },
        onboardingComplete: false,
        joinedDate: null,
        dailyCommitment: 15 // minutes
      },
      momentum: {
        score: 0,
        streak: 0,
        streakPaused: false,
        pausedAt: null,
        longestStreak: 0,
        lastActivityDate: null,
        comebackScore: 0,
        totalDaysActive: 0,
        activityHistory: [] // { date, actions, effort }
      },
      swipeMock: {
        mastered: [],
        needsWork: [],
        sessionHistory: [],
        lastSessionDate: null,
        totalSwipes: 0,
        accuracy: 0
      },
      leagues: {
        currentLeague: 'bronze',
        leaguePoints: 0,
        rank: null,
        peakLeague: 'bronze',
        weeklyStats: {
          accuracy: 0,
          consistency: 0,
          improvement: 0
        }
      },
      feed: {
        reelsViewedToday: 0,
        lastReelDate: null,
        completedReels: []
      },
      social: {
        rivalId: null,
        followedCreators: [],
        followedAlumni: [],
        interactions: []
      },
      colleges: {
        tracked: [],
        applicationStatus: {} // collegeId: status
      },
      profile: {
        visibility: 'public',
        bio: '',
        achievements: []
      },
      settings: {
        notifications: true,
        theme: 'dark'
      }
    };
  }

  // Subscribe to state changes
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Notify listeners of state changes
  notify(key) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => callback(this.get(key)));
    }
    // Also notify wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => callback(this.state));
    }
  }

  // Get state value
  get(path) {
    if (!path) return this.state;
    
    const keys = path.split('.');
    let value = this.state;
    
    for (const key of keys) {
      if (value === undefined || value === null) return undefined;
      value = value[key];
    }
    
    return value;
  }

  // Set state value
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = this.state;
    
    for (const key of keys) {
      if (!(key in target)) {
        target[key] = {};
      }
      target = target[key];
    }
    
    target[lastKey] = value;
    this.notify(path);
    this.saveToStorage();
  }

  // Update state value (merge objects)
  update(path, updates) {
    const current = this.get(path);
    if (typeof current === 'object' && !Array.isArray(current)) {
      this.set(path, { ...current, ...updates });
    } else {
      this.set(path, updates);
    }
  }

  // Save to localStorage
  saveToStorage() {
    try {
      const serialized = JSON.stringify({
        version: 1,
        timestamp: Date.now(),
        state: this.state
      });
      localStorage.setItem('leap_state', serialized);
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const serialized = localStorage.getItem('leap_state');
      if (serialized) {
        const { version, state } = JSON.parse(serialized);
        
        // Handle version migrations if needed
        if (version === 1) {
          this.state = this.mergeState(this.state, state);
        }
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  }

  // Merge saved state with initial state (handles new fields)
  mergeState(initial, saved) {
    const merged = { ...initial };
    
    for (const key in saved) {
      if (typeof saved[key] === 'object' && !Array.isArray(saved[key]) && saved[key] !== null) {
        merged[key] = this.mergeState(initial[key] || {}, saved[key]);
      } else {
        merged[key] = saved[key];
      }
    }
    
    return merged;
  }

  // Clear all state (for testing/reset)
  reset() {
    this.state = this.getInitialState();
    this.saveToStorage();
    this.notify('*');
  }
}

// Create singleton instance
export const state = new StateManager();
