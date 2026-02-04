import { state } from '../js/state-manager.js';
import { router } from '../js/router.js';
import { collegeDatabase, getCoursesMatchingIELTS, getUpcomingDeadlines } from '../data/college-database.js';

export function createCollegeDashboard() {
  const user = state.get('user');
  const targetScore = user.targetScore || 7.5;
  const colleges = collegeDatabase;
  const matchingCourses = getCoursesMatchingIELTS({
    overall: targetScore,
    writing: targetScore - 0.5,
    reading: targetScore - 0.5,
    listening: targetScore - 0.5,
    speaking: targetScore - 0.5
  });
  const upcomingDeadlines = getUpcomingDeadlines(90);

  const container = document.createElement('div');
  container.className = 'college-dashboard';

  container.innerHTML = `
    <div class="dashboard-header">
      <h1>College Dashboard</h1>
      <p class="text-secondary">Track universities, deadlines, and application progress</p>
    </div>

    <div class="insights-section">
      <h2>📊 Your Insights</h2>
      <div class="insights-grid">
        <div class="insight-card card-glass">
          <div class="insight-icon">🎯</div>
          <div class="insight-value">${matchingCourses.length}</div>
          <div class="insight-label">Courses Match Your Score</div>
        </div>
        <div class="insight-card card-glass">
          <div class="insight-icon">⏰</div>
          <div class="insight-value">${upcomingDeadlines.length}</div>
          <div class="insight-label">Upcoming Deadlines</div>
        </div>
        <div class="insight-card card-glass">
          <div class="insight-icon">🌍</div>
          <div class="insight-value">${colleges.length}</div>
          <div class="insight-label">Universities Available</div>
        </div>
      </div>
    </div>

    <div class="news-section">
      <h2>📰 Latest News</h2>
      <div class="news-feed">
        ${generateNews().map(news => `
          <div class="news-card card-glass card-interactive">
            <div class="news-header">
              <span class="news-source">${news.source}</span>
              <span class="news-date">${news.date}</span>
            </div>
            <h3>${news.title}</h3>
            <p class="text-secondary">${news.excerpt}</p>
            <div class="news-tags">
              ${news.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="applications-section">
      <h2>📋 My Applications</h2>
      <div class="application-board">
        <div class="board-column">
          <div class="column-header">
            <h3>Interested</h3>
            <span class="count">3</span>
          </div>
          <div class="applications-list" id="interested-list">
            ${generateApplications('interested').map(app => renderApplication(app)).join('')}
          </div>
        </div>

        <div class="board-column">
          <div class="column-header">
            <h3>Applying</h3>
            <span class="count">2</span>
          </div>
          <div class="applications-list" id="applying-list">
            ${generateApplications('applying').map(app => renderApplication(app)).join('')}
          </div>
        </div>

        <div class="board-column">
          <div class="column-header">
            <h3>Submitted</h3>
            <span class="count">1</span>
          </div>
          <div class="applications-list" id="submitted-list">
            ${generateApplications('submitted').map(app => renderApplication(app)).join('')}
          </div>
        </div>

        <div class="board-column">
          <div class="column-header">
            <h3>Result</h3>
            <span class="count">0</span>
          </div>
          <div class="applications-list" id="result-list">
          </div>
        </div>
      </div>
    </div>

    <nav class="nav">
      <div class="nav-items">
        <div class="nav-item" data-route="/">
          <div class="nav-icon">🏠</div>
          <div class="nav-label">Home</div>
        </div>
        <div class="nav-item" data-route="/practice">
          <div class="nav-icon">📝</div>
          <div class="nav-label">Practice</div>
        </div>
        <div class="nav-item" data-route="/feed">
          <div class="nav-icon">📱</div>
          <div class="nav-label">Feed</div>
        </div>
        <div class="nav-item" data-route="/league">
          <div class="nav-icon">🏆</div>
          <div class="nav-label">League</div>
        </div>
        <div class="nav-item active" data-route="/colleges">
          <div class="nav-icon">🎓</div>
          <div class="nav-label">Colleges</div>
        </div>
      </div>
    </nav>
  `;

  setTimeout(() => {
    container.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        router.navigate(e.currentTarget.dataset.route);
      });
    });
  }, 0);

  return container;
}

function generateNews() {
  return [
    {
      source: 'University of Toronto',
      date: '2 days ago',
      title: 'New MS in AI Program Announced for Fall 2026',
      excerpt: 'Applications open March 1st. IELTS requirement: 7.0 overall.',
      tags: ['Canada', 'AI', 'New Program']
    },
    {
      source: 'Imperial College London',
      date: '5 days ago',
      title: 'Extended Deadline for Computing Programs',
      excerpt: 'Deadline extended to February 28th due to high demand.',
      tags: ['UK', 'Deadline', 'Computing']
    },
    {
      source: 'University of Melbourne',
      date: '1 week ago',
      title: 'Scholarship Opportunities for International Students',
      excerpt: '50% tuition waiver for top applicants. Apply by March 15th.',
      tags: ['Australia', 'Scholarship', 'Financial Aid']
    }
  ];
}

function generateApplications(status) {
  const apps = {
    interested: [
      { university: 'Stanford University', course: 'MS Computer Science', deadline: 'Dec 15, 2026', progress: 0 },
      { university: 'MIT', course: 'MS AI', deadline: 'Dec 31, 2026', progress: 0 },
      { university: 'ETH Zurich', course: 'MS Data Science', deadline: 'Jan 15, 2027', progress: 0 }
    ],
    applying: [
      { university: 'University of Toronto', course: 'MS Computer Science', deadline: 'Mar 15, 2026', progress: 60 },
      { university: 'Imperial College', course: 'MS AI', deadline: 'Feb 28, 2026', progress: 40 }
    ],
    submitted: [
      { university: 'University of Melbourne', course: 'MS Data Science', deadline: 'Jan 31, 2026', progress: 100 }
    ]
  };
  return apps[status] || [];
}

function renderApplication(app) {
  return `
    <div class="application-card card-glass">
      <h4>${app.university}</h4>
      <p class="text-secondary text-sm">${app.course}</p>
      <div class="app-deadline">
        <span>📅</span>
        <span>${app.deadline}</span>
      </div>
      ${app.progress > 0 ? `
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${app.progress}%"></div>
        </div>
        <div class="text-tertiary text-xs">${app.progress}% complete</div>
      ` : ''}
    </div>
  `;
}
