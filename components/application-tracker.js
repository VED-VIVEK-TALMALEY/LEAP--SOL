// ============================================
// APPLICATION TRACKER - Kanban Board
// ============================================

import { state } from '../js/state-manager.js';
import { router } from '../js/router.js';

// Application stages
const STAGES = {
    interested: { label: 'Interested', icon: '💡', color: '#5c94fc' },
    preparing: { label: 'Preparing', icon: '📝', color: '#ffd700' },
    submitted: { label: 'Submitted', icon: '✅', color: '#00aa00' },
    result: { label: 'Result', icon: '🎉', color: '#ff0000' }
};

export function createApplicationTracker() {
    // Load applications from state
    let applications = state.get('applications') || [];

    // Initialize with mock data if empty
    if (applications.length === 0) {
        applications = [
            {
                id: 'app_001',
                university: 'University of Toronto',
                course: 'MS Computer Science',
                country: 'Canada',
                deadline: '2026-03-15',
                status: 'interested',
                progress: 0,
                notes: ''
            },
            {
                id: 'app_002',
                university: 'Stanford University',
                course: 'MS AI',
                country: 'USA',
                deadline: '2026-12-15',
                status: 'interested',
                progress: 0,
                notes: ''
            },
            {
                id: 'app_003',
                university: 'Imperial College London',
                course: 'MS AI',
                country: 'UK',
                deadline: '2026-02-28',
                status: 'preparing',
                progress: 40,
                notes: 'Working on SOP'
            },
            {
                id: 'app_004',
                university: 'University of Melbourne',
                course: 'MS Data Science',
                country: 'Australia',
                deadline: '2026-01-31',
                status: 'submitted',
                progress: 100,
                notes: 'Submitted on Jan 15'
            }
        ];
        state.update('applications', applications);
    }

    const container = document.createElement('div');
    container.className = 'application-tracker';
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px;';

    container.innerHTML = `
        <div class="tracker-header mb-lg">
            <h1>📋 Application Tracker</h1>
            <button class="btn btn-primary" id="add-app-btn">+ Add Application</button>
        </div>

        <div class="kanban-board">
            ${Object.entries(STAGES).map(([key, stage]) => renderColumn(key, stage, applications)).join('')}
        </div>

        <nav class="nav">
            <div class="nav-items">
                <div class="nav-item" data-route="/">
                    <div class="nav-icon">🏠</div>
                    <div class="nav-label">Home</div>
                </div>
                <div class="nav-item" data-route="/colleges">
                    <div class="nav-icon">🎓</div>
                    <div class="nav-label">Colleges</div>
                </div>
                <div class="nav-item active" data-route="/tracker">
                    <div class="nav-icon">📋</div>
                    <div class="nav-label">Tracker</div>
                </div>
                <div class="nav-item" data-route="/feed">
                    <div class="nav-icon">📱</div>
                    <div class="nav-label">Feed</div>
                </div>
                <div class="nav-item" data-route="/profile">
                    <div class="nav-icon">👤</div>
                    <div class="nav-label">Profile</div>
                </div>
            </div>
        </nav>
    `;

    setTimeout(() => {
        setupDragAndDrop(container);

        // Add application button
        container.querySelector('#add-app-btn')?.addEventListener('click', () => {
            showAddApplicationModal(container);
        });

        // Navigation
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => router.navigate(e.currentTarget.dataset.route));
        });
    }, 0);

    return container;
}

function renderColumn(stageKey, stage, applications) {
    const stageApps = applications.filter(app => app.status === stageKey);

    return `
        <div class="kanban-column" data-stage="${stageKey}">
            <div class="column-header" style="background: ${stage.color};">
                <span class="column-icon">${stage.icon}</span>
                <h3>${stage.label}</h3>
                <span class="column-count">${stageApps.length}</span>
            </div>
            <div class="column-body" data-stage="${stageKey}">
                ${stageApps.map(app => renderApplicationCard(app)).join('')}
            </div>
        </div>
    `;
}

