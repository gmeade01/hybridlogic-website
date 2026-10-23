/**
 * STARLING QUANTITATIVE // Dossier Controller
 * Manages the slide-over specification monograph, keyboard accessibility,
 * camera focal shifts, and transmission link interactions.
 */
export class DossierController {
  constructor(swarmEngine, soundEngine, config) {
    this.swarm = swarmEngine;
    this.sound = soundEngine;
    this.config = config;

    this.isOpen = false;
    this.modalEl = document.getElementById('dossierModal');
    this.toggleBtn = document.getElementById('btnDossierToggle');
    this.closeBtn = document.getElementById('btnCloseDossier');

    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Keyboard ESC listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Populate email links dynamically from config
    const emailLinks = document.querySelectorAll('.js-email-link');
    emailLinks.forEach(link => {
      link.href = `mailto:${this.config.contactEmail}?subject=Starling%20Quantitative%20Dialogue`;
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.modalEl.classList.remove('translate-x-full');
    
    // Shift camera focal center to the left so swarm remains beautifully visible
    const isDesktop = window.innerWidth > 768;
    const shift = isDesktop ? -(window.innerWidth * 0.18) : 0;
    this.swarm.setCameraOffset(shift);

    this.sound.triggerChirp(620, 0.1);
  }

  close() {
    this.isOpen = false;
    this.modalEl.classList.add('translate-x-full');
    this.swarm.setCameraOffset(0);
    this.sound.triggerChirp(420, 0.08);
  }
}
