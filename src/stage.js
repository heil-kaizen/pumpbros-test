// ============================================================================
//  Stage — bright, inviting daytime park: sky, sun, drifting clouds, a
//  friendly city skyline, rolling hills with trees, and grassy platforms.
// ============================================================================
import { STAGE, GAME } from './config.js';

export class Stage {
  constructor() {
    this.t = 0;

    // drifting clouds (parallax)
    this.clouds = [];
    for (let i = 0; i < 7; i++) {
      this.clouds.push({
        x: Math.random() * GAME.WIDTH,
        y: 40 + Math.random() * 160,
        s: 0.7 + Math.random() * 0.9,   // scale
        spd: 0.12 + Math.random() * 0.22,
      });
    }

    // city skyline (mid-ground), generated once
    this.buildings = [];
    let bx = -20;
    while (bx < GAME.WIDTH + 40) {
      const w = 34 + Math.floor(Math.random() * 40);
      const h = 70 + Math.floor(Math.random() * 130);
      this.buildings.push({ x: bx, w, h, tone: 0.8 + Math.random() * 0.2 });
      bx += w + 6 + Math.floor(Math.random() * 14);
    }

    // background trees on the hills
    this.trees = [];
    for (let i = 0; i < 9; i++) {
      this.trees.push({ x: 40 + i * 105 + Math.random() * 40, s: 0.8 + Math.random() * 0.6 });
    }
  }

  update() { this.t++; }

  drawBg(ctx) {
    // --- sky ---
    const g = ctx.createLinearGradient(0, 0, 0, GAME.HEIGHT);
    g.addColorStop(0, '#5ea1ff'); // Bright sky blue
    g.addColorStop(0.55, '#c5e2ff');
    g.addColorStop(1, '#e6f3fa');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

    // --- bright sun ---
    const sunX = 120, sunY = 96;
    const halo = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 130);
    halo.addColorStop(0, 'rgba(255, 235, 100, 0.4)'); // soft yellow glow
    halo.addColorStop(1, 'rgba(255, 235, 100, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 320, 280);
    ctx.fillStyle = '#ffdf59';
    ctx.beginPath(); ctx.arc(sunX, sunY, 36, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff5a8';
    ctx.beginPath(); ctx.arc(sunX, sunY, 30, 0, Math.PI * 2); ctx.fill();

    // --- friendly city skyline ---
    const horizon = 350;
    for (const b of this.buildings) {
      const top = horizon - b.h;
      // body
      ctx.fillStyle = `rgba(${160 + Math.round(20 * b.tone)},${180 + Math.round(20 * b.tone)},${200 + Math.round(15 * b.tone)},0.9)`;
      ctx.fillRect(b.x, top, b.w, b.h);
      // top edge reflection
      ctx.fillStyle = '#fff';
      ctx.fillRect(b.x, top, b.w, 3);
      // windows
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
       for (let wy = top + 8; wy < horizon - 6; wy += 12) {
        for (let wx = b.x + 5; wx < b.x + b.w - 5; wx += 11) {
          if ((wx + wy + b.x) % 3 !== 0) ctx.fillRect(wx, wy, 5, 6);
        }
      }
    }

    // --- fluffy clouds ---
    for (const c of this.clouds) {
      c.x += c.spd;
      if (c.x > GAME.WIDTH + 70) c.x = -70;
      this.drawCloud(ctx, c.x, c.y, c.s);
    }

    // --- rolling green hills ---
    this.drawHills(ctx, horizon);

    // background trees
    for (const tr of this.trees) {
      this.drawTree(ctx, tr.x, horizon + 6, tr.s);
    }
  }

  drawCloud(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // white puffy clouds
    const puff = (dx, dy, r) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); ctx.fill(); };
    puff(0, 0, 18); puff(20, 4, 14); puff(-20, 4, 14); puff(8, -10, 13); puff(-10, -8, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(x - 26 * s, y + 2 * s, 54 * s, 12 * s);
  }

