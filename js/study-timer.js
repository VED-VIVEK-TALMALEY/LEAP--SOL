// ============================================
// STUDY TIMER WITH POMODORO
// ============================================

import { state } from './state-manager.js';
import { eventBus } from './event-bus.js';
import { showToast } from './animations.js';

class StudyTimer {
    constructor() {
        this.duration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes
        this.timeRemaining = this.duration;
        this.isRunning = false;
        this.isBreak = false;
        this.interval = null;
        this.pomodorosCompleted = 0;
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);

        eventBus.emit('timer:started', { isBreak: this.isBreak });
        showToast(this.isBreak ? '☕ Break started' : '📚 Study session started', 'success');
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.interval);
        this.interval = null;

        eventBus.emit('timer:paused', { timeRemaining: this.timeRemaining });
        showToast('⏸️ Timer paused', 'info');
    }

    reset() {
        this.pause();
        this.timeRemaining = this.isBreak ? this.breakDuration : this.duration;
        eventBus.emit('timer:reset', { timeRemaining: this.timeRemaining });
    }

    tick() {
        this.timeRemaining--;

        eventBus.emit('timer:tick', {
            timeRemaining: this.timeRemaining,
            isBreak: this.isBreak
        });

        if (this.timeRemaining <= 0) {
            this.complete();
        }
    }

    complete() {
        this.pause();

        if (this.isBreak) {
            // Break complete, start work session
            this.isBreak = false;
            this.timeRemaining = this.duration;
            showToast('✅ Break complete! Ready to study?', 'success');
        } else {
            // Pomodoro complete
            this.pomodorosCompleted++;
            this.isBreak = true;
            this.timeRemaining = this.breakDuration;

            // Award momentum
            const momentum = state.get('momentum');
            state.update('momentum', {
                ...momentum,
                score: (momentum.score || 0) + 25
            });

            showToast('🎉 Pomodoro complete! +25 momentum', 'success');

            // Long break after 4 pomodoros
            if (this.pomodorosCompleted % 4 === 0) {
                this.timeRemaining = 15 * 60; // 15 minute long break
                showToast('🏆 4 Pomodoros! Take a long break', 'success');
            }
        }

        eventBus.emit('timer:complete', {
            isBreak: this.isBreak,
            pomodorosCompleted: this.pomodorosCompleted
        });
    }

    setDuration(minutes) {
        this.duration = minutes * 60;
        if (!this.isRunning && !this.isBreak) {
            this.timeRemaining = this.duration;
        }
    }

    setBreakDuration(minutes) {
        this.breakDuration = minutes * 60;
        if (!this.isRunning && this.isBreak) {
            this.timeRemaining = this.breakDuration;
        }
    }

    getTimeString() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    getProgress() {
        const total = this.isBreak ? this.breakDuration : this.duration;
        return ((total - this.timeRemaining) / total) * 100;
    }
}

export const studyTimer = new StudyTimer();
