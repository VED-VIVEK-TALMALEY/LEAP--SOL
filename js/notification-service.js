// ============================================
// NOTIFICATION SERVICE
// ============================================

import { state } from './state-manager.js';
import { showToast } from './animations.js';

class NotificationService {
    constructor() {
        this.permission = 'default';
        this.enabled = true;
    }

    /**
     * Request notification permission
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            this.permission = 'granted';
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        }

        return false;
    }

    /**
     * Show browser notification
     */
    showNotification(title, options = {}) {
        if (!this.enabled || this.permission !== 'granted') {
            return;
        }

        const defaultOptions = {
            icon: '/icon-192.png',
            badge: '/badge-72.png',
            vibrate: [200, 100, 200],
            tag: 'leap-notification',
            ...options
        };

        try {
            new Notification(title, defaultOptions);
        } catch (error) {
            console.error('Notification error:', error);
        }
    }

    /**
     * Schedule daily reminder
     */
    scheduleDailyReminder(hour = 20, minute = 0) {
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hour, minute, 0, 0);

        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const timeUntilReminder = scheduledTime - now;

        setTimeout(() => {
            this.showNotification('🔥 Don\'t break your streak!', {
                body: 'Practice for 5 minutes to maintain your momentum',
                requireInteraction: true
            });

            // Schedule next day
            this.scheduleDailyReminder(hour, minute);
        }, timeUntilReminder);
    }

    /**
     * Notify about rival activity
     */
    notifyRivalActivity(rivalName) {
        this.showNotification('👀 Your rival is active!', {
            body: `${rivalName} just practiced. Don't fall behind!`,
            tag: 'rival-activity'
        });
    }

    /**
     * Notify about league promotion
     */
    notifyLeaguePromotion(newLeague) {
        this.showNotification('🏆 League Promotion!', {
            body: `Congratulations! You've been promoted to ${newLeague} League!`,
            tag: 'league-promotion',
            requireInteraction: true
        });
    }

    /**
     * Notify about streak milestone
     */
    notifyStreakMilestone(days) {
        this.showNotification(`🔥 ${days} Day Streak!`, {
            body: `Amazing! You've maintained a ${days} day streak!`,
            tag: 'streak-milestone'
        });
    }

    /**
     * Notify about achievement unlock
     */
    notifyAchievement(achievement) {
        this.showNotification('⭐ Achievement Unlocked!', {
            body: achievement.name,
            tag: 'achievement',
            icon: achievement.icon || '/icon-192.png'
        });
    }

    /**
     * Toggle notifications on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        state.update('settings', {
            ...state.get('settings'),
            notificationsEnabled: this.enabled
        });
        showToast(this.enabled ? 'Notifications enabled' : 'Notifications disabled', 'success');
    }
}

export const notificationService = new NotificationService();
