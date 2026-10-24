/**
 * Zynaq.Aqua Pvt. Ltd. - Core Interactive Engine
 * "Engineering Intelligence for Modern Aquaculture"
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initInquiryModal();     // FAB + slide-over modal
  initFinFloatTabs();
  initPondSimulator();
  initContactForm();
  initTelemetryTicker();
  init3DStudio();
  initEcosystemHotspots();
  initScrollReveal();
});

/* ==========================================================================
   1. HEADER SCROLL & MOBILE DRAWER
   ========================================================================== */

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!toggleBtn || !drawer) return;

  const closeDrawer = () => {
    drawer.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
  };

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('drawer-open', isOpen);
  });

  // Smooth offset navigation helper to prevent fixed header from overlapping section titles
  const scrollToTargetWithOffset = (href) => {
    if (!href || !href.startsWith('#')) return false;
    const target = document.querySelector(href);
    if (!target) return false;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 64;
    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 20);
    window.scrollTo({
      top: Math.max(0, targetPos),
      behavior: 'smooth'
    });
    history.pushState(null, '', href);
    return true;
  };

  // Close drawer and scroll with clearance on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      closeDrawer();
      const href = link.getAttribute('href');
      if (scrollToTargetWithOffset(href)) {
        e.preventDefault();
      }
    });
  });

  // Also apply header-clearance scroll to desktop nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (scrollToTargetWithOffset(href)) {
        e.preventDefault();
      }
    });
  });

  // Close drawer on clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  });

  // Close drawer when resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040 && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. INQUIRY FAB + MODAL
   ========================================================================== */

function initInquiryModal() {
  const fab       = document.getElementById('inquiryFab');
  const overlay   = document.getElementById('inquiryModalOverlay');
  const closeBtn  = document.getElementById('inquiryModalClose');
  if (!fab || !overlay) return;

  const openModal = () => {
    overlay.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    // Focus first input for a11y
    const firstInput = overlay.querySelector('input, select, textarea, button');
    if (firstInput) setTimeout(() => firstInput.focus(), 80);
  };

  const closeModal = () => {
    overlay.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    fab.focus();
  };

  fab.addEventListener('click', openModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Backdrop click closes modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
      closeModal();
    }
  });

  // Intercept ALL #contact anchor clicks across the page → open modal
  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile drawer if open
      const drawer = document.getElementById('mobileNavDrawer');
      const toggle = document.getElementById('mobileMenuToggle');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        document.body.classList.remove('drawer-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
      openModal();
    });
  });
}

/* ==========================================================================
   2. HERO TELEMETRY TICKER (LIVE UPDATING)
   ========================================================================== */

function initTelemetryTicker() {
  const doElem = document.getElementById('heroTickerDO');
  const tempElem = document.getElementById('heroTickerTemp');
  const phElem = document.getElementById('heroTickerPH');

  if (!doElem || !tempElem || !phElem) return;

  setInterval(() => {
    // Subtle real-world fluctuation
    const baseDO = 6.4 + (Math.random() * 0.4 - 0.2);
    const baseTemp = 28.2 + (Math.random() * 0.3 - 0.15);
    const basePH = 7.8 + (Math.random() * 0.1 - 0.05);

    doElem.innerHTML = `${baseDO.toFixed(1)} <span>mg/L</span>`;
    tempElem.innerHTML = `${baseTemp.toFixed(1)} <span>°C</span>`;
    phElem.innerHTML = `${basePH.toFixed(2)} <span>pH</span>`;
  }, 4000);
}

/* ==========================================================================
   3. FINFLOAT INTERACTIVE FEATURE TABS
   ========================================================================== */

