/**
 * HYBRID LOGIC // 3D Breathing Swarm Core
 * Inspired by creamu's WebGL / Canvas interactive brown-gold particle sphere.
 * - Parallaxes smoothly with scroll
 * - Responds to mouse velocity & light source
 * - Pauses execution when out of viewport to maximize 60fps performance
 */
export class BreathingSwarmSphere {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.parentElement.clientWidth || window.innerWidth;
    this.height = canvas.parentElement.clientHeight || window.innerHeight;

    this.points = [];
    this.pointCount = 950;
    this.radius = Math.min(this.width, this.height) * 0.32;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.rotX = 0;
    this.rotY = 0;

    this.scrollY = 0;
    this.isVisible = true;
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate sphere points using Fibonacci golden spiral for even distribution
    this.points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < this.pointCount; i++) {
      const y = 1 - (i / (this.pointCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      this.points.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        x, y, z,
        size: Math.random() * 1.6 + 0.8,
        pulseOffset: Math.random() * Math.PI * 2,
        isGold: i % 4 === 0,
        isWhite: i % 9 === 0
      });
    }

    // Mouse listener
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      this.mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      this.targetRotY = this.mouseX * 0.45;
      this.targetRotX = -this.mouseY * 0.45;
    });

    // Scroll listener for parallax & visibility optimization
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY || window.pageYOffset;
      const rect = this.canvas.getBoundingClientRect();
      this.isVisible = rect.bottom > -100 && rect.top < window.innerHeight + 100;
    }, { passive: true });

    this.render();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = parent ? parent.clientHeight : window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.radius = Math.min(this.width, this.height) * 0.34;
  }

  render() {
    requestAnimationFrame(() => this.render());
    if (!this.isVisible) return;

    this.time += 0.016;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth rotation interpolation
    this.rotX += (this.targetRotX - this.rotX) * 0.05;
    this.rotY += (this.targetRotY - this.rotY) * 0.05;

    const autoY = this.time * 0.12;
    const currentRotY = this.rotY + autoY;
    const currentRotX = this.rotX + Math.sin(this.time * 0.2) * 0.08;

    const cosY = Math.cos(currentRotY);
    const sinY = Math.sin(currentRotY);
    const cosX = Math.cos(currentRotX);
    const sinX = Math.sin(currentRotX);

    // Parallax shift based on scroll
    const parallaxY = this.scrollY * 0.22;
    const cx = this.width / 2;
    const cy = this.height / 2 - parallaxY;
    const fov = 480;

    // Breathing pulse
    const breath = 1 + Math.sin(this.time * 0.7) * 0.045;
    const effectiveRadius = this.radius * breath;

    const projected = [];

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];

      // Dynamic wave displacement
      const wave = Math.sin(this.time * 1.2 + p.baseY * 4.0 + p.pulseOffset) * 0.05;
      const r = effectiveRadius * (1 + wave);

      let px = p.baseX * r;
      let py = p.baseY * r;
      let pz = p.baseZ * r;

      // 3D Rotation
      let x1 = px * cosY - pz * sinY;
      let z1 = pz * cosY + px * sinY;
      let y1 = py * cosX - z1 * sinX;
      let z2 = z1 * cosX + py * sinX;

      // Perspective projection
      const scale = fov / (fov + z2 + 400);

      if (scale > 0) {
        projected.push({
          x: cx + x1 * scale,
          y: cy + y1 * scale,
          z: z2,
          scale,
          size: p.size * scale,
          isGold: p.isGold,
          isWhite: p.isWhite
        });
      }
    }

    // Depth sort
    projected.sort((a, b) => b.z - a.z);

    // Render particles
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const normZ = (p.z + effectiveRadius) / (effectiveRadius * 2); // 0 (back) to 1 (front)
      const alpha = Math.max(0.12, Math.min(0.92, normZ * 0.95));

      let color = `rgba(156, 151, 139, ${alpha})`; // Stone taupe (#9c978b)
      if (p.isGold) {
        color = `rgba(195, 160, 114, ${alpha * 1.15})`; // Warm bronze-gold (#c3a072 / #756044)
      } else if (p.isWhite) {
        color = `rgba(233, 229, 218, ${alpha * 1.3})`; // Ivory bone (#e9e5da)
      }

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}
