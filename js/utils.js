/**
 * FrameQuest Utilities
 */

/**
 * Escapes HTML special characters to prevent rendering problems and code injection.
 * @param {string} string 
 * @returns {string}
 */
export function escapeHtml(string) {
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Custom Canvas Confetti Engine for Level and Game Completion.
 * High performance, zero dependencies.
 */
export function triggerConfetti() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });

    const colors = [
        '#00d8ff', // React Cyan
        '#42b883', // Vue Green
        '#dd0031', // Angular Red
        '#5fa04e', // Node Green
        '#f59e0b', // Gold
        '#a855f7'  // Purple
    ];

    const particles = [];
    const particleCount = 120;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height - 20;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 5;
            this.size = Math.random() * 8 + 6;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 4 + 3;
            this.speedX = (Math.random() - 0.5) * 2;
            this.opacity = 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > height) {
                this.opacity -= 0.02;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            // Draw rectangle confetti particle
            ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let animationFrameId;
    function render() {
        ctx.clearRect(0, 0, width, height);

        let activeParticles = 0;
        particles.forEach(p => {
            if (p.opacity > 0) {
                p.update();
                p.draw();
                activeParticles++;
            }
        });

        if (activeParticles > 0) {
            animationFrameId = requestAnimationFrame(render);
        } else {
            // Clean up when animation is finished
            ctx.clearRect(0, 0, width, height);
            cancelAnimationFrame(animationFrameId);
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    }

    render();
}
