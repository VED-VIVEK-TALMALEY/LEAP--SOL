// ============================================
// ALUMNI CONNECT - Network with Successful Students
// ============================================

import { router } from '../js/router.js';

// Mock alumni data
const mockAlumni = [
    {
        id: 'alumni_001',
        name: 'Priya Sharma',
        university: 'University of Toronto',
        course: 'MS Computer Science',
        country: 'Canada',
        graduation_year: 2024,
        ielts_score: 8.0,
        bio: 'Software Engineer at Google. Happy to help with applications and IELTS prep!',
        available_for_connect: true
    },
    {
        id: 'alumni_002',
        name: 'Michael Chen',
        university: 'Stanford University',
        course: 'MBA',
        country: 'USA',
        graduation_year: 2023,
        ielts_score: 7.5,
        bio: 'Product Manager. Can guide on MBA applications and interview prep.',
        available_for_connect: true
    },
    {
        id: 'alumni_003',
        name: 'Emma Wilson',
        university: 'Imperial College London',
        course: 'MS Artificial Intelligence',
        country: 'UK',
        graduation_year: 2025,
        ielts_score: 8.5,
        bio: 'AI Researcher. Passionate about helping future students.',
        available_for_connect: true
    },
    {
        id: 'alumni_004',
        name: 'Raj Patel',
        university: 'University of Melbourne',
        course: 'MS Data Science',
        country: 'Australia',
        graduation_year: 2024,
        ielts_score: 7.0,
        bio: 'Data Scientist. Can share insights on Australian universities.',
        available_for_connect: true
    }
];

export function createAlumniConnect() {
    const container = document.createElement('div');
    container.className = 'alumni-connect-page';
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px;';

    container.innerHTML = `
        <div class="page-header mb-lg">
            <h1>🎓 Alumni Connect</h1>
            <p class="text-secondary">Learn from students who made it to their dream universities</p>
        </div>

        <div class="search-filters mb-lg">
            <input 
                type="text" 
                id="search-input" 
                placeholder="Search by university, course, or country..."
                class="search-input"
            />
            <div class="filter-chips">
                <button class="filter-chip active" data-country="all">All Countries</button>
                <button class="filter-chip" data-country="USA">🇺🇸 USA</button>
                <button class="filter-chip" data-country="UK">🇬🇧 UK</button>
                <button class="filter-chip" data-country="Canada">🍁 Canada</button>
                <button class="filter-chip" data-country="Australia">🦘 Australia</button>
            </div>
        </div>

        <div class="alumni-grid">
            ${mockAlumni.map(alumni => renderAlumniCard(alumni)).join('')}
        </div>

        <nav class="nav">
            <div class="nav-items">
                <div class="nav-item" data-route="/">
                    <div class="nav-icon">🏠</div>
                    <div class="nav-label">Home</div>
                </div>
                <div class="nav-item" data-route="/creators">
                    <div class="nav-icon">✨</div>
                    <div class="nav-label">Creators</div>
                </div>
                <div class="nav-item active" data-route="/alumni">
                    <div class="nav-icon">🎓</div>
                    <div class="nav-label">Alumni</div>
                </div>
                <div class="nav-item" data-route="/stories">
                    <div class="nav-icon">📖</div>
                    <div class="nav-label">Stories</div>
                </div>
                <div class="nav-item" data-route="/profile">
                    <div class="nav-icon">👤</div>
                    <div class="nav-label">Profile</div>
                </div>
            </div>
        </nav>
    `;

    setTimeout(() => {
        // Search functionality
        const searchInput = container.querySelector('#search-input');
        searchInput?.addEventListener('input', (e) => {
            filterAlumni(container, e.target.value);
        });

        // Country filters
        container.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.currentTarget.classList.add('active');

                const country = e.currentTarget.dataset.country;
                filterByCountry(container, country);
            });
        });

        // Connect buttons
        container.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alumniId = e.currentTarget.dataset.alumniId;
                handleConnect(alumniId);
            });
        });

        // Navigation
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => router.navigate(e.currentTarget.dataset.route));
        });
    }, 0);

    return container;
}

function renderAlumniCard(alumni) {
    const initials = alumni.name.split(' ').map(n => n[0]).join('');

    return `
        <div class="alumni-card card" data-country="${alumni.country}" data-search="${alumni.name.toLowerCase()} ${alumni.university.toLowerCase()} ${alumni.course.toLowerCase()} ${alumni.country.toLowerCase()}">
            <div class="alumni-header">
                <div class="alumni-avatar">${initials}</div>
                <div class="alumni-info">
                    <h3>${alumni.name}</h3>
                    <div class="alumni-badge">
                        <span class="badge">IELTS ${alumni.ielts_score}</span>
                        <span class="badge">${alumni.graduation_year}</span>
                    </div>
                </div>
            </div>

            <div class="alumni-details">
                <div class="detail-row">
                    <span class="detail-icon">🎓</span>
                    <span>${alumni.university}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">📚</span>
                    <span>${alumni.course}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">🌍</span>
                    <span>${alumni.country}</span>
                </div>
            </div>

            <p class="alumni-bio text-secondary">${alumni.bio}</p>

            <button class="btn btn-primary btn-sm connect-btn" data-alumni-id="${alumni.id}" style="width: 100%;">
                Connect
            </button>
        </div>
    `;
}

function filterAlumni(container, searchTerm) {
    const cards = container.querySelectorAll('.alumni-card');
    const term = searchTerm.toLowerCase();

    cards.forEach(card => {
        const searchData = card.dataset.search;
        card.style.display = searchData.includes(term) ? 'block' : 'none';
    });
}

function filterByCountry(container, country) {
    const cards = container.querySelectorAll('.alumni-card');

    cards.forEach(card => {
        if (country === 'all') {
            card.style.display = 'block';
        } else {
            card.style.display = card.dataset.country === country ? 'block' : 'none';
        }
    });
}

function handleConnect(alumniId) {
    // TODO: Implement connection request logic
    alert(`Connection request sent to alumni ${alumniId}!`);
}