function initFinFloatTabs() {
  const tabButtons = document.querySelectorAll('.finfloat-tab-btn');
  const tabPanes = document.querySelectorAll('.finfloat-tab-pane');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button states
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update pane states
      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   4. LIVE INTERACTIVE POND SIMULATOR
   ========================================================================== */

const POND_PROFILES = {
  shrimp: {
    name: "Pond A1 — Litopenaeus Vannamei (Whiteleg Shrimp)",
    species: "Pacific White Shrimp",
    stock: "140,000 Post-Larvae",
    baseDO: 6.8,
    baseTemp: 28.4,
    basePH: 7.9,
    baseSalinity: 18.2,
    doUnit: "mg/L",
    tempUnit: "°C",
    phUnit: "pH",
    salinityUnit: "ppt",
    aiRecommendation: "Dissolved oxygen optimal at 6.8 mg/L. Optimal feeding window active. Dispersing 1.8 kg micro-ration.",
    status: "Optimal Aeration",
    feedRate: "1.8 kg / cycle"
  },
  tilapia: {
    name: "Pond B2 — Oreochromis Niloticus (Nile Tilapia)",
    species: "Genetically Improved Farmed Tilapia (GIFT)",
    stock: "25,000 Fingerlings",
    baseDO: 5.4,
    baseTemp: 26.8,
    basePH: 7.4,
    baseSalinity: 2.1,
    doUnit: "mg/L",
    tempUnit: "°C",
    phUnit: "pH",
    salinityUnit: "ppt",
    aiRecommendation: "Appetite index high. Water temperature 26.8°C promotes rapid biomass intake. Scheduled feed at 14:00.",
    status: "Normal Operations",
    feedRate: "3.2 kg / cycle"
  },
  seabass: {
    name: "Pond C4 — Lates Calcarifer (Asian Seabass)",
    species: "Barramundi / Bhetki",
    stock: "12,500 Juveniles",
    baseDO: 7.1,
    baseTemp: 29.1,
    basePH: 8.1,
    baseSalinity: 24.5,
    doUnit: "mg/L",
    tempUnit: "°C",
    phUnit: "pH",
    salinityUnit: "ppt",
    aiRecommendation: "High DO saturation (7.1 mg/L) detected. Predatory feeding activity observed by underwater acoustic sensor.",
    status: "High Growth Phase",
    feedRate: "2.4 kg / cycle"
  }
};

let currentPondKey = 'shrimp';
let pondIntervalId = null;

function initPondSimulator() {
  const tabBtns = document.querySelectorAll('.pond-tab-btn');
  const feedBtn = document.getElementById('triggerFeedBtn');
  const feedStatus = document.getElementById('feedStatusLog');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentPondKey = btn.getAttribute('data-pond');
      updatePondDashboard(currentPondKey, true);
    });
  });

  // Initial load
  updatePondDashboard(currentPondKey, true);

  // Periodic subtle sensor jitter
  if (pondIntervalId) clearInterval(pondIntervalId);
  pondIntervalId = setInterval(() => {
    updatePondDashboard(currentPondKey, false);
  }, 3000);

  // Trigger Precision Feed Button
  if (feedBtn) {
    feedBtn.addEventListener('click', () => {
      const profile = POND_PROFILES[currentPondKey];
      feedBtn.disabled = true;
      feedBtn.innerHTML = `
        <svg class="btn-icon" style="animation: spin 1s infinite linear;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" fill="none"/>
        </svg>
        Dispensing Precision Pellets...
      `;

      if (feedStatus) {
        feedStatus.innerHTML = `⚡ FinFloat Dispenser: <span style="color:var(--brand-green);">Active (${profile.feedRate})</span>`;
      }

      setTimeout(() => {
        feedBtn.disabled = false;
        feedBtn.innerHTML = `
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Trigger Precision Feed
        `;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (feedStatus) {
          feedStatus.innerHTML = `✓ Last feed executed at <strong>${timeStr}</strong> (${profile.feedRate})`;
        }

        // Slightly bump DO after feeding movement
        const doValElem = document.getElementById('simValDO');
        if (doValElem) {
          const currentVal = parseFloat(doValElem.textContent);
          doValElem.textContent = (currentVal + 0.15).toFixed(1);
        }
      }, 2500);
    });
  }
}

