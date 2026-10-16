/**
 * HYBRID LOGIC // Main Orchestration Engine
 * - Lenis Smooth Inertial Scrolling
 * - 3D Breathing Swarm Core
 * - Interactive Trading Swarm Simulator
 * - Scroll-Driven Element Reveals
 * - Dynamic Configuration Binding
 */
import { CONFIG } from './config.js';
import { BreathingSwarmSphere } from './sphere.js';
import { InteractiveSwarmSimulator } from './interactive_swarm.js';

class App {
  constructor() {
    this.initLenis();
    this.initSphere();
    this.initSimulator();
    this.initScrollReveals();
    this.bindConfig();
  }

  initLenis() {
    if (typeof window.Lenis !== 'undefined') {
      const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      // Connect Lenis to smooth anchor clicks
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            lenis.scrollTo(target, { offset: -60 });
          }
        });
      });
    }
  }

  initSphere() {
    const canvas = document.getElementById('sphereCanvas');
    if (canvas) {
      new BreathingSwarmSphere(canvas);
    }
  }

  initSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (canvas) {
      new InteractiveSwarmSimulator(canvas);
    }
  }

  initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    reveals.forEach(el => observer.observe(el));

    // Also observe all section headings and cards for subtle entrance
    const sections = document.querySelectorAll('.sec-grid');
    sections.forEach(sec => {
      sec.classList.add('reveal-on-scroll');
      observer.observe(sec);
    });
  }

  bindConfig() {
    // Email Links
    const emailLinks = document.querySelectorAll('.js-email-link');
    emailLinks.forEach(link => {
      link.href = `mailto:${CONFIG.contactEmail}?subject=Hybrid%20Logic%20Inquiry`;
    });

    // LinkedIn Links
    const linkedInLinks = document.querySelectorAll('.js-linkedin-link');
    linkedInLinks.forEach(link => {
      link.href = CONFIG.linkedInUrl;
    });
  }
}

// Bootstrap once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
