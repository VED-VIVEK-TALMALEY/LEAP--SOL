// ============================================
// ROUTER - Client-Side Navigation
// ============================================

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeNavigate = null;

        // Listen to popstate for browser back/forward
        window.addEventListener('popstate', () => {
            this.navigate(window.location.hash.slice(1) || '/', false);
        });
    }

    // Register a route
    register(path, component) {
        this.routes.set(path, component);
    }

    // Navigate to a route
    async navigate(path, pushState = true) {
        // Call beforeNavigate hook if exists
        if (this.beforeNavigate) {
            const canNavigate = await this.beforeNavigate(path);
            if (!canNavigate) return;
        }

        const route = this.routes.get(path);
        if (!route) {
            console.error(`Route not found: ${path}`);
            return;
        }

        const app = document.getElementById('app');
        if (!app) {
            console.error('App container not found');
            return;
        }

        while (app.firstChild) {
            app.firstChild.remove();
        }

        try {
            const view = await route();

            if (typeof view === 'string') {
                app.innerHTML = view;
            } else if (view instanceof HTMLElement) {
                app.appendChild(view);
            }

            if (pushState) {
                window.location.hash = path;
            }

            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error rendering route:', error);
            app.innerHTML = `<div style="padding: 2rem; color: red;">Error loading page: ${error.message}</div>`;
        }
    }

    // Set before navigate hook
    setBeforeNavigate(fn) {
        this.beforeNavigate = fn;
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }
}

export const router = new Router();