  drawHills(ctx, horizon) {
    // far hill
    ctx.fillStyle = '#6abe57';
    ctx.beginPath();
    ctx.moveTo(0, horizon + 20);
    for (let x = 0; x <= GAME.WIDTH; x += 20) {
      ctx.lineTo(x, horizon - 6 + Math.sin(x * 0.012) * 22);
    }
    ctx.lineTo(GAME.WIDTH, GAME.HEIGHT); ctx.lineTo(0, GAME.HEIGHT); ctx.closePath(); ctx.fill();
    
    // near hill (darker, ground fill)
    ctx.fillStyle = '#55a144';
    ctx.beginPath();
    ctx.moveTo(0, horizon + 36);
    for (let x = 0; x <= GAME.WIDTH; x += 20) {
      ctx.lineTo(x, horizon + 22 + Math.cos(x * 0.01 + 1) * 18);
    }
    ctx.lineTo(GAME.WIDTH, GAME.HEIGHT); ctx.lineTo(0, GAME.HEIGHT); ctx.closePath(); ctx.fill();
  }

  drawTree(ctx, x, y, s) {
    const w = 10 * s, h = 26 * s;
    // trunk
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x - w * 0.18, y - h * 0.5, w * 0.36, h * 0.6);
    // canopy
    ctx.fillStyle = '#32cd32';
    ctx.beginPath(); ctx.arc(x, y - h * 0.7, 16 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x - 12 * s, y - h * 0.55, 11 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 12 * s, y - h * 0.55, 11 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#228b22';
    ctx.beginPath(); ctx.arc(x - 4 * s, y - h * 0.85, 9 * s, 0, Math.PI * 2); ctx.fill();
  }

  drawPlatforms(ctx) {
    for (let i = 0; i < STAGE.platforms.length; i++) {
      const p = STAGE.platforms[i];
      if (p.passable) {
        // floating grassy ledge on a wooden base
        ctx.fillStyle = '#8b5a2b';            // wood
        ctx.fillRect(p.x, p.y + 4, p.w, p.h - 2);
        ctx.fillStyle = '#5a3a1b';
        ctx.fillRect(p.x, p.y + p.h, p.w, 4);
        ctx.fillStyle = '#7cfc00';            // bright grass
        ctx.fillRect(p.x, p.y, p.w, 6);
        ctx.fillStyle = '#32cd32';
        ctx.fillRect(p.x, p.y, p.w, 2);
        this.grassBlades(ctx, p.x, p.y, p.w, '#32cd32');
      } else {
        // main ground
        ctx.fillStyle = '#8b6a4f';            // dirt body
        ctx.fillRect(p.x, p.y, p.w, p.h);
        // dirt speckles
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        for (let gx = p.x + 10; gx < p.x + p.w; gx += 22) {
          for (let gy = p.y + 22; gy < p.y + p.h; gy += 20) {
            ctx.fillRect(gx + ((gy / 20) % 2) * 8, gy, 4, 4);
          }
        }
        // grass top
        ctx.fillStyle = '#7cfc00';
        ctx.fillRect(p.x, p.y, p.w, 12);
        ctx.fillStyle = '#32cd32';
        ctx.fillRect(p.x, p.y, p.w, 5);
        this.grassBlades(ctx, p.x, p.y, p.w, '#32cd32');
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(p.x, p.y + 12, p.w, 3);
      }
    }
  }

  grassBlades(ctx, x, y, w, color = '#7ad96a') {
    ctx.fillStyle = color;
    for (let gx = x + 6; gx < x + w - 4; gx += 14) {
      const sway = Math.sin(this.t * 0.06 + gx * 0.3) > 0 ? 1 : 0;
      ctx.fillRect(gx + sway, y - 3, 2, 3);
      ctx.fillRect(gx + 6 - sway, y - 2, 2, 2);
    }
  }
}
