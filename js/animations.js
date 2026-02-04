// ============================================
// PARTICLE SYSTEM - Dynamic Background
// ============================================

export class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 30;
        this.init();
    }

    init() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    `;

        this.container.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();

            // Draw connections
            this.particles.forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = (1 - distance / 150) * 0.2;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// CONFETTI SYSTEM - Celebration Effects
// ============================================

export function createConfetti(container) {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#fbbf24'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -10px;
      left: ${Math.random() * 100}%;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      z-index: 9999;
      pointer-events: none;
    `;

        container.appendChild(confetti);

        const duration = Math.random() * 2000 + 1000;
        const endX = (Math.random() - 0.5) * 200;

        confetti.animate([
            {
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight + 20}px) translateX(${endX}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// ============================================
// RIPPLE EFFECT - Touch Feedback
// ============================================

export function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    top: ${y}px;
    left: ${x}px;
    pointer-events: none;
    transform: scale(0);
    opacity: 1;
  `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    ripple.animate([
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(2)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    }).onfinish = () => ripple.remove();
}

// ============================================
// PROGRESS RING - Circular Progress
// ============================================

export function createProgressRing(percentage, size = 120) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.style.transform = 'rotate(-90deg)';

    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', size / 2);
    bgCircle.setAttribute('cy', size / 2);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
    bgCircle.setAttribute('stroke-width', '8');

    // Progress circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', size / 2);
    circle.setAttribute('cy', size / 2);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'url(#gradient)');
    circle.setAttribute('stroke-width', '8');
    circle.setAttribute('stroke-linecap', 'round');
    circle.setAttribute('stroke-dasharray', circumference);
    circle.setAttribute('stroke-dashoffset', circumference);

    // Gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.innerHTML = `
    <stop offset="0%" stop-color="#6366f1" />
    <stop offset="100%" stop-color="#8b5cf6" />
  `;
    defs.appendChild(gradient);

    svg.appendChild(defs);
    svg.appendChild(bgCircle);
    svg.appendChild(circle);

    // Animate
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1s ease-out';
        circle.setAttribute('stroke-dashoffset', offset);
    }, 100);

    return svg;
}

// ============================================
// NUMBER COUNTER - Animated Count Up
// ============================================

export function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };

    toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${colors[type]};
    color: white;
    border-radius: 0.75rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-weight: 500;
    backdrop-filter: blur(10px);
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
