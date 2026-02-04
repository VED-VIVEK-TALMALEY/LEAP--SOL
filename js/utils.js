// ============================================
// UTILITY FUNCTIONS
// ============================================

// Date utilities
export const dateUtils = {
    // Get today's date string (YYYY-MM-DD)
    today() {
        return new Date().toISOString().split('T')[0];
    },

    // Check if date is today
    isToday(dateString) {
        return dateString === this.today();
    },

    // Get days between two dates
    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },

    // Get relative time (e.g., "2 days ago")
    relativeTime(dateString) {
        const days = this.daysBetween(dateString, this.today());
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    }
};

// Number utilities
export const numberUtils = {
    // Clamp number between min and max
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },

    // Round to decimal places
    round(num, decimals = 0) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    // Format as percentage
    percentage(num, decimals = 0) {
        return `${this.round(num * 100, decimals)}%`;
    },

    // Format large numbers (e.g., 1.2k, 3.4M)
    formatLarge(num) {
        if (num < 1000) return num.toString();
        if (num < 1000000) return `${this.round(num / 1000, 1)}k`;
        return `${this.round(num / 1000000, 1)}M`;
    }
};

// Array utilities
export const arrayUtils = {
    // Shuffle array
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Get random item
    random(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Get random items
    randomItems(array, count) {
        return this.shuffle(array).slice(0, count);
    },

    // Group by key
    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const value = typeof key === 'function' ? key(item) : item[key];
            (groups[value] = groups[value] || []).push(item);
            return groups;
        }, {});
    }
};

// DOM utilities
export const domUtils = {
    // Create element with attributes
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });

        return element;
    },

    // Add event listener with cleanup
    on(element, event, handler) {
        element.addEventListener(event, handler);
        return () => element.removeEventListener(event, handler);
    },

    // Query selector helper
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    // Query selector all helper
    $$(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }
};

// Animation utilities
export const animUtils = {
    // Fade in element
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';

        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    // Fade out element
    fadeOut(element, duration = 300) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = 1 - Math.min(progress / duration, 1);

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };

        requestAnimationFrame(animate);
    },

    // Slide down
    slideDown(element, duration = 300) {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';

        const targetHeight = element.scrollHeight;
        let start = null;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.height = `${Math.min((progress / duration) * targetHeight, targetHeight)}px`;

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            }
        };

        requestAnimationFrame(animate);
    }
};

// Storage utilities
export const storageUtils = {
    // Set item with expiry
    set(key, value, expiryMs = null) {
        const item = {
            value,
            expiry: expiryMs ? Date.now() + expiryMs : null
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    // Get item with expiry check
    get(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        if (item.expiry && Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    },

    // Remove item
    remove(key) {
        localStorage.removeItem(key);
    },

    // Clear all
    clear() {
        localStorage.clear();
    }
};
