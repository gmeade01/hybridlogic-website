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
    this.initMetrics();
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

  initMetrics() {
    const metrics = CONFIG.metrics;
    if (!metrics) return;

    const tradeCount = (typeof metrics.totalTrades === 'number') ? metrics.totalTrades : 1428;
    const elTrades = document.getElementById('metricTotalTrades');
    const elAlpha = document.getElementById('metricCumulativeAlpha');
    const elVsSpy = document.getElementById('metricVsSpy');
    const elSharpe = document.getElementById('metricSharpeRatio');
    const elClock = document.getElementById('metricLiveClock');
    const elIncrement = document.getElementById('metricTradeIncrement');
    const elSpySub = document.getElementById('metricSpySub');

    if (elAlpha && metrics.cumulativeAlpha) elAlpha.innerText = metrics.cumulativeAlpha;
    if (elVsSpy && metrics.alphaVsSpy) elVsSpy.innerText = metrics.alphaVsSpy;
    if (elSharpe && metrics.sharpeRatio) elSharpe.innerText = metrics.sharpeRatio;
    if (elSpySub && metrics.spyMultiplier) elSpySub.innerText = metrics.spyMultiplier;

    // Smooth count-up animation for total trades on load
    if (elTrades) {
      if (tradeCount > 0) {
        const duration = 1600;
        const start = Math.floor(tradeCount * 0.88);
        const startTime = performance.now();

        const animateCount = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
          const current = Math.floor(start + (tradeCount - start) * ease);
          elTrades.innerText = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(animateCount);
          } else {
            elTrades.innerText = tradeCount.toLocaleString();
          }
        };
        requestAnimationFrame(animateCount);
      } else {
        elTrades.innerText = tradeCount.toLocaleString();
      }
    }

    // Trade status label
    if (elIncrement) {
      if (metrics.tradeNote) {
        elIncrement.innerText = metrics.tradeNote;
      } else {
        elIncrement.innerText = 'Continuous multi-venue order fills • T+0 DMA';
      }
    }

    // Live UTC Clock
    const updateClock = () => {
      if (elClock) {
        const d = new Date();
        elClock.innerText = d.toISOString().substring(11, 19) + ' UTC';
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
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
