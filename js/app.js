/**
 * HYBRID LOGIC // Main Application Orchestrator
 */
import { CONFIG } from './config.js';
import { SoundEngine } from './audio.js';
import { SwarmEngine } from './swarm.js';
import { DossierController } from './dossier.js';

class App {
  constructor() {
    this.canvas = document.getElementById('coreCanvas');
    this.sound = new SoundEngine();
    this.swarm = new SwarmEngine(this.canvas, this.sound, CONFIG);
    this.dossier = new DossierController(this.swarm, this.sound, CONFIG);

    // UI Elements
    this.hudCoords = document.getElementById('hudCoords');
    this.hudEntropy = document.getElementById('hudEntropy');
    this.hudStateName = document.getElementById('hudStateName');
    this.kineticBgText = document.getElementById('kineticBgText');
    this.hintOverlay = document.getElementById('hintOverlay');
    this.audioToggleBtn = document.getElementById('btnAudioToggle');
    this.audioIcon = document.getElementById('audioIcon');
    this.audioLabel = document.getElementById('audioLabel');
    this.freqBars = document.getElementById('freqBars');

    this.stateNames = [
      "01 // QUANTUM FLUX (DISPERSED REASONING)",
      "02 // TOPOLOGICAL CONSENSUS (GEOMETRIC SYNTHESIS)",
      "03 // SYNTHETIC SINGULARITY (DENSE EXECUTION)"
    ];

    this.init();
  }

  init() {
    this.setupStateButtons();
    this.setupAudioToggle();
    this.setupTelemetryLoop();
    this.setupMagneticButtons();
    this.setupHintDismiss();

    // Start rendering the 3D swarm
    this.swarm.render();
  }

  setupStateButtons() {
    for (let i = 0; i < 3; i++) {
      const btn = document.getElementById(`btnState${i}`);
      if (!btn) continue;
      btn.addEventListener('click', () => this.switchState(i));
    }
  }

  switchState(stateIndex) {
    this.swarm.setState(stateIndex);
    this.hudStateName.innerText = this.stateNames[stateIndex];

    // Update button visual styles
    for (let i = 0; i < 3; i++) {
      const btn = document.getElementById(`btnState${i}`);
      if (!btn) continue;
      if (i === stateIndex) {
        btn.className = "px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20 font-code";
      } else {
        btn.className = "px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all text-slate-400 hover:text-white border border-transparent font-code";
      }
    }

    // Kinetic typography kerning morph
    if (stateIndex === 0) {
      this.kineticBgText.style.letterSpacing = "-0.05em";
      this.kineticBgText.style.opacity = "0.09";
    } else if (stateIndex === 1) {
      this.kineticBgText.style.letterSpacing = "0.12em";
      this.kineticBgText.style.opacity = "0.18";
    } else if (stateIndex === 2) {
      this.kineticBgText.style.letterSpacing = "-0.1em";
      this.kineticBgText.style.opacity = "0.06";
    }
  }

  setupAudioToggle() {
    if (!this.audioToggleBtn) return;
    this.audioToggleBtn.addEventListener('click', () => {
      const isUnmuted = this.sound.toggleSound();
      if (isUnmuted) {
        this.audioToggleBtn.classList.remove('text-slate-500', 'border-slate-800');
        this.audioToggleBtn.classList.add('text-cyan-300', 'border-cyan-500/40', 'bg-cyan-500/10');
        this.audioLabel.innerText = "SOUND: ON";
        this.audioIcon.classList.add('animate-pulse');
      } else {
        this.audioToggleBtn.classList.remove('text-cyan-300', 'border-cyan-500/40', 'bg-cyan-500/10');
        this.audioToggleBtn.classList.add('text-slate-500', 'border-slate-800');
        this.audioLabel.innerText = "SOUND: OFF";
        this.audioIcon.classList.remove('animate-pulse');
      }
    });
  }

  setupHintDismiss() {
    const dismiss = () => {
      if (this.hintOverlay) {
        this.hintOverlay.style.opacity = '0';
      }
    };
    window.addEventListener('mousedown', dismiss, { once: true });
    window.addEventListener('touchstart', dismiss, { once: true });
  }

  setupTelemetryLoop() {
    let frame = 0;
    const update = () => {
      frame++;

      // Update cursor coordinates
      if (this.hudCoords) {
        this.hudCoords.innerText = `X: ${this.swarm.mouseNormX.toFixed(2)} | Y: ${this.swarm.mouseNormY.toFixed(2)}`;
      }

      // Update entropy & simulated frequency bars every 15 frames
      if (frame % 15 === 0) {
        if (this.hudEntropy) {
          const entropy = (0.014 + Math.random() * 0.006).toFixed(4);
          this.hudEntropy.innerText = `${entropy} \u03c3`;
        }

        if (this.freqBars && !this.sound.isMuted) {
          const bars = this.freqBars.children;
          for (let b of bars) {
            b.style.height = `${Math.floor(Math.random() * 18 + 4)}px`;
          }
        } else if (this.freqBars && this.sound.isMuted) {
          const bars = this.freqBars.children;
          for (let b of bars) {
            b.style.height = '3px';
          }
        }
      }

      requestAnimationFrame(update);
    };
    update();
  }

  setupMagneticButtons() {
    const magneticEls = document.querySelectorAll('.js-magnetic');
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }
}

// Bootstrap once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
