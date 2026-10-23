/**
 * STARLING QUANTITATIVE // 3D Particle Swarm & State Morphing Engine
 * High-performance 3D perspective engine with additive photon blending.
 */
export class SwarmEngine {
  constructor(canvas, soundEngine, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.soundEngine = soundEngine;
    this.config = config;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.particles = [];
    this.particleCount = config.particleCount || 1600;
    this.currentState = 0; // 0: Flux, 1: Consensus, 2: Singularity
    this.shockwaves = [];

    // Camera 3D Orbit & Inertia
    this.rotX = 0;
    this.rotY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseNormX = 0;
    this.mouseNormY = 0;

    // Viewport framing
    this.cameraOffsetX = 0; // Shifts focal center when dossier opens
    this.targetCameraOffsetX = 0;

    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create particles
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle(i));
    }

    this.setupInteractions();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticle(index) {
    // Distribute in a spherical volume
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * 290;

    const baseX = r * Math.sin(phi) * Math.cos(theta);
    const baseY = r * Math.sin(phi) * Math.sin(theta);
    const baseZ = r * Math.cos(phi);

    return {
      index,
      baseX,
      baseY,
      baseZ,
      x: baseX,
      y: baseY,
      z: baseZ,
      size: Math.random() * 1.8 + 0.8,
      speedOffset: Math.random() * 100,
      jetSpeed: Math.random() * 2 + 1,
      isJet: index % 14 === 0,
      hueVariation: Math.random()
    };
  }

  setupInteractions() {
    window.addEventListener('mousedown', (e) => {
      // Don't drag if clicking interactive HUD buttons
      if (e.target.closest('.hud-element')) return;
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseNormX = (e.clientX / this.width - 0.5) * 2;
      this.mouseNormY = (e.clientY / this.height - 0.5) * 2;

      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.targetRotY += dx * 0.0045;
        this.targetRotX += dy * 0.0045;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support for mobile / tablets
    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('.hud-element')) return;
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.targetRotY += dx * 0.005;
        this.targetRotX += dy * 0.005;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Click for Shockwave
    this.canvas.addEventListener('click', (e) => {
      const clickX = e.clientX - (this.width / 2 + this.cameraOffsetX);
      const clickY = e.clientY - (this.height / 2);
      this.triggerShockwave(clickX * 0.7, clickY * 0.7, 0);
    });
  }

  triggerShockwave(x, y, z) {
    this.shockwaves.push({
      x, y, z,
      radius: 5,
      maxRadius: 420,
      strength: 24
    });
    this.soundEngine.triggerShockwaveSub();
  }

  setState(stateIndex) {
    if (this.currentState === stateIndex) return;
    this.currentState = stateIndex;
    this.triggerShockwave(0, 0, 0);
    this.soundEngine.triggerStateTransition(stateIndex);
  }

  setCameraOffset(offsetX) {
    this.targetCameraOffsetX = offsetX;
  }

  updateParticles() {
    const t = this.time;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (this.currentState === 0) {
        // STATE 0: QUANTUM FLUX (Curl noise & organic breathing)
        const angle = t * 0.001 + p.speedOffset * 0.05;
        const radiusMultiplier = 1 + Math.sin(t * 0.002 + p.baseZ * 0.01) * 0.35;

        const targetX = p.baseX * radiusMultiplier + Math.cos(angle) * 45;
        const targetY = p.baseY * radiusMultiplier + Math.sin(angle) * 45;
        const targetZ = p.baseZ + Math.sin(t * 0.003 + p.baseX * 0.01) * 55;

        p.x += (targetX - p.x) * 0.04;
        p.y += (targetY - p.y) * 0.04;
        p.z += (targetZ - p.z) * 0.04;

      } else if (this.currentState === 1) {
        // STATE 1: TOPOLOGICAL CONSENSUS (Snap into hyper-dimensional lattice)
        const latticeSize = 135;
        const snapX = Math.round(p.baseX / latticeSize) * latticeSize;
        const snapY = Math.round(p.baseY / latticeSize) * latticeSize;
        const snapZ = Math.round(p.baseZ / latticeSize) * latticeSize;

        const oscillate = Math.sin(t * 0.004 + p.index) * 8;
        p.x += (snapX + oscillate - p.x) * 0.08;
        p.y += (snapY + oscillate - p.y) * 0.08;
        p.z += (snapZ + oscillate - p.z) * 0.08;

      } else if (this.currentState === 2) {
        // STATE 2: SYNTHETIC SINGULARITY (Relativistic accretion disk + polar jets)
        if (p.isJet) {
          // Polar particle jet along Y axis
          const jetDir = (p.index % 2 === 0 ? 1 : -1);
          const jetY = ((t * p.jetSpeed * 4 + p.index * 15) % 480) * jetDir;
          const spread = Math.abs(jetY) * 0.08;
          const jetX = (Math.random() - 0.5) * spread;
          const jetZ = (Math.random() - 0.5) * spread;

          p.x += (jetX - p.x) * 0.15;
          p.y += (jetY - p.y) * 0.15;
          p.z += (jetZ - p.z) * 0.15;
        } else {
          // Swirling equatorial accretion disk
          const ringRadius = 175 + Math.sin(t * 0.007 + p.index) * 22;
          const ringAngle = t * 0.0035 + (p.index / this.particleCount) * Math.PI * 4;
          const verticalSpike = (Math.random() - 0.5) * 24;

          const targetX = Math.cos(ringAngle) * ringRadius;
          const targetY = verticalSpike;
          const targetZ = Math.sin(ringAngle) * ringRadius;

          p.x += (targetX - p.x) * 0.09;
          p.y += (targetY - p.y) * 0.09;
          p.z += (targetZ - p.z) * 0.09;
        }
      }

      // Gravitational mouse perturbation (subtle cosmic displacement)
      const mouseDistX = p.x - this.mouseNormX * 180;
      const mouseDistY = p.y - this.mouseNormY * 180;
      const mDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);
      if (mDist < 120) {
        const mForce = (1 - mDist / 120) * 1.8;
        p.x += (mouseDistX / mDist) * mForce;
        p.y += (mouseDistY / mDist) * mForce;
      }

      // Propagate Shockwaves
      for (let s of this.shockwaves) {
        const dx = p.x - s.x;
        const dy = p.y - s.y;
        const dz = p.z - s.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const diff = Math.abs(dist - s.radius);
        if (diff < 45) {
          const force = (1 - diff / 45) * s.strength;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
          p.z += (dz / dist) * force;
        }
      }
    }
  }

  render() {
    this.time++;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth camera rotation
    this.rotX += (this.targetRotX - this.rotX) * 0.08;
    this.rotY += (this.targetRotY - this.rotY) * 0.08;
    this.targetRotY += this.config.autoRotateSpeed || 0.0012;

    // Smooth camera focal offset
    this.cameraOffsetX += (this.targetCameraOffsetX - this.cameraOffsetX) * 0.08;

    const cosX = Math.cos(this.rotX);
    const sinX = Math.sin(this.rotX);
    const cosY = Math.cos(this.rotY);
    const sinY = Math.sin(this.rotY);

    const fov = this.config.baseFov || 440;
    const cx = this.width / 2 + this.cameraOffsetX;
    const cy = this.height / 2;

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 8;
      sw.strength *= 0.94;
      if (sw.radius > sw.maxRadius || sw.strength < 0.2) {
        this.shockwaves.splice(i, 1);
      }
    }

    this.updateParticles();

    // 3D Projection
    const projected = [];
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.z * cosY + p.x * sinY;
      let y1 = p.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + p.y * sinX;

      const scale = fov / (fov + z2 + 420);
      if (scale > 0) {
        projected.push({
          p,
          sx: cx + x1 * scale,
          sy: cy + y1 * scale,
          scale,
          depth: z2
        });
      }
    }

    // Depth sort for authentic optical realism
    projected.sort((a, b) => b.depth - a.depth);

    // Screen blend mode for glowing photon aesthetics
    this.ctx.globalCompositeOperation = 'screen';

    // In Consensus mode: Draw active laser quorum connections
    if (this.currentState === 1) {
      this.ctx.lineWidth = 0.55;
      const linkLimit = Math.min(projected.length, 320);
      for (let i = 0; i < linkLimit; i += 3) {
        const a = projected[i];
        for (let j = i + 1; j < i + 4 && j < linkLimit; j++) {
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 50) {
            this.ctx.strokeStyle = `rgba(34, 211, 238, ${0.45 * (1 - d / 50)})`;
            this.ctx.beginPath();
            this.ctx.moveTo(a.sx, a.sy);
            this.ctx.lineTo(b.sx, b.sy);
            this.ctx.stroke();
          }
        }
      }
    }

    // Render particles
    for (let item of projected) {
      const p = item.p;
      const s = item.scale;
      const r = p.size * s * 1.6;

      const alpha = Math.min(1, Math.max(0.18, (item.depth + 420) / 840));
      let color = '#22d3ee';

      if (this.currentState === 0) {
        color = (p.index % 3 === 0)
          ? `rgba(168, 85, 247, ${alpha})`
          : `rgba(34, 211, 238, ${alpha})`;
      } else if (this.currentState === 1) {
        color = (p.index % 5 === 0)
          ? `rgba(255, 255, 255, ${alpha * 1.3})`
          : `rgba(56, 189, 248, ${alpha})`;
      } else if (this.currentState === 2) {
        if (p.isJet) {
          color = `rgba(255, 255, 255, ${alpha * 1.4})`;
        } else {
          color = (p.index % 4 === 0)
            ? `rgba(244, 63, 94, ${alpha})`
            : `rgba(245, 158, 11, ${alpha})`;
        }
      }

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(item.sx, item.sy, r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(() => this.render());
  }
}