function renderApplicationCard(app) {
    const daysUntilDeadline = calculateDaysUntil(app.deadline);
    const urgency = daysUntilDeadline <= 30 ? 'urgent' : daysUntilDeadline <= 60 ? 'warning' : '';

    return `
        <div class="app-card card" draggable="true" data-app-id="${app.id}">
            <h4>${app.university}</h4>
            <p class="text-secondary text-sm">${app.course}</p>
            <div class="app-meta">
                <span>🌍 ${app.country}</span>
                <span class="deadline ${urgency}">📅 ${formatDate(app.deadline)}</span>
            </div>
            ${app.progress > 0 ? `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${app.progress}%"></div>
                </div>
                <div class="text-tertiary text-xs">${app.progress}% complete</div>
            ` : ''}
            ${app.notes ? `<p class="app-notes text-sm">📝 ${app.notes}</p>` : ''}
        </div>
    `;
}

function setupDragAndDrop(container) {
    let draggedElement = null;

    // Make cards draggable
    container.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedElement = e.currentTarget;
            e.currentTarget.style.opacity = '0.5';
        });

        card.addEventListener('dragend', (e) => {
            e.currentTarget.style.opacity = '1';
        });
    });

    // Make columns droppable
    container.querySelectorAll('.column-body').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });

        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');

            if (draggedElement) {
                const newStage = column.dataset.stage;
                const appId = draggedElement.dataset.appId;

                // Update application status
                updateApplicationStatus(appId, newStage);

                // Re-render the tracker
                const newTracker = createApplicationTracker();
                container.replaceWith(newTracker);
            }
        });
    });
}

function updateApplicationStatus(appId, newStatus) {
    const applications = state.get('applications') || [];
    const app = applications.find(a => a.id === appId);

    if (app) {
        app.status = newStatus;

        // Auto-update progress based on status
        if (newStatus === 'submitted') {
            app.progress = 100;
        } else if (newStatus === 'preparing' && app.progress === 0) {
            app.progress = 20;
        }

        state.update('applications', applications);
    }
}

function showAddApplicationModal(container) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content card" style="max-width: 500px; padding: var(--space-xl);">
            <h2 class="mb-lg">Add New Application</h2>
            
            <div class="form-group mb-md">
                <label>University</label>
                <input type="text" id="uni-input" class="form-input" placeholder="e.g., MIT" />
            </div>
            
            <div class="form-group mb-md">
                <label>Course</label>
                <input type="text" id="course-input" class="form-input" placeholder="e.g., MS Computer Science" />
            </div>
            
            <div class="form-group mb-md">
                <label>Country</label>
                <input type="text" id="country-input" class="form-input" placeholder="e.g., USA" />
            </div>
            
            <div class="form-group mb-lg">
                <label>Deadline</label>
                <input type="date" id="deadline-input" class="form-input" />
            </div>
            
            <div style="display: flex; gap: var(--space-sm);">
                <button class="btn btn-secondary" id="cancel-btn" style="flex: 1;">Cancel</button>
                <button class="btn btn-primary" id="save-btn" style="flex: 1;">Add Application</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#cancel-btn')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#save-btn')?.addEventListener('click', () => {
        const university = modal.querySelector('#uni-input').value;
        const course = modal.querySelector('#course-input').value;
        const country = modal.querySelector('#country-input').value;
        const deadline = modal.querySelector('#deadline-input').value;

        if (university && course && deadline) {
            const applications = state.get('applications') || [];
            applications.push({
                id: 'app_' + Date.now(),
                university,
                course,
                country,
                deadline,
                status: 'interested',
                progress: 0,
                notes: ''
            });
            state.update('applications', applications);

            modal.remove();
            const newTracker = createApplicationTracker();
            container.replaceWith(newTracker);
        }
    });
}

function calculateDaysUntil(dateString) {
    const deadline = new Date(dateString);
    const now = new Date();
    const diff = deadline - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