function updatePondDashboard(pondKey, resetSparklines = false) {
  const profile = POND_PROFILES[pondKey];
  if (!profile) return;

  // Compute slight live noise
  const jitterDO = (profile.baseDO + (Math.random() * 0.2 - 0.1)).toFixed(1);
  const jitterTemp = (profile.baseTemp + (Math.random() * 0.2 - 0.1)).toFixed(1);
  const jitterPH = (profile.basePH + (Math.random() * 0.08 - 0.04)).toFixed(2);
  const jitterSalinity = (profile.baseSalinity + (Math.random() * 0.2 - 0.1)).toFixed(1);

  // Update DOM values
  const doElem = document.getElementById('simValDO');
  const tempElem = document.getElementById('simValTemp');
  const phElem = document.getElementById('simValPH');
  const salElem = document.getElementById('simValSalinity');
  const aiTextElem = document.getElementById('simAiRecommendation');
  const statusBadge = document.getElementById('terminalStatusBadge');

  if (doElem) doElem.textContent = jitterDO;
  if (tempElem) tempElem.textContent = jitterTemp;
  if (phElem) phElem.textContent = jitterPH;
  if (salElem) salElem.textContent = jitterSalinity;
  if (aiTextElem) aiTextElem.textContent = profile.aiRecommendation;
  if (statusBadge) statusBadge.textContent = `LIVE: ${profile.status}`;

  // Update dynamic SVG sparklines
  updateSparkline('sparklineDO', 20, 30);
  updateSparkline('sparklineTemp', 15, 25);
  updateSparkline('sparklinePH', 10, 28);
  updateSparkline('sparklineSal', 12, 26);
}

function updateSparkline(id, minY, maxY) {
  const svg = document.getElementById(id);
  if (!svg) return;

  const points = [];
  const width = 120;
  const steps = 7;
  const stepX = width / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const x = Math.round(i * stepX);
    const y = Math.round(minY + Math.random() * (maxY - minY));
    points.push(`${x},${y}`);
  }

  const polyline = svg.querySelector('polyline');
  if (polyline) {
    polyline.setAttribute('points', points.join(' '));
  }
}

/* ==========================================================================
   10. SCROLL-DRIVEN REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  // Immediate reveal for users preferring reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  // Graceful fallback if IntersectionObserver is not supported
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));
}
/* ==========================================================================
   6. CONTACT FORM INTERACTION & FEEDBACK
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('demoInquiryForm');
  const statusMsg = document.getElementById('formStatusMessage');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="btn-icon" style="animation: spin 1s infinite linear;" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" fill="none"/>
      </svg>
      Connecting to Zynaq.Aqua...
    `;

    const name = document.getElementById('farmerName')?.value || 'Valued Farmer';
    const pondArea = document.getElementById('pondArea')?.value || '1 Acre';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = `
          <strong>Thank you, ${escapeHTML(name)}!</strong><br>
          Your request for a FinFloat demonstration for your pond facility (${escapeHTML(pondArea)}) has been received. 
          Our engineering team in Alappuzha will reach out to you within 24 hours at the provided contact details.
        `;
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
    }, 1400);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ==========================================================================
   7. INTERACTIVE 360° TRANSPARENT PRODUCT VIEWER (CANVAS + INERTIA + PRELOADER)
   ========================================================================== */

/* ==========================================================================
   7. INTERACTIVE 3D PRODUCT VIEWPORT (TRANSPARENT + INERTIA + 2S AUTO-RESUME)
   ========================================================================== */

