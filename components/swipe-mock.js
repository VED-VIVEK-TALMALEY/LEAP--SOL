// ============================================
// SWIPE MOCK COMPONENT - Tinder-Style Practice
// ============================================

import { state } from '../js/state-manager.js';
import { eventBus } from '../js/event-bus.js';
import { momentumEngine } from '../js/momentum-engine.js';
import { leagueSystem } from '../js/league-system.js';
import { getMixedQuestions, getQuestionsBySkill } from '../data/question-bank.js';
import { dateUtils } from '../js/utils.js';

export class SwipeMockComponent {
    constructor(mode = '5min') {
        this.mode = mode;
        this.questionCount = this.getQuestionCount(mode);
        this.questions = [];
        this.currentIndex = 0;
        this.sessionResults = [];
        this.startTime = Date.now();

        this.loadQuestions();
    }

    getQuestionCount(mode) {
        const counts = { '2min': 10, '5min': 25, '10min': 50 };
        return counts[mode] || 25;
    }

    loadQuestions() {
        const needsWork = state.get('swipeMock.needsWork') || [];

        // Prioritize needs-work questions with spaced repetition
        const needsWorkQuestions = this.getSpacedRepetitionQuestions(needsWork);
        const newQuestions = getMixedQuestions(this.questionCount - needsWorkQuestions.length);

        this.questions = [...needsWorkQuestions, ...newQuestions].slice(0, this.questionCount);
    }

    getSpacedRepetitionQuestions(needsWork) {
        const now = Date.now();
        const intervals = [
            24 * 60 * 60 * 1000,  // 24 hours
            72 * 60 * 60 * 1000,  // 72 hours
            7 * 24 * 60 * 60 * 1000,  // 7 days
            14 * 24 * 60 * 60 * 1000  // 14 days
        ];

        const due = needsWork.filter(item => {
            const timeSince = now - new Date(item.lastReviewed).getTime();
            return intervals.some(interval => timeSince >= interval);
        });

        return due.map(item => item.question).slice(0, 10);
    }

    render() {
        const container = document.createElement('div');
        container.className = 'swipe-mock-container';
        container.innerHTML = `
      <div class="swipe-mock-header">
        <div class="flex justify-between items-center">
          <button class="btn btn-ghost" id="back-btn">← Back</button>
          <div class="text-secondary">
            <span id="question-counter">${this.currentIndex + 1}</span>/${this.questionCount}
          </div>
        </div>
        <div class="progress-bar mt-md">
          <div class="progress-fill" id="progress-fill" style="width: ${(this.currentIndex / this.questionCount) * 100}%"></div>
        </div>
      </div>

      <div class="swipe-mock-content" id="swipe-content">
        ${this.renderQuestion()}
      </div>

      <div class="swipe-mock-footer">
        <div class="swipe-instructions">
          <div class="swipe-hint swipe-left">
            <span class="swipe-icon">←</span>
            <span class="swipe-label">Need Practice</span>
          </div>
          <div class="swipe-hint swipe-right">
            <span class="swipe-label">I Know This</span>
            <span class="swipe-icon">→</span>
          </div>
        </div>
      </div>
    `;

        this.attachEventListeners(container);
        return container;
    }

    renderQuestion() {
        if (this.currentIndex >= this.questions.length) {
            return this.renderComplete();
        }

        const question = this.questions[this.currentIndex];
        const skillColors = {
            reading: '#0a84ff',
            writing: '#5e5ce6',
            listening: '#30d158',
            speaking: '#ff9f0a'
        };

        return `
      <div class="question-card card-elevated" id="question-card">
        <div class="question-header">
          <span class="badge" style="background: ${skillColors[question.skill]}20; color: ${skillColors[question.skill]}">
            ${question.skill.toUpperCase()}
          </span>
          <span class="badge badge-${this.getDifficultyLabel(question.difficulty)}">
            Level ${question.difficulty}
          </span>
        </div>
        
        <div class="question-text">
          <h3>${question.question}</h3>
        </div>

        <div class="question-options">
          ${question.options.map((option, index) => `
            <button class="option-btn" data-option="${option}">
              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              <span class="option-text">${option}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    }

    getDifficultyLabel(difficulty) {
        if (difficulty <= 3) return 'success';
        if (difficulty <= 6) return 'warning';
        return 'error';
    }

    renderComplete() {
        const duration = Math.round((Date.now() - this.startTime) / 1000);
        const correct = this.sessionResults.filter(r => r.correct).length;
        const accuracy = (correct / this.sessionResults.length) * 100;

        return `
      <div class="session-complete fade-in">
        <div class="complete-icon">🎉</div>
        <h2>Session Complete!</h2>
        
        <div class="session-stats">
          <div class="stat-card">
            <div class="stat-value">${correct}/${this.sessionResults.length}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${accuracy.toFixed(0)}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${Math.floor(duration / 60)}m ${duration % 60}s</div>
            <div class="stat-label">Time</div>
          </div>
        </div>

        <div class="momentum-update">
          <div class="momentum-badge">
            +${this.calculateEffortScore()} Momentum
          </div>
        </div>

        <button class="btn btn-primary btn-lg" id="finish-btn">
          Continue
        </button>
      </div>
    `;
    }

    calculateEffortScore() {
        const duration = (Date.now() - this.startTime) / 1000 / 60; // minutes
        const accuracy = this.sessionResults.filter(r => r.correct).length / this.sessionResults.length;

        // Effort based on time and accuracy
        return Math.round(duration * accuracy * 10);
    }

