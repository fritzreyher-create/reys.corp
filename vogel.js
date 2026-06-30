const canvas = document.getElementById('szene');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let t = 0;

const sterne = Array.from({length: 26}, () => ({
  x: Math.random(), y: Math.random() * 0.62,
  r: 0.5 + Math.random() * 1.1,
  phase: Math.random() * Math.PI * 2
}));

function drawBackground() {
  const W = canvas.width, H = canvas.height;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0,   '#06080f');
  sky.addColorStop(0.45,'#0e1520');
  sky.addColorStop(0.78,'#182030');
  sky.addColorStop(1,   '#1e2c3a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  sterne.forEach(s => {
    ctx.globalAlpha = 0.28 + 0.38 * Math.sin(t * 0.45 + s.phase);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  const mx = W * 0.82, my = H * 0.16;
  const mg = ctx.createRadialGradient(mx, my, 18, mx, my, 120);
  mg.addColorStop(0, 'rgba(238,222,160,0.16)');
  mg.addColorStop(0.45, 'rgba(215,200,140,0.05)');
  mg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, 120, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#e6d696'; ctx.beginPath(); ctx.arc(mx, my, 29, 0, Math.PI*2); ctx.fill();
  [[mx-8,my-7,4.5],[mx+9,my+5,3],[mx+1,my-13,2.2]].forEach(([cx,cy,r]) => {
    ctx.fillStyle='rgba(155,138,78,0.28)'; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  });
  ctx.fillStyle = '#0e1520'; ctx.beginPath(); ctx.arc(mx+15, my-4, 25, 0, Math.PI*2); ctx.fill();

  const fog = ctx.createLinearGradient(0, H*0.76, 0, H);
  fog.addColorStop(0,'rgba(148,172,198,0)');
  fog.addColorStop(1,'rgba(148,172,198,0.08)');
  ctx.fillStyle = fog; ctx.fillRect(0, H*0.76, W, H*0.24);
}

// Einzelne realistische Feder zeichnen
function feather(x, y, len, angle, wid, col1, col2, windPhase) {
  const flutter = 0.018 * Math.sin(t * 1.8 + windPhase);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + flutter);

  // Fahnen
  const g = ctx.createLinearGradient(0, 0, -wid * 0.6, len);
  g.addColorStop(0, col1);
  g.addColorStop(1, col2);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-wid*0.5, len*0.25, -wid*0.7, len*0.6, -wid*0.4 + 1.2*Math.sin(t*1.5+windPhase), len);
  ctx.bezierCurveTo(-wid*0.1, len*0.7, wid*0.15, len*0.35, 0, 0);
  ctx.fill();

  // Kiel
  ctx.strokeStyle = 'rgba(30,28,24,0.55)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.bezierCurveTo(wid*0.05, len*0.4, wid*0.02, len*0.7, -wid*0.05, len);
  ctx.stroke();

  ctx.restore();
}