function init3DStudio() {
  const canvas = document.getElementById('turntableCanvas');
  const hitArea = document.getElementById('viewportScreen');
  const dragCue = document.getElementById('dragCueOverlay');
  const loader = document.getElementById('turntableLoader');
  const progressText = document.getElementById('turntableProgressText');
  const errorBox = document.getElementById('turntableError');
  const retryBtn = document.getElementById('btnRetry360');
  const poster = document.getElementById('turntablePoster');

  if (!canvas || !hitArea) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 36;
  const frames = [];
  let loadedCount = 0;
  let isFullyLoaded = false;

  // Interaction & Physics State: Smooth touch-drag damping & inertia
  let currentFloatIndex = 0; // Stable initial resting camera angle (frame 0)
  let velocity = 0;          // Inertia velocity (frames/tick)
  let isDragging = false;
  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastTime = 0;
  let hasEvaluatedTouchDirection = false;
  let isTouchHorizontalLocked = false;
  let lastActivePointerId = null;

  // Optimized Damping: settle smoothly on drag release (0 CPU when idle)
  const DAMPING = 0.92;
  const MIN_VELOCITY = 0.005;

  // Responsive Canvas with Device Pixel Ratio capped at 2 for mobile performance
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = hitArea.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    if (width === 0 || height === 0) return;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    renderFrame();
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Render centered image floating seamlessly on 100% transparent background
  function renderFrame() {
    if (loadedCount === 0 && (!frames[0] || !frames[0].complete)) return;

    let frameIdx = Math.floor(currentFloatIndex) % TOTAL_FRAMES;
    if (frameIdx < 0) frameIdx += TOTAL_FRAMES;

    const img = frames[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const rect = hitArea.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;

    // 100% transparent background - blend directly into parent section
    ctx.clearRect(0, 0, cWidth, cHeight);

    // Padding ensures model is prominent without clipping on any viewport
    const padding = cWidth < 480 ? 12 : 20;
    const availW = Math.max(10, cWidth - padding * 2);
    const availH = Math.max(10, cHeight - padding * 2);
    const scale = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);

    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const drawX = (cWidth - drawW) / 2;
    const drawY = (cHeight - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Smoothly hide poster once canvas has painted
    if (poster && !poster.classList.contains('hidden')) {
      poster.classList.add('hidden');
    }
  }

  // Animation Loop (Runs ONLY during drag inertia, 0 CPU overhead when idle)
  let rafId = null;
  function tick() {
    if (!isDragging && Math.abs(velocity) > MIN_VELOCITY) {
      currentFloatIndex = (currentFloatIndex + velocity + TOTAL_FRAMES) % TOTAL_FRAMES;
      velocity *= DAMPING;
      renderFrame();
      rafId = requestAnimationFrame(tick);
    } else {
      velocity = 0;
      rafId = null;
    }
  }

  function requestTick() {
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  // Pointer & Touch Events for Smooth Manual Drag Orbit Controls
  hitArea.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    isDragging = false;
    hasEvaluatedTouchDirection = false;
    isTouchHorizontalLocked = false;
    lastActivePointerId = e.pointerId;

    startX = e.clientX;
    startY = e.clientY;
    lastX = e.clientX;
    lastTime = performance.now();
    velocity = 0;

    // Stop inertia immediately on contact
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Retain clear lightweight hint and smoothly fade out on touch start
    if (dragCue) {
      dragCue.classList.add('hidden');
    }
  });

  hitArea.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;

    const deltaX = e.clientX - lastX;
    const now = performance.now();

    // Direction lock evaluation for mobile touch devices
    if (!hasEvaluatedTouchDirection) {
      const totalDx = Math.abs(e.clientX - startX);
      const totalDy = Math.abs(e.clientY - startY);

      if (totalDx > 5 || totalDy > 5) {
        hasEvaluatedTouchDirection = true;
        if (totalDx >= totalDy) {
          isTouchHorizontalLocked = true;
          isDragging = true;
          canvas.classList.add('is-dragging');
          try {
            hitArea.setPointerCapture(e.pointerId);
          } catch (_) {}
        } else {
          // Vertical swipe: let page scroll naturally
          isPointerDown = false;
          return;
        }
      }
    }

    if (isDragging) {
      // Calculate instantaneous velocity with smooth touch-drag sensitivity
      const frameDelta = -(deltaX / 12);
      currentFloatIndex = (currentFloatIndex + frameDelta + TOTAL_FRAMES) % TOTAL_FRAMES;
      velocity = velocity * 0.4 + frameDelta * 0.6; // smooth exponential moving average

      lastX = e.clientX;
      lastTime = now;
      renderFrame();
    }
  });

  const handlePointerEnd = (e) => {
    if (!isPointerDown && !isDragging) return;

    isPointerDown = false;
    if (isDragging) {
      isDragging = false;
      canvas.classList.remove('is-dragging');
      try {
        if (lastActivePointerId !== null) {
          hitArea.releasePointerCapture(lastActivePointerId);
        }
      } catch (_) {}

      // Clamp inertia velocity and coast to smooth halt
      velocity = Math.max(-1.8, Math.min(1.8, velocity));
      if (Math.abs(velocity) > MIN_VELOCITY) {
        requestTick();
      }
    }
    lastActivePointerId = null;
  };

  hitArea.addEventListener('pointerup', handlePointerEnd);
  hitArea.addEventListener('pointercancel', handlePointerEnd);

  // Preload frames sequentially / progressively
  function loadSequence() {
    loadedCount = 0;
    isFullyLoaded = false;
    frames.length = 0;

    if (errorBox) errorBox.style.display = 'none';
    if (loader) {
      loader.classList.remove('loaded');
      if (progressText) progressText.textContent = '0%';
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `assets/360-transparent/frame_${i}.png`;
      frames.push(img);

      const onFrameSuccess = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        if (progressText) progressText.textContent = `${pct}%`;

        // Render first resting frame immediately once available
        if (i === 0 || loadedCount === 1) {
          resizeCanvas();
        }

        // When all frames are ready, unveil the clean viewer
        if (loadedCount === TOTAL_FRAMES) {
          isFullyLoaded = true;
          if (loader) loader.classList.add('loaded');
          resizeCanvas();
        }
      };

      img.addEventListener('load', onFrameSuccess, { once: true });
      img.addEventListener('error', () => {
        img.src = `assets/360-transparent/frame-${i}.png`;
        img.addEventListener('load', onFrameSuccess, { once: true });
        img.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES) {
            isFullyLoaded = true;
            if (loader) loader.classList.add('loaded');
            resizeCanvas();
          }
        }, { once: true });
      }, { once: true });
    }
  }

  // Retry button in case of network glitch
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      loadSequence();
    });
  }

  // Kick off frame preloader and render initial resting view
  loadSequence();
}

