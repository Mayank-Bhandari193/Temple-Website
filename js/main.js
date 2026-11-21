/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - MAIN SCRIPT
 * Panchang, Web Audio Bell Chimes, Virtual Aarti, Flower Petal Shower, Mobile Nav
 */

// Sound Synthesizer via Web Audio API (Zero external assets needed!)
class SacredSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Pure brass temple bell chime with multi-harmonic decay
  playTempleBell() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      const now = this.audioCtx.currentTime;
      
      // Fundamental frequencies of brass ghanti
      const frequencies = [587.33, 1174.66, 1760.0, 2349.32, 3520.0];
      const gains = [0.45, 0.25, 0.15, 0.08, 0.04];
      const decayTimes = [2.8, 2.2, 1.8, 1.2, 0.8];

      frequencies.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gains[i], now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decayTimes[i]);

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + decayTimes[i]);
      });
    } catch (e) {
      console.log("Audio not allowed or blocked by user gesture policy", e);
    }
  }

  // Sacred Shankh (Conch) resonance simulator
  playShankh() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.linearRampToValueAtTime(320, now + 1.2);
      osc.frequency.linearRampToValueAtTime(300, now + 3.0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.8);
      gain.gain.linearRampToValueAtTime(0.2, now + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 3.5);
    } catch (e) {
      console.log(e);
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }
}

const SoundEngine = new SacredSoundEngine();

// Falling Flower Petal Physics Simulation (Pushpanjali Canvas Effect)
class FlowerShower {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'flower-canvas';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 70) {
    const colors = ['#f59e0b', '#fbbf24', '#f97316', '#ef4444', '#f43f5e', '#ffffff'];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * 50,
        size: Math.random() * 14 + 10,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        angle: Math.random() * 360,
        angleSpeed: Math.random() * 4 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    if (!this.animating) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.02) + p.speedX;
      p.angle += p.angleSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.angle * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;

      // Draw sacred petal shape
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size / 2);
      this.ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size / 2, p.size / 2, 0, p.size / 2);
      this.ctx.bezierCurveTo(-p.size / 2, p.size / 2, -p.size / 2, -p.size / 2, 0, -p.size / 2);
      this.ctx.fill();
      this.ctx.restore();

      if (p.y > this.canvas.height) {
        this.petals.splice(i, 1);
        i--;
      }
    }

    if (this.petals.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Global flower shower instance
let flowerShower = null;

// Dynamic Hindu Panchang Calculator
function updatePanchang() {
  const panchangEl = document.getElementById('panchang-display');
  if (!panchangEl) return;

  const today = new Date();
  const months = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];
  const tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shasthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"];
  
  // Dynamic tithi derived from day of month
  const day = today.getDate();
  const monthIdx = today.getMonth();
  const tithiName = tithis[(day - 1) % 15];
  const paksha = day <= 15 ? "Shukla Paksha" : "Krishna Paksha";
  const vikramSamvat = today.getFullYear() + 57;

  panchangEl.innerHTML = `🕉️ Vikram Samvat ${vikramSamvat} &bull; ${months[monthIdx % 12]} &bull; ${paksha}, ${tithiName} &bull; Shubh Muhurat: Open for Darshan`;
}

// Synchronize Marquee Announcement from DB
function syncMarquee() {
  const marqueeEl = document.getElementById('live-announcement-text');
  if (marqueeEl && window.TempleDB) {
    marqueeEl.textContent = window.TempleDB.getAnnouncement();
  }
}

