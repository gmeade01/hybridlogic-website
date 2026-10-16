# HYBRID LOGIC // Autonomous Swarm Architecture

A bespoke, full-screen creative technology web installation built for the **Hybrid Logic** agentic coding swarm project. 

Engineered with GPU-accelerated 3D mathematical particle swarms, volumetric depth sorting, direct physics manipulation, an ambient generative Web Audio synthesizer, and anti-AI editorial typography.

---

## ⚡ Quick Local Preview

You can run this immediately without installing Node or NPM using Python's built-in static server:

```powershell
# Inside c:\AI\AntiGravity\HybridLogicWebsite
python -m http.server 3000
```

Then open your browser to:
👉 **`http://localhost:3000`**

---

## ⚙️ How to Customize Your Info

Open [`js/config.js`](./js/config.js) and update your personal details:

```javascript
export const CONFIG = {
  projectName: "HYBRID LOGIC",
  tagline: "Autonomous Swarm Architecture",
  
  // Update with your real contact details
  contactEmail: "yourname@gmail.com",     // Your real email address
  linkedInUrl: "https://linkedin.com/in/...", // Your LinkedIn profile
  gitHubUrl: "https://github.com/...",    // Your GitHub repository or profile
};
```

All email buttons and links automatically update across the site.

---

## 🚀 60-Second Free Deployment Options

Because this is a zero-dependency static web application, it deploys anywhere instantly with zero build step failures.

### Option 1: GitHub Pages (Recommended)
1. Initialize a git repository and push to GitHub:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Hybrid Logic creative installation"
   git branch -M main
   git remote add origin https://github.com/<your-username>/hybrid-logic.git
   git push -u origin main
   ```
2. In your GitHub repository, go to **Settings** → **Pages** → Source: **Deploy from a branch (`main` / root)**.
3. Your site is live at `https://<your-username>.github.io/hybrid-logic`. You can attach a custom domain (e.g. `hybridlogic.ai` or `hybridlogic.dev`) with one click in the GitHub Pages settings.

### Option 2: Vercel
1. Install or visit [vercel.com](https://vercel.com).
2. Click **Add New Project** → Import your GitHub repository (or run `npx vercel` in this folder).
3. Framework Preset: **Other** / Output Directory: `./`.
4. Click **Deploy**. Done in 5 seconds.

### Option 3: Cloudflare Pages
1. Go to Cloudflare Dashboard → Workers & Pages → Create Application → Pages.
2. Connect your Git repository. Build command: (leave empty), Build output: `/`.
3. Instant global edge deployment with free SSL and custom domain.

---

## 🎨 Creative Architecture & Typography

* **Typography**:
  * **Instrument Serif (Italic)**: High-fashion, human-crafted editorial serif for literary depth.
  * **Syne**: Sculptural, wide geometric display for brutalist tech presence.
  * **Space Mono**: Disciplined monospace for telemetry and system parameters.
* **Simulation Core (`js/swarm.js`)**:
  * 1,600 individual 3D projected nodes with depth-sorting and screen-blend photon shaders.
  * 3 Morphing States:
    * `01 // FLUX`: Dispersed organic curl-noise field.
    * `02 // CONSENSUS`: Hyper-dimensional crystal lattice with live laser linkages.
    * `03 // SINGULARITY`: Relativistic accretion disk with polar relativistic particle jets.
  * Click anywhere to fire propagating 3D gravitational shockwaves.
  * Drag to orbit the camera with weighted rotational momentum.
* **Sound Engine (`js/audio.js`)**:
  * Pure code-generated ambient drones using the Web Audio API. Zero MP3 assets needed.
  * Sub-bass impact oscillator triggered on shockwave clicks.
  * Chord progressions corresponding to swarm state transitions.
