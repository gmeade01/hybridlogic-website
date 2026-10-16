/**
 * HYBRID LOGIC // Generative Ambient Audio Synthesizer
 * Built entirely with Web Audio API. Zero external audio assets required.
 */
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.droneNodes = [];
    this.filterNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm Low-Pass Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(280, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);
    this.filterNode.connect(this.masterGain);

    this.startAmbientDrones();
  }

  startAmbientDrones() {
    // Cinematic root frequencies (A1, E2, A2 - 55Hz, 82.5Hz, 110Hz)
    const freqs = [55.0, 82.4, 110.0, 164.81];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle detune for analog chorus warmth
      osc.detune.setValueAtTime((idx - 1.5) * 6, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08 / (idx + 1), this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start();

      this.droneNodes.push({ osc, gain });
    });
  }

  toggleSound() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.4);
    } else {
      this.masterGain.gain.setTargetAtTime(0.22, this.ctx.currentTime, 0.8);
      this.triggerChirp(440, 0.1);
    }

    return !this.isMuted;
  }

  triggerShockwaveSub() {
    if (this.isMuted || !this.ctx) return;
    
    // Sub-bass impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  triggerStateTransition(stateIndex) {
    if (this.isMuted || !this.ctx) return;
    
    const chords = [
      [220, 277.18, 329.63], // Flux (A Major)
      [220, 261.63, 329.63], // Consensus (A Minor)
      [164.81, 220, 311.13]  // Singularity (Diminished tension)
    ];

    const notes = chords[stateIndex] || chords[0];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, now + idx * 0.04);

      gain.gain.setValueAtTime(0.05, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + 0.7);
    });
  }

  triggerChirp(freq = 880, duration = 0.08) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + duration);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }
}