// Synchronize User Authentication Status in Header & Nav
// Note: General users/devotees see NO developer portal. Only verified Developer/Trustee accounts see console link.
function syncAuthStatus() {
  if (!window.TempleDB) return;
  const user = window.TempleDB.getCurrentUser();

  const authSlots = document.querySelectorAll('.js-auth-slot, .top-bar-right');
  authSlots.forEach(slot => {
    // Check if slot has auth container
    let userBox = slot.querySelector('.auth-status-container');
    if (!userBox) {
      userBox = document.createElement('div');
      userBox.className = 'auth-status-container';
      userBox.style.display = 'inline-flex';
      userBox.style.alignItems = 'center';
      userBox.style.gap = '0.5rem';
      slot.appendChild(userBox);
    }

    if (user) {
      const isDevOrTrustee = (user.role === 'Developer' || user.role === 'Trustee');
      const devBadge = isDevOrTrustee
        ? `<a href="developer-dashboard.html" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 4px; font-size: 0.72rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; box-shadow: 0 0 10px rgba(245,158,11,0.5);">🛠️ Developer Console</a>`
        : '';

      userBox.innerHTML = `
        <span style="color: #fde047; font-weight: 600; font-size: 0.85rem;">
          🙏 Namaste, ${user.name.split(' ')[0]} ${isDevOrTrustee ? `(${user.role})` : ''}
        </span>
        ${devBadge}
        <button class="btn btn-sm" onclick="window.TempleDB.logoutUser(); location.reload();" style="background: rgba(0,0,0,0.3); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4); padding: 0.15rem 0.5rem; font-size: 0.72rem; cursor: pointer; border-radius: 4px;">
          Logout
        </button>
      `;
    } else {
      userBox.innerHTML = `
        <a href="auth.html" style="color: #fde047; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem; background: rgba(0,0,0,0.25); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px dashed rgba(250,204,21,0.5);">
          👤 Register / Login
        </a>
      `;
    }
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  flowerShower = new FlowerShower();
  updatePanchang();
  syncMarquee();
  syncAuthStatus();

  // Listen for DB & Auth updates
  window.addEventListener('temple-db-changed', () => {
    syncMarquee();
  });

  window.addEventListener('temple-auth-changed', () => {
    syncAuthStatus();
  });

  // Mobile nav toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      }
    });
  }

  // Bell ring buttons
  const bellButtons = document.querySelectorAll('.js-ring-bell');
  bellButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      SoundEngine.playTempleBell();
      btn.style.transform = 'rotate(-15deg)';
      setTimeout(() => btn.style.transform = 'rotate(15deg)', 150);
      setTimeout(() => btn.style.transform = 'rotate(0deg)', 300);
    });
  });

  // Sound toggle button in header
  const soundToggleBtn = document.getElementById('btn-sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const active = SoundEngine.toggleSound();
      soundToggleBtn.innerHTML = active ? '🔔' : '🔕';
      soundToggleBtn.title = active ? 'Temple Sound: ON' : 'Temple Sound: OFF';
      if (active) SoundEngine.playTempleBell();
    });
  }

  // Interactive Virtual Diya
  const diyaBtn = document.getElementById('btn-light-diya');
  const diyaIcon = document.getElementById('diya-icon-element');
  const diyaCountEl = document.getElementById('diya-count');
  let diyaCount = 1428;

  if (diyaBtn && diyaIcon) {
    diyaBtn.addEventListener('click', () => {
      SoundEngine.playTempleBell();
      if (flowerShower) flowerShower.burst(55);

      diyaCount++;
      if (diyaCountEl) diyaCountEl.textContent = diyaCount.toLocaleString();

      diyaIcon.style.transform = 'scale(1.35)';
      diyaIcon.style.filter = 'drop-shadow(0 0 35px #f59e0b) drop-shadow(0 0 70px #ef4444)';
      
      const originalText = diyaBtn.innerHTML;
      diyaBtn.innerHTML = '✨ Diya Lighted! Har Har Mahadev 🙏';
      diyaBtn.disabled = true;

      setTimeout(() => {
        diyaIcon.style.transform = 'scale(1)';
        diyaIcon.style.filter = 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.8))';
        diyaBtn.innerHTML = '🪔 Light Another Diya';
        diyaBtn.disabled = false;
      }, 3500);
    });
  }

  // Offer Flowers / Pushpanjali button
  const flowerBtn = document.getElementById('btn-offer-flowers');
  if (flowerBtn) {
    flowerBtn.addEventListener('click', () => {
      SoundEngine.playTempleBell();
      if (flowerShower) flowerShower.burst(80);
    });
  }

  // =========================================================================
  // CLIENT & DEVELOPER DISCREET PORTAL ACCESS (Hidden from general devotees)
  // 1. Keyboard Shortcut: Ctrl + Shift + D
  // 2. Secret Gesture: 3 rapid clicks on the Mandir Emblem (🕉️)
  // =========================================================================
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      window.location.href = 'developer-dashboard.html';
    }
  });

  let emblemClicks = 0;
  let emblemTimer = null;
  const emblems = document.querySelectorAll('.brand-emblem, .navbar-brand');
  emblems.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      emblemClicks++;
      clearTimeout(emblemTimer);
      if (emblemClicks >= 3) {
        emblemClicks = 0;
        if (window.SoundEngine) window.SoundEngine.playTempleBell();
        window.location.href = 'developer-dashboard.html';
      } else {
        emblemTimer = setTimeout(() => { emblemClicks = 0; }, 1400);
      }
    });
  });
});
