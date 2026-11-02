/**
 * Motor ligero de Confeti en Canvas para celebración de resultados.
 */

class ConfettiCannon {
  constructor(canvasId = 'confetti-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationId = null;
    this.colors = ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#10b981', '#34d399', '#60a5fa', '#facc15'];

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    return {
      x: x || this.canvas.width / 2,
      y: y || this.canvas.height / 3,
      size: Math.random() * 10 + 6,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.22,
      decay: Math.random() * 0.008 + 0.005,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    };
  }

  fire(durationMs = 4000) {
    if (!this.canvas) {
      this.canvas = document.getElementById('confetti-canvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
      } else {
        return;
      }
    }

    this.resize();
    const startTime = Date.now();

    // Ráfaga inicial izquierda y derecha
    for (let i = 0; i < 90; i++) {
      this.particles.push(this.createParticle(this.canvas.width * 0.2, this.canvas.height * 0.4));
      this.particles.push(this.createParticle(this.canvas.width * 0.8, this.canvas.height * 0.4));
      this.particles.push(this.createParticle(this.canvas.width * 0.5, this.canvas.height * 0.3));
    }

    const interval = setInterval(() => {
      if (Date.now() - startTime > durationMs) {
        clearInterval(interval);
        return;
      }
      for (let i = 0; i < 20; i++) {
        this.particles.push(this.createParticle(Math.random() * this.canvas.width, this.canvas.height * 0.1));
      }
    }, 250);

    if (!this.animationId) {
      this.render();
    }
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  stop() {
    this.particles = [];
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.confettiCannon = new ConfettiCannon();
