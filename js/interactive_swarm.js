/**
 * HYBRID LOGIC // Section 04: Interactive Swarm Consensus Simulator
 * Real-time visualization of cloud trading agents executing consensus,
 * order routing, and deterministic risk checks.
 */
export class InteractiveSwarmSimulator {
  constructor(canvas) {
    this.canvas = canvas;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.parentElement.clientWidth || 800;
    this.height = 360;
    this.nodes = [];
    this.packets = [];
    this.logEl = document.getElementById('simLogs');

    this.clusters = [
      { name: "CLUSTER_US_EAST (Equinix NY4)", x: 0.25, y: 0.5, color: "#c3a072" },
      { name: "CLUSTER_EU_WEST (Frankfurt FR2)", x: 0.50, y: 0.35, color: "#e9e5da" },
      { name: "CLUSTER_AP_EAST (Tokyo TY3)", x: 0.75, y: 0.55, color: "#9c978b" }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create 18 distributed trading micro-agents
    this.nodes = [];
    for (let c = 0; c < this.clusters.length; c++) {
      const cluster = this.clusters[c];
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dist = 48 + Math.random() * 24;
        this.nodes.push({
          clusterIndex: c,
          baseClusterX: cluster.x,
          baseClusterY: cluster.y,
          offsetX: Math.cos(angle) * dist,
          offsetY: Math.sin(angle) * dist,
          x: 0,
          y: 0,
          role: i === 0 ? "LEADER (Raft Arbiter)" : (i % 2 === 0 ? "RISK_VERIFIER" : "ORDER_ROUTER"),
          isLeader: i === 0,
          status: "SYNCED",
          pulse: Math.random() * Math.PI
        });
      }
    }

    // Interactive button
    const injectBtn = document.getElementById('btnInjectShock');
    if (injectBtn) {
      injectBtn.addEventListener('click', () => this.injectVolatilityShock());
    }

    this.render();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = 360;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  injectVolatilityShock() {
    this.log("[MARKET_EVENT] Extreme Volatility Spike injected across cross-venue book: +48.2 bps drift");
    
    // Spawn packets across clusters
    for (let i = 0; i < 12; i++) {
      const fromNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      const toNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      if (fromNode !== toNode) {
        this.packets.push({
          from: fromNode,
          to: toNode,
          progress: 0,
          speed: 0.04 + Math.random() * 0.03,
          type: "RISK_LOCK"
        });
      }
    }

    setTimeout(() => {
      this.log("[CONSENSUS] Raft Quorum verified 18/18 consensus in 4.2ms. Arbitrage executed with zero slippage.");
    }, 450);
  }

  log(text) {
    if (!this.logEl) return;
    const entry = document.createElement('div');
    entry.className = "text-[11px] font-mono leading-relaxed py-0.5 border-b border-[#24231f]/60";
    entry.innerHTML = `<span class="text-[#c3a072]">[${new Date().toISOString().substring(11, 23)}]</span> <span class="text-[#e9e5da]">${text}</span>`;
    this.logEl.insertBefore(entry, this.logEl.firstChild);
    while (this.logEl.children.length > 5) {
      this.logEl.removeChild(this.logEl.lastChild);
    }
  }

  render() {
    requestAnimationFrame(() => this.render());
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update node positions
    for (let node of this.nodes) {
      node.x = node.baseClusterX * this.width + node.offsetX;
      node.y = node.baseClusterY * this.height + node.offsetY;
      node.pulse += 0.03;
    }

    // Draw cluster boundary hulls & labels
    for (let c = 0; c < this.clusters.length; c++) {
      const cluster = this.clusters[c];
      const cx = cluster.x * this.width;
      const cy = cluster.y * this.height;

      this.ctx.strokeStyle = "rgba(117, 96, 68, 0.25)";
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      this.ctx.font = "10px sans-serif";
      this.ctx.fillStyle = "#9c978b";
      this.ctx.textAlign = "center";
      this.ctx.fillText(cluster.name, cx, cy - 88);
    }

    // Inter-cluster consensus mesh lines
    this.ctx.strokeStyle = "rgba(42, 40, 37, 0.9)";
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        if (a.clusterIndex === b.clusterIndex || (a.isLeader && b.isLeader)) {
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }

    // Draw & update flying consensus packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const pkt = this.packets[i];
      pkt.progress += pkt.speed;

      const px = pkt.from.x + (pkt.to.x - pkt.from.x) * pkt.progress;
      const py = pkt.from.y + (pkt.to.y - pkt.from.y) * pkt.progress;

      this.ctx.fillStyle = "#c3a072";
      this.ctx.beginPath();
      this.ctx.arc(px, py, 3, 0, Math.PI * 2);
      this.ctx.fill();

      if (pkt.progress >= 1) {
        this.packets.splice(i, 1);
      }
    }

    // Occasionally spawn ambient heartbeats
    if (Math.random() < 0.04 && this.packets.length < 6) {
      const from = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      const to = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      if (from !== to && from.clusterIndex === to.clusterIndex) {
        this.packets.push({ from, to, progress: 0, speed: 0.02, type: "SYNC" });
      }
    }

    // Draw Nodes
    for (let node of this.nodes) {
      const cluster = this.clusters[node.clusterIndex];
      const pulseSize = Math.sin(node.pulse) * 1.5;

      this.ctx.fillStyle = node.isLeader ? "#e9e5da" : cluster.color;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.isLeader ? 5.5 + pulseSize : 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      if (node.isLeader) {
        this.ctx.strokeStyle = "rgba(195, 160, 114, 0.6)";
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 10 + pulseSize * 2, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }
  }
}