/* ==========================================================================
   9. ECOSYSTEM TWO-POND INTERACTIVE HOTSPOTS
   ========================================================================== */

function initEcosystemHotspots() {
  const hotspots = document.querySelectorAll('.pond-hotspot');
  if (!hotspots || hotspots.length === 0) return;

  hotspots.forEach(hotspot => {
    // Accessibility keyboard focus support
    hotspot.setAttribute('tabindex', '0');
    hotspot.setAttribute('role', 'button');
    hotspot.setAttribute('aria-expanded', 'false');

    const toggleHotspot = (e) => {
      e.stopPropagation();
      const isActive = hotspot.classList.contains('active');
      
      // Close other hotspots
      hotspots.forEach(h => {
        h.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        hotspot.classList.add('active');
        hotspot.setAttribute('aria-expanded', 'true');
      }
    };

    hotspot.addEventListener('click', toggleHotspot);
    hotspot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleHotspot(e);
      }
    });
  });

  // Handle close buttons inside cards (especially for mobile touch)
  const closeBtns = document.querySelectorAll('.hotspot-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentHotspot = btn.closest('.pond-hotspot');
      if (parentHotspot) {
        parentHotspot.classList.remove('active');
        parentHotspot.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close hotspots when clicking outside
  document.addEventListener('click', () => {
    hotspots.forEach(h => {
      h.classList.remove('active');
      h.setAttribute('aria-expanded', 'false');
    });
  });
}