function drawHeron() {
  const W = canvas.width, H = canvas.height;
  const cx = W * 0.5, cy = H * 0.47;

  // Sanftes Gleiten — sehr leichte vertikale Bewegung
  const glide = Math.sin(t * 0.28) * 7;
  // Minimales Flügel-Atmen (Gleitflug: Flügel fast still, nur hauch Bewegung)
  const breathe = 0.04 * Math.sin(t * 0.32);
  // Wind-Rascheln auf Federn
  const wind = t;

  ctx.save();
  ctx.translate(cx, cy + glide);

  // Skalierung: Reiher soll groß und majestätisch füllen
  const S = Math.min(W, H) / 440;
  ctx.scale(S, S);

  // ══════════════════════════════════════
  // LINKER FLÜGEL (vom Betrachter aus links = Flügelunterseite sichtbar)
  // ══════════════════════════════════════

  // Linker Flügel Grundform — hellblau-grau, leicht durchscheinend
  // Im Foto: linker Flügel nach oben, Unterseite sichtbar = sehr hell
  ctx.save();
  ctx.rotate(breathe - 0.05);

  // Hauptfläche linker Flügel (Unterseite, sehr hell)
  ctx.beginPath();
  ctx.moveTo(-15, -5);
  ctx.bezierCurveTo(-50, -55, -110, -95, -165, -88);
  ctx.bezierCurveTo(-145, -60, -100, -30, -15, 5);
  ctx.closePath();
  const lgLeft = ctx.createLinearGradient(-15, -10, -165, -88);
  lgLeft.addColorStop(0, 'rgba(185,195,215,0.96)');
  lgLeft.addColorStop(0.45, 'rgba(168,182,210,0.93)');
  lgLeft.addColorStop(1, 'rgba(140,158,188,0.88)');
  ctx.fillStyle = lgLeft;
  ctx.fill();

  // Sekundäre Schwungfedern links (heller Bereich, gut sichtbar im Foto)
  for (let i = 0; i < 12; i++) {
    const frac = i / 11;
    const bx = -18 - frac * 130;
    const by = -8 - frac * 72 - breathe * 30;
    const angle = -1.4 + frac * 0.3;
    const len = 38 + Math.sin(frac * Math.PI) * 18;
    feather(bx, by, len, angle, 14,
      `rgba(${165+frac*8},${178+frac*5},${208-frac*15},0.92)`,
      `rgba(${130+frac*10},${145+frac*8},${175-frac*12},0.82)`,
      i * 0.7 + wind
    );
  }

  // Primäre Schwungfedern links (dunkel, äußerster Rand)
  for (let i = 0; i < 10; i++) {
    const frac = i / 9;
    const bx = -148 - frac * 30;
    const by = -85 + frac * 25 - breathe * 20;
    const angle = -0.9 + frac * 0.6;
    const len = 52 + Math.sin(frac * Math.PI) * 20;
    feather(bx, by, len, angle, 11,
      `rgba(${55+frac*30},${62+frac*28},${82+frac*20},0.94)`,
      `rgba(${30+frac*20},${35+frac*18},${52+frac*15},0.88)`,
      i * 0.5 + wind + 2
    );
  }

  ctx.restore();

  // ══════════════════════════════════════
  // RECHTER FLÜGEL (Oberseite sichtbar = dunkler, blaugrau)
  // ══════════════════════════════════════

  ctx.save();
  ctx.rotate(-breathe + 0.04);

  // Hauptfläche rechter Flügel (Oberseite)
  ctx.beginPath();
  ctx.moveTo(-10, -3);
  ctx.bezierCurveTo(30, -50, 100, -90, 158, -80);
  ctx.bezierCurveTo(138, -55, 85, -22, -10, 6);
  ctx.closePath();
  const lgRight = ctx.createLinearGradient(-10, -5, 158, -80);
  lgRight.addColorStop(0, 'rgba(158,170,195,0.95)');
  lgRight.addColorStop(0.4, 'rgba(135,150,178,0.92)');
  lgRight.addColorStop(0.75, 'rgba(105,120,155,0.90)');
  lgRight.addColorStop(1, 'rgba(72,85,118,0.88)');
  ctx.fillStyle = lgRight;
  ctx.fill();

  // Deckfedern rechter Flügel (Reihen von Federn, typisches Schuppenmuster)
  for (let row = 0; row < 4; row++) {
    const rowFrac = row / 3;
    const startX = -5 + row * 8;
    const startY = -5 - row * 18;
    const count = 10 - row;
    for (let i = 0; i < count; i++) {
      const frac = i / (count - 1);
      const fx = startX + frac * (130 + row * 8);
      const fy = startY - frac * (58 + row * 4);
      const angle = -1.1 + frac * 0.4 + rowFrac * 0.2;
      const len = 28 - row * 4 + Math.sin(frac * Math.PI) * 8;
      const dark = 80 + rowFrac * 40;
      feather(fx, fy, len, angle, 10 - row,
        `rgba(${130-row*12},${145-row*10},${175-row*15},0.88)`,
        `rgba(${dark},${dark+12},${dark+35},0.80)`,
        i * 0.4 + row * 1.2 + wind
      );
    }
  }

  // Primäre Schwungfedern rechts (sehr dunkel, fast schwarz)
  for (let i = 0; i < 10; i++) {
    const frac = i / 9;
    const bx = 120 + frac * 42;
    const by = -72 + frac * 28;
    const angle = -1.05 + frac * 0.5;
    const len = 55 + Math.sin(frac * Math.PI) * 22;
    feather(bx, by, len, angle, 12,
      `rgba(${48+frac*22},${55+frac*20},${75+frac*18},0.95)`,
      `rgba(${25+frac*15},${30+frac*14},${48+frac*12},0.90)`,
      i * 0.6 + wind + 1
    );
  }

  ctx.restore();

  // ══════════════════════════════════════
  // KÖRPER
  // ══════════════════════════════════════

  // Rücken (blaugrau)
  const bodyG = ctx.createLinearGradient(-55, -18, 30, 22);
  bodyG.addColorStop(0, '#8898b0');
  bodyG.addColorStop(0.5, '#9aaabe');
  bodyG.addColorStop(1, '#788898');
  ctx.fillStyle = bodyG;
  ctx.strokeStyle = 'rgba(25,30,42,0.4)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.ellipse(-18, 2, 58, 15, -0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Schwarzer Schulterfleck (sehr markant im Foto)
  ctx.fillStyle = 'rgba(14,14,22,0.82)';
  ctx.beginPath();
  ctx.ellipse(-8, -12, 18, 8, -0.35, 0, Math.PI * 2);
  ctx.fill();

  // Brust/Bauch (weiß-hellgrau)
  const brustG = ctx.createLinearGradient(-5, -10, 25, 25);
  brustG.addColorStop(0, 'rgba(232,235,242,0.9)');
  brustG.addColorStop(1, 'rgba(195,202,218,0.8)');
  ctx.fillStyle = brustG;
  ctx.beginPath();
  ctx.ellipse(8, 7, 30, 12, 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Schwarze Längsstreifen Brust (charakteristisch)
  ctx.strokeStyle = 'rgba(14,14,22,0.6)';
  ctx.lineWidth = 1.3;
  for (let i = -1; i <= 1; i++) {
    const wx = 0.8 * Math.sin(t * 1.1 + i);
    ctx.beginPath();
    ctx.moveTo(8 + i * 6, -2);
    ctx.bezierCurveTo(8 + i*5 + wx, 6, 7 + i*4 + wx, 14, 6 + i*3, 20);
    ctx.stroke();
  }

  // Schmuckfedern Brust (hängen locker, bewegen sich im Wind)
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const bx = 18 - i * 7;
    const flutter = 2.5 * Math.sin(t * 1.3 + i * 0.9);
    ctx.strokeStyle = `rgba(215,220,232,${0.55 + i*0.05})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bx, 5);
    ctx.bezierCurveTo(bx + flutter*0.4, 14, bx - 1 + flutter*0.6, 22, bx + flutter, 30);
    ctx.stroke();
  }

  // Schwanz
  ctx.fillStyle = '#7888a0';
  ctx.strokeStyle = 'rgba(25,30,42,0.35)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-70, 8);
  ctx.bezierCurveTo(-95, 4, -120, 8, -132, 20);
  ctx.bezierCurveTo(-118, 24, -94, 22, -70, 18);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,48,62,0.38)';
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(-76 - i*9, 12);
    ctx.lineTo(-88 - i*7, 20);
    ctx.stroke();
  }

  // ══════════════════════════════════════
  // HALS (S-Bogen, eingezogen)
  // ══════════════════════════════════════

  // Äußere Halskontur
  ctx.lineWidth = 13;
  ctx.strokeStyle = '#a8b4c2';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(18, -12);
  ctx.bezierCurveTo(34, -16, 40, -32, 32, -46);
  ctx.bezierCurveTo(26, -56, 20, -60, 16, -66);
  ctx.stroke();

  // Hals-Highlight (weißer Mittelstreifen)
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(228,232,242,0.75)';
  ctx.beginPath();
  ctx.moveTo(20, -13);
  ctx.bezierCurveTo(36, -17, 42, -33, 34, -47);
  ctx.bezierCurveTo(28, -57, 22, -61, 18, -67);
  ctx.stroke();

  // Halsstreifen vorne (schwarz-weiß gemustert)
  ctx.strokeStyle = 'rgba(14,14,22,0.5)';
  ctx.lineWidth = 1.1;
  for (let i = 0; i < 6; i++) {
    const ht = i / 5;
    const hx = 22 + ht * 8;
    const hy = -16 - ht * 44;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + 4, hy + 5);
    ctx.stroke();
  }

  // ══════════════════════════════════════
  // KOPF
  // ══════════════════════════════════════

  // Kopf Grundform
  ctx.fillStyle = '#d8dce8';
  ctx.strokeStyle = 'rgba(20,20,32,0.55)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.ellipse(20, -72, 14, 9.5, -0.12, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Weißer Oberkopf/Stirn
  ctx.fillStyle = '#eceef6';
  ctx.beginPath();
  ctx.ellipse(20, -75, 9, 5.5, -0.12, 0, Math.PI * 2);
  ctx.fill();

  // Breiter schwarzer Augenstreifen (sehr markant!)
  ctx.fillStyle = '#0e0e1a';
  ctx.beginPath();
  ctx.ellipse(16, -74, 10, 3.8, -0.18, 0, Math.PI * 2);
  ctx.fill();

  // Langer Federbusch nach hinten (bewegt sich leicht)
  const bw = 0.022 * Math.sin(t * 1.1);
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.lineWidth = 1.6 - i * 0.4;
    ctx.strokeStyle = `rgba(10,10,20,${0.9 - i*0.15})`;
    ctx.save();
    ctx.rotate(bw + i * 0.04 - 0.04);
    ctx.beginPath();
    ctx.moveTo(12, -79);
    ctx.bezierCurveTo(-2 - i*3, -88, -14 - i*4, -92, -26 - i*5, -88);
    ctx.stroke();
    ctx.restore();
  }

  // Gelbes Auge
  ctx.fillStyle = '#d49520';
  ctx.beginPath(); ctx.arc(24, -72, 4.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#b07818';
  ctx.beginPath(); ctx.arc(24, -72, 3.0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#080608';
  ctx.beginPath(); ctx.arc(24.3, -72, 1.8, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.beginPath(); ctx.arc(25, -72.9, 0.85, 0, Math.PI*2); ctx.fill();

  // ══════════════════════════════════════
  // SCHNABEL (lang, gerade, gelblich)
  // ══════════════════════════════════════
  ctx.fillStyle = '#c8a030';
  ctx.strokeStyle = '#7a5e14';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(30, -74);
  ctx.lineTo(82, -70);
  ctx.lineTo(30, -68);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#a07820';
  ctx.beginPath();
  ctx.moveTo(30, -74);
  ctx.lineTo(82, -70);
  ctx.lineTo(30, -72);
  ctx.closePath();
  ctx.fill();

  // ══════════════════════════════════════
  // BEINE (ein Bein nach vorne mit gespreizten Zehen, eines nach hinten)
  // ══════════════════════════════════════
  ctx.strokeStyle = '#907860';
  ctx.lineCap = 'round';

  // Vorderes Bein (nach vorne gestreckt, Zehen gespreizt — wie im Foto!)
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(15, 14);
  ctx.bezierCurveTo(20, 28, 28, 40, 32, 52);
  ctx.stroke();
  // Gespreizten Zehen vorne
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(32, 52); ctx.lineTo(20, 62);   // Zehe links
  ctx.moveTo(32, 52); ctx.lineTo(28, 64);   // Zehe mitte
  ctx.moveTo(32, 52); ctx.lineTo(38, 62);   // Zehe rechts
  ctx.moveTo(32, 52); ctx.lineTo(42, 56);   // Zehe außen
  ctx.stroke();

  // Hinteres Bein (nach hinten gestreckt)
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-30, 14);
  ctx.bezierCurveTo(-38, 28, -50, 42, -58, 55);
  ctx.stroke();
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-58, 55); ctx.lineTo(-68, 63);
  ctx.moveTo(-58, 55); ctx.lineTo(-56, 65);
  ctx.moveTo(-58, 55); ctx.lineTo(-48, 62);
  ctx.stroke();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawHeron();
  t += 0.014;
  requestAnimationFrame(animate);
}

animate();