// ============================================
// CREATOR FEED - Content from IELTS Mentors
// ============================================

import { router } from '../js/router.js';

// Mock creator data (will be replaced with Supabase data)
const mockCreators = [
    {
        id: 'creator_001',
        name: 'Sarah IELTS Pro',
        bio: 'IELTS 8.5 | Helped 500+ students',
        verified: true,
        category: ['ielts_tips', 'speaking'],
        follower_count: 12500,
        avatar_url: null,
        recent_content: {
            title: '5 Speaking Tips That Got Me 8.5',
            content_type: 'video',
            views: 45000,
            likes: 3200
        }
    },
    {
        id: 'creator_002',
        name: 'Study Abroad Guide',
        bio: 'Stanford Alum | Application Expert',
        verified: true,
        category: ['study_abroad', 'applications'],
        follower_count: 8900,
        avatar_url: null,
        recent_content: {
            title: 'How I Got Into 5 Top Universities',
            content_type: 'article',
            views: 28000,
            likes: 1900
        }
    },
    {
        id: 'creator_003',
        name: 'IELTS Motivation Daily',
        bio: 'Daily motivation for IELTS warriors',
        verified: false,
        category: ['motivation', 'ielts_tips'],
        follower_count: 5200,
        avatar_url: null,
        recent_content: {
            title: 'Never Give Up on Your Dreams',
            content_type: 'tip',
            views: 12000,
            likes: 890
        }
    }
];

export function createCreatorFeed() {
    const container = document.createElement('div');
    container.className = 'creator-feed-page';
    container.style.cssText = 'padding: var(--space-xl); padding-bottom: 100px;';

    container.innerHTML = `
        <div class="page-header mb-lg">
            <h1>✨ Creator Feed</h1>
            <p class="text-secondary">Learn from IELTS experts and study abroad mentors</p>
        </div>

        <div class="filter-tabs mb-lg">
            <button class="filter-tab active" data-filter="all">All</button>
            <button class="filter-tab" data-filter="ielts_tips">IELTS Tips</button>
            <button class="filter-tab" data-filter="study_abroad">Study Abroad</button>
            <button class="filter-tab" data-filter="motivation">Motivation</button>
        </div>

        <div class="creators-grid">
            ${mockCreators.map(creator => renderCreatorCard(creator)).join('')}
        </div>

        <nav class="nav">
            <div class="nav-items">
                <div class="nav-item" data-route="/">
                    <div class="nav-icon">🏠</div>
                    <div class="nav-label">Home</div>
                </div>
                <div class="nav-item" data-route="/feed">
                    <div class="nav-icon">📱</div>
                    <div class="nav-label">Feed</div>
                </div>
                <div class="nav-item active" data-route="/creators">
                    <div class="nav-icon">✨</div>
                    <div class="nav-label">Creators</div>
                </div>
                <div class="nav-item" data-route="/alumni">
                    <div class="nav-icon">🎓</div>
                    <div class="nav-label">Alumni</div>
                </div>
                <div class="nav-item" data-route="/profile">
                    <div class="nav-icon">👤</div>
                    <div class="nav-label">Profile</div>
                </div>
            </div>
        </nav>
    `;

    setTimeout(() => {
        // Filter tabs
        container.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');

                const filter = e.currentTarget.dataset.filter;
                filterCreators(container, filter);
            });
        });

        // Navigation
        container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => router.navigate(e.currentTarget.dataset.route));
        });
    }, 0);

    return container;
}

function renderCreatorCard(creator) {
    const initials = creator.name.split(' ').map(n => n[0]).join('').substring(0, 2);

    return `
        <div class="creator-card card card-interactive" data-categories="${creator.category.join(',')}">
            <div class="creator-header">
                <div class="creator-avatar">${initials}</div>
                <div class="creator-info">
                    <h3>
                        ${creator.name}
                        ${creator.verified ? '<span class="verified-badge">✓</span>' : ''}
                    </h3>
                    <p class="text-secondary text-sm">${creator.bio}</p>
                    <div class="creator-meta">
                        <span>👥 ${formatNumber(creator.follower_count)} followers</span>
                    </div>
                </div>
            </div>

            <div class="recent-content">
                <div class="content-type-badge">${getContentTypeIcon(creator.recent_content.content_type)} ${creator.recent_content.content_type}</div>
                <h4>${creator.recent_content.title}</h4>
                <div class="content-stats">
                    <span>👁️ ${formatNumber(creator.recent_content.views)}</span>
                    <span>❤️ ${formatNumber(creator.recent_content.likes)}</span>
                </div>
            </div>

            <div class="creator-actions">
                <button class="btn btn-secondary btn-sm">Follow</button>
                <button class="btn btn-primary btn-sm">View Content</button>
            </div>
        </div>
    `;
}

function getContentTypeIcon(type) {
    const icons = {
        video: '🎥',
        article: '📝',
        tip: '💡'
    };
    return icons[type] || '📄';
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function filterCreators(container, filter) {
    const cards = container.querySelectorAll('.creator-card');

    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const categories = card.dataset.categories.split(',');
            card.style.display = categories.includes(filter) ? 'block' : 'none';
        }
    });
}
