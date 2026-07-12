/* ===== NAVBAR ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('open'));
    // Open clicked if was closed
    if (!isOpen) {
      answer.classList.add('open');
      btn.classList.add('open');
    }
  });
});

/* ===== CHAT WIDGET ===== */
const chatBubble = document.getElementById('chatBubble');
const chatPanel = document.getElementById('chatPanel');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

if (chatBubble) {
  chatBubble.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
    const icon = chatBubble.querySelector('.chat-icon');
    const close = chatBubble.querySelector('.chat-close');
    if (chatPanel.classList.contains('open')) {
      icon.style.display = 'none';
      close.style.display = 'block';
    } else {
      icon.style.display = 'block';
      close.style.display = 'none';
    }
  });
}

function addChatMsg(text, from) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + from;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  addChatMsg(text, 'user');
  chatInput.value = '';
  setTimeout(() => {
    addChatMsg("Thanks for reaching out! Our team will get back to you within 24 hours.", 'bot');
  }, 800);
}

if (chatSend) chatSend.addEventListener('click', sendChat);
if (chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

/* ===== HERO PARTICLE CANVAS ===== */
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H;

  const FONT_SIZE = 100;
  const SCAN_SPEED = 0.18;
  const LINE_GAP = 160;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); });

  // Particle sprites
  function makeSprite(r, color) {
    const c = document.createElement('canvas');
    c.width = r * 2;
    c.height = r * 2;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(107,147,214,0)');
    x.fillStyle = g;
    x.beginPath();
    x.arc(r, r, r, 0, Math.PI * 2);
    x.fill();
    return c;
  }
  const spriteSmall = makeSprite(3, 'rgba(107,147,214,1)');
  const spriteLarge = makeSprite(5, 'rgba(107,147,214,1)');

  // Dust particles
  const isMobile = W < 768;
  const dustCount = isMobile ? 600 : 1800;
  const particles = [];

  for (let i = 0; i < dustCount; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      dust: true, highlight: false, targetX: 0, targetY: 0
    });
  }

  // Glyph targets from text
  let glyphTargets = [];
  let revealedGlyphs = 0;
  let allRevealed = false;
  let revealStartTime = 0;

  function sampleText(text, x, y) {
    const off = document.createElement('canvas');
    const octx = off.getContext('2d');
    octx.font = FONT_SIZE + 'px "Playfair Display", serif';
    const m = octx.measureText(text);
    off.width = Math.ceil(m.width);
    off.height = Math.ceil(FONT_SIZE * 1.2);
    octx.font = FONT_SIZE + 'px "Playfair Display", serif';
    octx.fillStyle = 'white';
    octx.fillText(text, 0, FONT_SIZE);
    const img = octx.getImageData(0, 0, off.width, off.height);
    const pts = [];
    for (let py = 0; py < off.height; py += 4) {
      for (let px = 0; px < off.width; px += 4) {
        if (img.data[(py * off.width + px) * 4 + 3] > 128) {
          pts.push({ x: x + px, y: y + py });
        }
      }
    }
    return pts;
  }

  function initGlyphs() {
    glyphTargets = [];
    const lines = ['AI That Reads', 'the Fine Print'];
    const totalH = lines.length * LINE_GAP;
    const startY = (H - totalH) / 2;
    lines.forEach((line, i) => {
      const pts = sampleText(line, W * 0.08, startY + i * LINE_GAP);
      glyphTargets.push({ text: line, pts, revealed: false, revealedTime: 0, highlights: [] });
    });
    revealedGlyphs = 0;
    allRevealed = false;
    revealStartTime = performance.now();
  }

  document.fonts.ready.then(initGlyphs);

  // Scan lines
  const scanLines = [];

  function spawnScan() {
    scanLines.push({ x: -200, y: Math.random() * H, startX: -200, speed: SCAN_SPEED + Math.random() * 0.1, opacity: 0, width: 180 });
  }

  let lastTime = 0;
  function animate(ts) {
    requestAnimationFrame(animate);
    let dt = ts - lastTime;
    if (dt > 100) dt = 100;
    lastTime = ts;

    ctx.clearRect(0, 0, W, H);

    // Scan lines
    for (let i = scanLines.length - 1; i >= 0; i--) {
      const s = scanLines[i];
      s.x += s.speed;
      const dist = Math.abs(s.x - s.startX);
      if (dist < 100) s.opacity = Math.min(dist / 100, 1);
      else if (dist > W - 300) s.opacity = Math.max(0, (W - 300) / 100);
      else s.opacity = 1;

      const g = ctx.createLinearGradient(s.x - s.width / 2, 0, s.x + s.width / 2, 0);
      g.addColorStop(0, 'rgba(10,16,69,0)');
      g.addColorStop(0.5, 'rgba(212,163,115,' + (0.08 * s.opacity) + ')');
      g.addColorStop(1, 'rgba(10,16,69,0)');
      ctx.fillStyle = g;
      ctx.fillRect(s.x - s.width / 2, 0, s.width, H);

      if (s.x > W + 300) scanLines.splice(i, 1);
    }

    if (scanLines.length < 2 && Math.random() < 0.015 && !allRevealed) {
      spawnScan();
    }

    // Reveal logic
    if (!allRevealed) {
      for (const word of glyphTargets) {
        if (word.revealed || word.pts.length === 0) continue;
        const tx = word.pts[0].x;
        const ty = word.pts[Math.floor(word.pts.length / 2)].y;
        for (const s of scanLines) {
          if (Math.abs(tx - s.x) < 120 && Math.abs(ty - s.y) < 80) {
            word.revealed = true;
            word.revealedTime = ts;
            revealedGlyphs++;
            break;
          }
        }
      }
      if (revealedGlyphs >= glyphTargets.length) allRevealed = true;
    }

    // Spawn highlights for revealed words
    for (const word of glyphTargets) {
      if (word.revealed && ts - word.revealedTime > 500 && word.highlights.length === 0) {
        const cx = W / 2, cy = H / 2;
        for (let i = 0; i < (isMobile ? 30 : 50); i++) {
          const a1 = Math.random() * Math.PI * 2;
          const a2 = Math.random() * Math.PI * 2;
          const r = Math.random() * 2 + (Math.random() < 0.3 ? 100 : 20);
          const tgt = word.pts[Math.floor(Math.random() * word.pts.length)];
          particles.push({
            x: cx + Math.cos(a1) * r, y: cy + Math.sin(a2) * r,
            targetX: tgt.x, targetY: tgt.y,
            vx: 0, vy: 0, dust: false, highlight: true
          });
        }
        word.highlights = [true];
      }
    }

    // Update particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;

      if (p.dust) {
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      } else if (p.highlight) {
        if (Math.abs(p.vx) < 0.01 && Math.abs(p.vy) < 0.01) {
          p.x = p.targetX;
          p.y = p.targetY;
        } else {
          p.x += (p.targetX - p.x) * 0.1;
          p.y += (p.targetY - p.y) * 0.1;
        }
      }
    }

    // Draw faint revealed text
    for (const word of glyphTargets) {
      if (word.revealed && ts - word.revealedTime > 600 && word.pts.length > 0) {
        ctx.fillStyle = 'rgba(212,163,115,0.1)';
        ctx.font = FONT_SIZE + 'px "Playfair Display", serif';
        ctx.fillText(word.text, word.pts[0].x, word.pts[0].y + FONT_SIZE * 0.85);
      }
    }

    // Draw particles
    for (const p of particles) {
      if (p.dust) {
        ctx.globalAlpha = 0.35;
        ctx.drawImage(spriteSmall, p.x - 3, p.y - 3);
      } else if (p.highlight) {
        ctx.globalAlpha = 0.9;
        ctx.drawImage(spriteLarge, p.x - 5, p.y - 5);
      }
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(animate);
})();