    attachEventListeners(container) {
        // Back button
        container.querySelector('#back-btn')?.addEventListener('click', () => {
            window.location.hash = '/';
        });

        // Finish button (appears after completion)
        setTimeout(() => {
            container.querySelector('#finish-btn')?.addEventListener('click', () => {
                this.saveSession();
                window.location.hash = '/';
            });
        }, 100);

        // Option selection
        const optionButtons = container.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedOption = e.currentTarget.dataset.option;
                this.handleAnswer(selectedOption);
            });
        });

        // Swipe gestures
        const card = container.querySelector('#question-card');
        if (card) {
            this.attachSwipeGestures(card);
        }
    }

    attachSwipeGestures(card) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const handleStart = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            card.style.transition = 'none';
        };

        const handleMove = (e) => {
            if (!isDragging) return;

            currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const diff = currentX - startX;

            card.style.transform = `translateX(${diff}px) rotate(${diff * 0.1}deg)`;
            card.style.opacity = 1 - Math.abs(diff) / 300;
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = currentX - startX;
            card.style.transition = 'all 0.3s ease';

            if (Math.abs(diff) > 100) {
                // Swipe detected
                const direction = diff > 0 ? 'right' : 'left';
                this.handleSwipe(direction);
            } else {
                // Reset
                card.style.transform = '';
                card.style.opacity = '1';
            }
        };

        card.addEventListener('mousedown', handleStart);
        card.addEventListener('touchstart', handleStart);
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('touchmove', handleMove);
        card.addEventListener('mouseup', handleEnd);
        card.addEventListener('touchend', handleEnd);
        card.addEventListener('mouseleave', handleEnd);
    }

    handleSwipe(direction) {
        const question = this.questions[this.currentIndex];

        // For swipe, we don't have the answer, so mark as needs work (left) or mastered (right)
        const correct = direction === 'right';

        this.recordAnswer(question, null, correct);
        this.nextQuestion();
    }

    handleAnswer(selectedOption) {
        const question = this.questions[this.currentIndex];
        const correct = selectedOption === question.correctAnswer;

        this.recordAnswer(question, selectedOption, correct);

        // Show feedback briefly
        this.showFeedback(correct, question);

        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    showFeedback(correct, question) {
        const card = document.querySelector('#question-card');
        if (!card) return;

        const feedback = document.createElement('div');
        feedback.className = `feedback-overlay ${correct ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
      <div class="feedback-icon">${correct ? '✓' : '✗'}</div>
      <div class="feedback-text">${correct ? 'Correct!' : 'Needs Practice'}</div>
      ${!correct ? `<div class="feedback-explanation">${question.explanation}</div>` : ''}
    `;

        card.appendChild(feedback);
    }

    recordAnswer(question, selectedOption, correct) {
        this.sessionResults.push({
            question,
            selectedOption,
            correct,
            timestamp: Date.now()
        });

        // Update buckets
        const mastered = state.get('swipeMock.mastered') || [];
        const needsWork = state.get('swipeMock.needsWork') || [];

        if (correct) {
            // Add to mastered, remove from needs work
            if (!mastered.includes(question.id)) {
                mastered.push(question.id);
            }
            const needsWorkIndex = needsWork.findIndex(item => item.questionId === question.id);
            if (needsWorkIndex >= 0) {
                needsWork.splice(needsWorkIndex, 1);
            }
        } else {
            // Add to needs work
            const existing = needsWork.find(item => item.questionId === question.id);
            if (existing) {
                existing.lastReviewed = new Date().toISOString();
                existing.attempts++;
            } else {
                needsWork.push({
                    questionId: question.id,
                    question,
                    lastReviewed: new Date().toISOString(),
                    attempts: 1
                });
            }
        }

        state.set('swipeMock.mastered', mastered);
        state.set('swipeMock.needsWork', needsWork);
    }

    nextQuestion() {
        this.currentIndex++;

        // Update progress
        const progressFill = document.querySelector('#progress-fill');
        const questionCounter = document.querySelector('#question-counter');

        if (progressFill) {
            progressFill.style.width = `${(this.currentIndex / this.questionCount) * 100}%`;
        }
        if (questionCounter) {
            questionCounter.textContent = this.currentIndex + 1;
        }

        // Render next question or completion
        const content = document.querySelector('#swipe-content');
        if (content) {
            content.innerHTML = this.renderQuestion();
            this.attachEventListeners(content.closest('.swipe-mock-container'));
        }
    }

    saveSession() {
        const sessionHistory = state.get('swipeMock.sessionHistory') || [];

        sessionHistory.push({
            date: dateUtils.today(),
            mode: this.mode,
            questions: this.sessionResults,
            duration: Math.round((Date.now() - this.startTime) / 1000),
            accuracy: this.sessionResults.filter(r => r.correct).length / this.sessionResults.length
        });

        state.set('swipeMock.sessionHistory', sessionHistory);
        state.set('swipeMock.lastSessionDate', dateUtils.today());
        state.set('swipeMock.totalSwipes', (state.get('swipeMock.totalSwipes') || 0) + this.sessionResults.length);

        // Update momentum
        const effort = this.calculateEffortScore();
        momentumEngine.recordActivity(this.sessionResults.length, Math.min(effort / 10, 10));

        // Update league points
        leagueSystem.updateLeaguePoints();

        // Emit event
        eventBus.emit('session:completed', {
            mode: this.mode,
            results: this.sessionResults
        });
    }
}

export function createSwipeMock(mode = '5min') {
    const component = new SwipeMockComponent(mode);
    return component.render();
}
