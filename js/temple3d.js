/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - 3D SACRED ENGINE
 * Real-time 3D Sanctum, 3D Golden Kalash, 3D Diya Flame, 3D Aarti Parikrama, and 3D Card Tilt Physics
 */

class Temple3DEngine {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.kalashGroup = null;
    this.flameParticles = [];
    this.stardustParticles = null;
    this.flowerParticles3D = [];
    this.isAartiActive = false;
    this.aartiAngle = 0;
    this.lightingMode = 'gold'; // 'gold', 'sandhya', 'night'
    this.flameLight = null;

    // Interaction controls
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationSpeed = 0.005;

    this.init();
  }

  init() {
    // If Three.js is loaded via CDN, build WebGL 3D scene; otherwise fallback to Canvas 3D
    if (window.THREE) {
      this.initWebGL();
    } else {
      this.initCanvasFallback();
    }

    this.initInteraction();
  }

  /* ==========================================================================
     WEBGL THREE.JS 3D SANCTUM IMPLEMENTATION
     ========================================================================== */
  initWebGL() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 450;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 3, 9);
    this.camera.lookAt(0, 0.5, 0);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf59e0b, 1.4);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xef4444, 0.8);
    rimLight.position.set(-6, -2, -5);
    this.scene.add(rimLight);

    // Sacred Flame Light (flickers in loop)
    this.flameLight = new THREE.PointLight(0xffaa00, 2.5, 12);
    this.flameLight.position.set(0, 2.2, 0);
    this.scene.add(this.flameLight);

    // 4. Construct 3D Sacred Kalash & Sanctum Base
    this.build3DKalash();

    // 5. Ambient 3D Orbiting Stardust Particles
    this.buildStardust();

    // 6. Handle Resizing
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // 7. Start Animation Loop
    this.animate();
  }

  build3DKalash() {
    this.kalashGroup = new THREE.Group();

    // Material: Polished Temple Brass / Gold
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.22,
      emissive: 0x92400e,
      emissiveIntensity: 0.15
    });

    // Material: Carved Sanctum Red Sandstone Base
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x881337,
      metalness: 0.2,
      roughness: 0.7
    });

    // Tier 1: Octagonal Stone Peetham (Base)
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.4, 16);
    const baseMesh = new THREE.Mesh(baseGeo, stoneMaterial);
    baseMesh.position.y = -1.2;
    baseMesh.receiveShadow = true;
    this.kalashGroup.add(baseMesh);

    // Tier 2: Golden Lotus Ring
    const lotusRingGeo = new THREE.TorusGeometry(1.9, 0.18, 12, 32);
    const lotusRing = new THREE.Mesh(lotusRingGeo, goldMaterial);
    lotusRing.rotation.x = Math.PI / 2;
    lotusRing.position.y = -0.95;
    this.kalashGroup.add(lotusRing);

    // Tier 3: Sacred Brass Kalash Kumbha (Body)
    const potGeo = new THREE.SphereGeometry(1.3, 32, 24);
    const potMesh = new THREE.Mesh(potGeo, goldMaterial);
    potMesh.position.y = 0.2;
    potMesh.scale.set(1.1, 1.0, 1.1);
    this.kalashGroup.add(potMesh);

    // Tier 4: Kalash Neck & Rim
    const neckGeo = new THREE.CylinderGeometry(0.75, 1.05, 0.6, 24);
    const neckMesh = new THREE.Mesh(neckGeo, goldMaterial);
    neckMesh.position.y = 1.25;
    this.kalashGroup.add(neckMesh);

    const rimGeo = new THREE.TorusGeometry(0.85, 0.12, 16, 32);
    const rimMesh = new THREE.Mesh(rimGeo, goldMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 1.55;
    this.kalashGroup.add(rimMesh);

    // Tier 5: Sacred Mango Leaves (5 Leaves spreading outward)
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.4,
      metalness: 0.1
    });

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leafGeo = new THREE.ConeGeometry(0.28, 1.1, 4);
      const leafMesh = new THREE.Mesh(leafGeo, leafMaterial);
      leafMesh.position.set(Math.cos(angle) * 0.6, 1.85, Math.sin(angle) * 0.6);
      leafMesh.rotation.z = Math.cos(angle) * 0.45;
      leafMesh.rotation.x = -Math.sin(angle) * 0.45;
      this.kalashGroup.add(leafMesh);
    }

    // Tier 6: Golden Coconut & Flame
    const coconutGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const coconutMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.9,
      metalness: 0.05
    });
    const coconutMesh = new THREE.Mesh(coconutGeo, coconutMaterial);
    coconutMesh.position.y = 1.95;
    this.kalashGroup.add(coconutMesh);

    // Top Divine Jyoti Flame (Self-illuminating golden teardrop)
    const flameGeo = new THREE.ConeGeometry(0.3, 0.9, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a
    });
    this.flameMesh = new THREE.Mesh(flameGeo, flameMat);
    this.flameMesh.position.y = 2.65;
    this.kalashGroup.add(this.flameMesh);

    // Floating 3D Glowing "Om" Glyph Emblem Ring
    const omRingGeo = new THREE.TorusGeometry(2.9, 0.04, 8, 48);
    const omRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.6
    });
    this.omRing = new THREE.Mesh(omRingGeo, omRingMat);
    this.omRing.rotation.x = Math.PI / 2.3;
    this.omRing.position.y = 0.5;
    this.kalashGroup.add(this.omRing);

    this.scene.add(this.kalashGroup);
  }

  buildStardust() {
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = Math.random() * 7 - 1;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xfde047,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.stardustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.stardustParticles);
  }

  triggerFlowerBurst3D() {
    if (!this.scene || !window.THREE) return;

    const count = 45;
    const colors = [0xf59e0b, 0xf43f5e, 0xfbbf24, 0xffffff];

    for (let i = 0; i < count; i++) {
      const geo = new THREE.PlaneGeometry(0.25, 0.35);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
      });
      const petal = new THREE.Mesh(geo, mat);
      petal.position.set(
        (Math.random() - 0.5) * 4,
        5 + Math.random() * 2,
        (Math.random() - 0.5) * 4
      );
      petal.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        -0.03 - Math.random() * 0.04,
        (Math.random() - 0.5) * 0.04
      );
      petal.rotSpeed = new THREE.Vector3(
        Math.random() * 0.06,
        Math.random() * 0.06,
        Math.random() * 0.06
      );

      this.scene.add(petal);
      this.flowerParticles3D.push(petal);
    }
  }

  start3DAarti() {
    this.isAartiActive = true;
    this.aartiAngle = 0;

    if (window.SoundEngine) {
      window.SoundEngine.playTempleBell();
    }
    this.triggerFlowerBurst3D();

    const aartiStatusBadge = document.getElementById('aarti-3d-status');
    if (aartiStatusBadge) {
      aartiStatusBadge.textContent = '✨ Maha 3D Aarti In Progress...';
      aartiStatusBadge.style.color = '#fde047';
    }

    setTimeout(() => {
      this.isAartiActive = false;
      this.camera.position.set(0, 3, 9);
      this.camera.lookAt(0, 0.5, 0);
      if (aartiStatusBadge) {
        aartiStatusBadge.textContent = '✓ Darshan Complete (Har Har Mahadev)';
        aartiStatusBadge.style.color = '#86efac';
      }
    }, 9000);
  }

  setLighting(mode) {
    this.lightingMode = mode;
    if (!this.scene) return;

    if (mode === 'night') {
      this.scene.background = new THREE.Color(0x0b0f19);
      if (this.flameLight) this.flameLight.intensity = 4.5;
    } else if (mode === 'sandhya') {
      this.scene.background = new THREE.Color(0x4c0519);
      if (this.flameLight) this.flameLight.intensity = 3.5;
    } else {
      this.scene.background = null;
      if (this.flameLight) this.flameLight.intensity = 2.5;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.002;

    // Gentle rotation of Kalash and Om ring
    if (this.kalashGroup && !this.isDragging && !this.isAartiActive) {
      this.kalashGroup.rotation.y += 0.005;
    }

    if (this.omRing) {
      this.omRing.rotation.z += 0.01;
    }

    // Flame flicker simulation
    if (this.flameMesh && this.flameLight) {
      const flicker = 1 + Math.sin(time * 8) * 0.12 + Math.cos(time * 15) * 0.08;
      this.flameMesh.scale.set(flicker, flicker * 1.1, flicker);
      this.flameLight.intensity = 2.4 * flicker;
    }

    // Stardust rotation
    if (this.stardustParticles) {
      this.stardustParticles.rotation.y += 0.001;
    }

    // 3D Aarti Camera Motion (Smooth circular parikrama)
    if (this.isAartiActive) {
      this.aartiAngle += 0.025;
      const radius = 7.5;
      this.camera.position.x = Math.sin(this.aartiAngle) * radius;
      this.camera.position.z = Math.cos(this.aartiAngle) * radius;
      this.camera.position.y = 2.5 + Math.sin(this.aartiAngle * 2) * 1.0;
      this.camera.lookAt(0, 0.8, 0);
    }

    // Flower petals physics
    for (let i = 0; i < this.flowerParticles3D.length; i++) {
      const p = this.flowerParticles3D[i];
      p.position.add(p.velocity);
      p.rotation.x += p.rotSpeed.x;
      p.rotation.y += p.rotSpeed.y;

      if (p.position.y < -1.8) {
        this.scene.remove(p);
        this.flowerParticles3D.splice(i, 1);
        i--;
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /* ==========================================================================
     CANVAS 2.5D / 3D FALLBACK (When Three.js or WebGL is offline)
     ========================================================================== */
  initCanvasFallback() {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth || 800;
    canvas.height = this.container.clientHeight || 450;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    this.container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let angle = 0;
    const animateFallback = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 30;

      // Draw glowing aura
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
      grad.addColorStop(0.5, 'rgba(136, 19, 55, 0.15)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rotating 3D Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.arc(0, 80, 160, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#d4af37';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 30, 110, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();
      ctx.restore();

      // Draw stylized Golden Kalash & Diya
      ctx.save();
      ctx.translate(cx, cy - 20);
      ctx.rotate(Math.sin(angle * 0.5) * 0.04);

      // Pedestal
      ctx.fillStyle = '#881337';
      ctx.fillRect(-90, 80, 180, 25);

      // Pot body
      ctx.beginPath();
      ctx.arc(0, 20, 65, 0, Math.PI * 2);
      const potGrad = ctx.createLinearGradient(-65, -45, 65, 85);
      potGrad.addColorStop(0, '#fef08a');
      potGrad.addColorStop(0.5, '#f59e0b');
      potGrad.addColorStop(1, '#92400e');
      ctx.fillStyle = potGrad;
      ctx.fill();

      // Neck & Rim
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-45, -45, 90, 22);
      ctx.beginPath();
      ctx.ellipse(0, -45, 55, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flame with flicker
      const fSize = 25 + Math.sin(angle * 4) * 4;
      ctx.beginPath();
      ctx.ellipse(0, -90, fSize, fSize * 1.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 35;
      ctx.fill();
      ctx.restore();

      angle += 0.03;
      requestAnimationFrame(animateFallback);
    };

    animateFallback();
  }

  /* ==========================================================================
     INTERACTIVE MOUSE & TOUCH CONTROLS
     ========================================================================== */
  initInteraction() {
    if (!this.container) return;

    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.container.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.kalashGroup) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.kalashGroup.rotation.y += deltaX * this.rotationSpeed;
      this.kalashGroup.rotation.x += deltaY * this.rotationSpeed * 0.5;

      // Limit vertical tilt
      this.kalashGroup.rotation.x = Math.max(-0.4, Math.min(0.4, this.kalashGroup.rotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile devices
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    this.container.addEventListener('touchmove', (e) => {
      if (!this.isDragging || !this.kalashGroup || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.kalashGroup.rotation.y += deltaX * this.rotationSpeed * 1.2;
      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
  }
}

/* ==========================================================================
   INTERACTIVE 3D CARD PARALLAX TILT ENGINE
   Applies high-end 3D perspective tilt to cards when hovered
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.temple-card, .seva-card, .yt-feature-box, [data-tilt-3d]');

  cards.forEach(card => {
    card.classList.add('tilt-card-3d');

    // Create dynamic specular shine overlay element
    let glare = card.querySelector('.card-3d-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-3d-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 3D rotation limits (-12 to +12 degrees)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;

      // Dynamic glare follow
      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(251, 191, 36, 0.22) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });
}

// Global initialization
window.Temple3DEngine = Temple3DEngine;
window.init3DCardTilt = init3DCardTilt;

document.addEventListener('DOMContentLoaded', () => {
  init3DCardTilt();

  // Instantiate 3D Sanctum if element exists
  if (document.getElementById('sanctum-3d-canvas-container')) {
    window.active3DSanctum = new Temple3DEngine('sanctum-3d-canvas-container');

    // Button: 3D Aarti
    const btnAarti = document.getElementById('btn-trigger-3d-aarti');
    if (btnAarti) {
      btnAarti.addEventListener('click', () => {
        window.active3DSanctum.start3DAarti();
      });
    }

    // Button: 3D Flowers
    const btnFlowers = document.getElementById('btn-trigger-3d-flowers');
    if (btnFlowers) {
      btnFlowers.addEventListener('click', () => {
        window.active3DSanctum.triggerFlowerBurst3D();
        if (window.SoundEngine) window.SoundEngine.playTempleBell();
      });
    }

    // Lighting toggles
    document.querySelectorAll('[data-3d-lighting]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-3d-lighting]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.active3DSanctum.setLighting(btn.dataset['3dLighting']);
      });
    });
  }
});
