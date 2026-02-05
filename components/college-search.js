// ============================================
// COLLEGE SEARCH COMPONENT - Real-time Data
// ============================================

import { state } from '../js/state-manager.js';
import { router } from '../js/router.js';
import { collegeDataService } from '../js/college-data-service.js';

export function createCollegeSearch() {
    const container = document.createElement('div');
    container.className = 'college-search-page';

    container.innerHTML = `
    <div class="search-header">
      <h1>🎓 University Search</h1>
      <p class="text-secondary">Search from thousands of universities worldwide with real-time data</p>
    </div>

    <div class="search-controls">
      <div class="search-bar">
        <input 
          type="text" 
          id="university-search" 
          placeholder="Search universities..." 
          class="search-input"
        />
        <button id="search-btn" class="btn btn-primary">Search</button>
      </div>
      
      <div class="filter-controls">
        <select id="country-filter" class="filter-select">
          <option value="">All Countries</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="Netherlands">Netherlands</option>
        </select>
        
        <button id="import-btn" class="btn btn-secondary">
          📥 Import Fresh Data
        </button>
      </div>
    </div>

    <div id="search-results" class="search-results">
      <div class="loading-state">
        <div class="pulse" style="font-size: 4rem;">🎓</div>
        <p class="text-secondary">Loading universities...</p>
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
        <div class="nav-item active" data-route="/college-search">
          <div class="nav-icon">🔍</div>
          <div class="nav-label">Search</div>
        </div>
        <div class="nav-item" data-route="/colleges">
          <div class="nav-icon">🎓</div>
          <div class="nav-label">Colleges</div>
        </div>
      </div>
    </nav>
  `;

    // Initialize
    setTimeout(async () => {
        await loadInitialData(container);
        setupEventListeners(container);
    }, 0);

    return container;
}

async function loadInitialData(container) {
    const resultsDiv = container.querySelector('#search-results');

    try {
        // Get cached universities or fetch new ones
        let universities = await collegeDataService.getUniversities({ country: 'United States' });

        if (!universities || universities.length === 0) {
            resultsDiv.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 4rem;">📚</div>
          <h3>No universities loaded yet</h3>
          <p class="text-secondary">Click "Import Fresh Data" to load universities</p>
        </div>
      `;
            return;
        }

        // Enrich with IELTS data
        universities = collegeDataService.enrichWithIELTSRequirements(universities);

        renderUniversities(resultsDiv, universities.slice(0, 20));
    } catch (error) {
        console.error('Error loading universities:', error);
        resultsDiv.innerHTML = `
      <div class="error-state">
        <div style="font-size: 4rem;">⚠️</div>
        <h3>Error loading data</h3>
        <p class="text-secondary">${error.message}</p>
      </div>
    `;
    }
}

function setupEventListeners(container) {
    const searchInput = container.querySelector('#university-search');
    const searchBtn = container.querySelector('#search-btn');
    const countryFilter = container.querySelector('#country-filter');
    const importBtn = container.querySelector('#import-btn');
    const resultsDiv = container.querySelector('#search-results');

    // Search functionality
    const performSearch = async () => {
        const query = searchInput.value.trim();
        const country = countryFilter.value;

        resultsDiv.innerHTML = `
      <div class="loading-state">
        <div class="pulse" style="font-size: 4rem;">🔍</div>
        <p class="text-secondary">Searching...</p>
      </div>
    `;

        try {
            let universities = await collegeDataService.getUniversities({
                search: query,
                country: country
            });

            if (!universities || universities.length === 0) {
                // Try fetching from API
                universities = await collegeDataService.searchUniversities(country, query);
            }

            universities = collegeDataService.enrichWithIELTSRequirements(universities);

            if (universities.length === 0) {
                resultsDiv.innerHTML = `
          <div class="empty-state">
            <div style="font-size: 4rem;">🔍</div>
            <h3>No universities found</h3>
            <p class="text-secondary">Try a different search term or country</p>
          </div>
        `;
            } else {
                renderUniversities(resultsDiv, universities.slice(0, 50));
            }
        } catch (error) {
            console.error('Search error:', error);
            resultsDiv.innerHTML = `
        <div class="error-state">
          <div style="font-size: 4rem;">⚠️</div>
          <h3>Search failed</h3>
          <p class="text-secondary">${error.message}</p>
        </div>
      `;
        }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    countryFilter.addEventListener('change', performSearch);

    // Import functionality
    importBtn.addEventListener('click', async () => {
        const country = countryFilter.value || 'United States';

        importBtn.disabled = true;
        importBtn.innerHTML = '⏳ Importing...';

        try {
            const result = await collegeDataService.importUniversities(country);

            if (result.success) {
                importBtn.innerHTML = `✅ Imported ${result.count} universities!`;
                setTimeout(() => {
                    importBtn.innerHTML = '📥 Import Fresh Data';
                    importBtn.disabled = false;
                }, 2000);

                // Refresh results
                await loadInitialData(container);
            } else {
                throw new Error('Import failed');
            }
        } catch (error) {
            console.error('Import error:', error);
            importBtn.innerHTML = '❌ Import Failed';
            setTimeout(() => {
                importBtn.innerHTML = '📥 Import Fresh Data';
                importBtn.disabled = false;
            }, 2000);
        }
    });

    // Navigation
    container.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            router.navigate(e.currentTarget.dataset.route);
        });
    });
}

function renderUniversities(container, universities) {
    const user = state.get('user');
    const userScore = user?.user_metadata?.ielts_score || 6.5;

    container.innerHTML = `
    <div class="results-header">
      <h3>Found ${universities.length} Universities</h3>
      <p class="text-secondary">Your IELTS Score: ${userScore}</p>
    </div>
    
    <div class="university-grid">
      ${universities.map(uni => renderUniversityCard(uni, userScore)).join('')}
    </div>
  `;
}

function renderUniversityCard(university, userScore) {
    const meetsRequirement = userScore >= university.ielts_requirement;
    const gap = university.ielts_requirement - userScore;

    let statusBadge = '';
    if (meetsRequirement) {
        statusBadge = '<span class="badge badge-success">✓ Eligible</span>';
    } else if (gap <= 0.5) {
        statusBadge = '<span class="badge badge-warning">⚠ Close</span>';
    } else {
        statusBadge = `<span class="badge" style="background: #ff3366; color: white;">Gap: ${gap.toFixed(1)}</span>`;
    }

    return `
    <div class="university-card card card-interactive">
      <div class="uni-header">
        <img 
          src="${university.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&background=ff3366&color=fff&size=80`}" 
          alt="${university.name}"
          class="uni-logo"
          onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&background=ff3366&color=fff&size=80'"
        />
        <div class="uni-info">
          <h4>${university.name}</h4>
          <p class="text-secondary text-sm">
            ${university.state ? university.state + ', ' : ''}${university.country}
          </p>
        </div>
      </div>

      <div class="uni-requirements">
        <div class="requirement-item">
          <span class="label">IELTS Required:</span>
          <span class="value">${university.ielts_requirement}</span>
        </div>
        <div class="requirement-item">
          <span class="label">Recommended:</span>
          <span class="value">${university.ielts_recommended}</span>
        </div>
      </div>

      <div class="uni-status">
        ${statusBadge}
      </div>

      ${university.website ? `
        <a href="${university.website}" target="_blank" class="btn btn-sm btn-ghost" style="margin-top: var(--space-sm);">
          🌐 Visit Website
        </a>
      ` : ''}
    </div>
  `;
}
