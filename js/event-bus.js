// ============================================
// EVENT BUS - Cross-Component Communication
// ============================================

class EventBus {
    constructor() {
        this.events = new Map();
    }

    // Subscribe to an event
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    // Emit an event
    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }

    // Subscribe once
    once(event, callback) {
        const unsubscribe = this.on(event, (data) => {
            callback(data);
            unsubscribe();
        });
        return unsubscribe;
    }
}

export const eventBus = new EventBus();
