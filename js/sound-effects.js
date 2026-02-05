// ============================================
// SOUND EFFECTS SYSTEM
// ============================================

import { state } from './state-manager.js';

class SoundEffects {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.sounds = this.initSounds();
    }

    initSounds() {
        // Create audio context for Web Audio API
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();

        return {
            correct: this.createBeep(800, 0.1, 'sine'),
            incorrect: this.createBeep(200, 0.2, 'sawtooth'),
            levelUp: this.createMelody([523, 659, 784, 1047], 0.1),
            achievement: this.createMelody([659, 784, 988, 1319], 0.15),
            click: this.createBeep(400, 0.05, 'square'),
            swipe: this.createBeep(600, 0.08, 'triangle'),
            streak: this.createMelody([784, 988, 1175], 0.1),
            coin: this.createBeep(1000, 0.1, 'sine')
        };
    }

    createBeep(frequency, duration, type = 'sine') {
        return () => {
            if (!this.enabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + duration
            );

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createMelody(frequencies, noteDuration) {
        return () => {
            if (!this.enabled) return;

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createBeep(freq, noteDuration)();
                }, index * noteDuration * 1000);
            });
        };
    }

    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;

        try {
            // Resume audio context if suspended (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            this.sounds[soundName]();
        } catch (error) {
            console.error('Sound playback error:', error);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        state.update('settings', {
            ...state.get('settings'),
            soundEffectsEnabled: this.enabled
        });
        return this.enabled;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        state.update('settings', {
            ...state.get('settings'),
            soundVolume: this.volume
        });
    }

    // Convenience methods
    playCorrect() { this.play('correct'); }
    playIncorrect() { this.play('incorrect'); }
    playLevelUp() { this.play('levelUp'); }
    playAchievement() { this.play('achievement'); }
    playClick() { this.play('click'); }
    playSwipe() { this.play('swipe'); }
    playStreak() { this.play('streak'); }
    playCoin() { this.play('coin'); }
}

export const soundEffects = new SoundEffects();
