/**
 * Zynaq.Aqua Pvt. Ltd. - Core Interactive Engine
 * "Engineering Intelligence for Modern Aquaculture"
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initFinFloatTabs();
  initPondSimulator();
  initRoiCalculator();
  initContactForm();
  initTelemetryTicker();
  init3DStudio();
  initEcosystemHotspots();
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

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close drawer on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close drawer on clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close drawer when resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040 && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
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
   5. FARMER ROI & FEED SAVINGS CALCULATOR
   ========================================================================== */

function initRoiCalculator() {
  const pondsInput = document.getElementById('calcPondsInput');
  const feedCostInput = document.getElementById('calcFeedCostInput');
  const pondsValDisplay = document.getElementById('calcPondsDisplay');
  const feedCostValDisplay = document.getElementById('calcFeedCostDisplay');

  const savingsDisplay = document.getElementById('calcAnnualSavingsDisplay');
  const laborDisplay = document.getElementById('calcLaborHoursDisplay');
  const fcrDisplay = document.getElementById('calcFcrDisplay');
  const paybackDisplay = document.getElementById('calcPaybackDisplay');

  const currencyInrBtn = document.getElementById('currInrBtn');
  const currencyUsdBtn = document.getElementById('currUsdBtn');

  if (!pondsInput || !feedCostInput) return;

  let currentCurrency = 'INR'; // 'INR' or 'USD'

  const calculate = () => {
    const ponds = parseInt(pondsInput.value, 10);
    const monthlyFeed = parseFloat(feedCostInput.value);

    // Update input display labels
    pondsValDisplay.textContent = `${ponds} ${ponds === 1 ? 'Pond' : 'Ponds'}`;
    
    if (currentCurrency === 'INR') {
      feedCostValDisplay.textContent = formatINR(monthlyFeed);
    } else {
      feedCostValDisplay.textContent = `$${monthlyFeed.toLocaleString()}`;
    }

    // Assumptions derived from modern aquaculture precision feeding benchmarks:
    // 18.5% feed wastage reduction
    const feedSavingRatio = 0.185;
    const monthlySavings = monthlyFeed * feedSavingRatio;
    const annualSavings = monthlySavings * 12;

    // Labor hours saved: ~24 hours per pond per month (manual hauling, scattered feeding, manual dip testing)
    const laborHours = ponds * 24;

    // FCR improvement: baseline 1.6 drops to 1.32 (~0.28 pts)
    const fcrImprovement = "-0.26";

    // Payback period in months: hardware amortization based on ponds
    // FinFloat unit amortized cost approx ₹85,000 / pond
    const estimatedSystemCost = currentCurrency === 'INR' ? ponds * 85000 : ponds * 1050;
    const paybackMonths = Math.max(3.5, (estimatedSystemCost / monthlySavings)).toFixed(1);

    // Render results
    if (savingsDisplay) {
      if (currentCurrency === 'INR') {
        savingsDisplay.textContent = formatINR(annualSavings);
      } else {
        savingsDisplay.textContent = `$${Math.round(annualSavings).toLocaleString()}`;
      }
    }

    if (laborDisplay) laborDisplay.textContent = `${laborHours.toLocaleString()} hrs / mo`;
    if (fcrDisplay) fcrDisplay.textContent = `${fcrImprovement} FCR`;
    if (paybackDisplay) paybackDisplay.textContent = `${paybackMonths} Months`;
  };

  // Event listeners for sliders
  pondsInput.addEventListener('input', calculate);
  feedCostInput.addEventListener('input', calculate);

  // Currency Toggle
  if (currencyInrBtn && currencyUsdBtn) {
    currencyInrBtn.addEventListener('click', () => {
      currencyInrBtn.classList.add('active');
      currencyUsdBtn.classList.remove('active');
      currentCurrency = 'INR';
      feedCostInput.min = 25000;
      feedCostInput.max = 1500000;
      feedCostInput.step = 25000;
      feedCostInput.value = 240000;
      calculate();
    });

    currencyUsdBtn.addEventListener('click', () => {
      currencyUsdBtn.classList.add('active');
      currencyInrBtn.classList.remove('active');
      currentCurrency = 'USD';
      feedCostInput.min = 500;
      feedCostInput.max = 20000;
      feedCostInput.step = 250;
      feedCostInput.value = 3200;
      calculate();
    });
  }

  // Initial calculation
  calculate();
}

function formatINR(val) {
  const rounded = Math.round(val);
  return '₹' + rounded.toLocaleString('en-IN');
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
    const ponds = document.getElementById('pondCount')?.value || '1';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = `
          <strong>Thank you, ${escapeHTML(name)}!</strong><br>
          Your request for a FinFloat demonstration on your ${escapeHTML(ponds)}-pond facility has been received. 
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
   7. INTERACTIVE 3D CAD STUDIO & 360 TURNTABLE ENGINE
   ========================================================================== */

function init3DStudio() {
  const TOTAL_FRAMES = 36;
  const frameImages = [];
  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;
  let startFrame = 0;
  let isAutoSpinning = false;
  let autoSpinTimer = null;
  let currentMode = '360'; // '360' or '3d'

  // DOM Elements
  const turntableImg = document.getElementById('turntableImage');
  const hitArea = document.getElementById('turntableHitArea');
  const dragCue = document.getElementById('dragCueOverlay');
  const slider = document.getElementById('turntableSlider');
  const btnToggleSpin = document.getElementById('btnToggleSpin');
  const btnResetSpin = document.getElementById('btnResetSpin');
  const spinBtnLabel = document.getElementById('spinBtnLabel');
  const angleBadgeText = document.getElementById('viewAngleText');
  const presetPills = document.querySelectorAll('.preset-pill');

  // Mode Elements
  const btnMode360 = document.getElementById('btnMode360');
  const btnMode3D = document.getElementById('btnMode3D');
  const layer360 = document.getElementById('turntableViewLayer');
  const layer3D = document.getElementById('cadViewLayer');
  const bar360 = document.getElementById('turntableControlsBar');
  const bar3D = document.getElementById('cadControlsBar');

  // CAD Model-Viewer Elements
  const cadViewer = document.getElementById('cadModelViewer');
  const btnToggleCadRotate = document.getElementById('btnToggleCadRotate');
  const cadRotateBtnLabel = document.getElementById('cadRotateBtnLabel');
  const btnResetCadCamera = document.getElementById('btnResetCadCamera');
  const cadPresetPills = document.querySelectorAll('.preset-cad-pill');

  if (!turntableImg || !hitArea) return;

  // Preload all 36 frames for zero-lag silky turntable scrubbing
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `assets/model-360/frame.${i}.png`;
    frameImages.push(img);
  }

  function getAngleDescription(frame) {
    const deg = Math.round((frame / TOTAL_FRAMES) * 360);
    if (frame === 0) return `Angle: ${deg}° • Starboard (Powered by Precision)`;
    if (frame === 9) return `Angle: ${deg}° • Bow (Dual Optical AI Sensors)`;
    if (frame === 18) return `Angle: ${deg}° • Port Side (Engineered for the Water)`;
    if (frame === 27) return `Angle: ${deg}° • Stern (FinFloat / Micro-Dispenser)`;
    if (frame > 0 && frame < 9) return `Angle: ${deg}° • Quarter-Starboard Bow`;
    if (frame > 9 && frame < 18) return `Angle: ${deg}° • Quarter-Port Bow`;
    if (frame > 18 && frame < 27) return `Angle: ${deg}° • Quarter-Port Stern`;
    return `Angle: ${deg}° • Quarter-Starboard Stern`;
  }

  function setFrame(newFrame, updateSlider = true) {
    currentFrame = ((newFrame % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    turntableImg.src = `assets/model-360/frame.${currentFrame}.png`;

    if (updateSlider && slider) {
      slider.value = currentFrame;
    }

    if (currentMode === '360' && angleBadgeText) {
      angleBadgeText.textContent = getAngleDescription(currentFrame);
    }

    // Update active preset pill if matches exactly
    presetPills.forEach(pill => {
      const pillFrame = parseInt(pill.getAttribute('data-frame'), 10);
      if (pillFrame === currentFrame) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Pointer drag events for smooth touch and mouse interaction
  const DRAG_SENSITIVITY = 10; // pixels per frame

  hitArea.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startFrame = currentFrame;
    hitArea.setPointerCapture(e.pointerId);

    // Stop auto-spin if user touches
    if (isAutoSpinning) {
      stopAutoSpin();
    }

    if (dragCue) {
      dragCue.style.opacity = '0';
    }
  });

  hitArea.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const frameDelta = Math.round(deltaX / DRAG_SENSITIVITY);
    // Invert delta so dragging right rotates clockwise
    setFrame(startFrame - frameDelta);
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try {
      hitArea.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  hitArea.addEventListener('pointerup', endDrag);
  hitArea.addEventListener('pointercancel', endDrag);

  // Slider interaction
  if (slider) {
    slider.addEventListener('input', (e) => {
      if (isAutoSpinning) stopAutoSpin();
      if (dragCue) dragCue.style.opacity = '0';
      setFrame(parseInt(e.target.value, 10), false);
    });
  }

  // Preset Buttons
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (isAutoSpinning) stopAutoSpin();
      if (dragCue) dragCue.style.opacity = '0';
      const targetFrame = parseInt(pill.getAttribute('data-frame'), 10);
      setFrame(targetFrame, true);
    });
  });

  // Auto Spin Play/Pause
  function startAutoSpin() {
    isAutoSpinning = true;
    if (btnToggleSpin) {
      btnToggleSpin.classList.add('active');
      const iconPlay = btnToggleSpin.querySelector('.icon-play');
      const iconPause = btnToggleSpin.querySelector('.icon-pause');
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
      if (spinBtnLabel) spinBtnLabel.textContent = 'Pause';
    }
    if (dragCue) dragCue.style.opacity = '0';

    autoSpinTimer = setInterval(() => {
      setFrame(currentFrame + 1, true);
    }, 85);
  }

  function stopAutoSpin() {
    isAutoSpinning = false;
    clearInterval(autoSpinTimer);
    autoSpinTimer = null;
    if (btnToggleSpin) {
      btnToggleSpin.classList.remove('active');
      const iconPlay = btnToggleSpin.querySelector('.icon-play');
      const iconPause = btnToggleSpin.querySelector('.icon-pause');
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
      if (spinBtnLabel) spinBtnLabel.textContent = 'Auto-Spin';
    }
  }

  if (btnToggleSpin) {
    btnToggleSpin.addEventListener('click', () => {
      if (isAutoSpinning) {
        stopAutoSpin();
      } else {
        startAutoSpin();
      }
    });
  }

  if (btnResetSpin) {
    btnResetSpin.addEventListener('click', () => {
      if (isAutoSpinning) stopAutoSpin();
      setFrame(0, true);
    });
  }

  // Mode Switcher: 360 Turntable vs 3D CAD
  if (btnMode360 && btnMode3D) {
    btnMode360.addEventListener('click', () => {
      currentMode = '360';
      btnMode360.classList.add('active');
      btnMode360.setAttribute('aria-selected', 'true');
      btnMode3D.classList.remove('active');
      btnMode3D.setAttribute('aria-selected', 'false');

      layer360.classList.add('active');
      layer3D.classList.remove('active');
      bar360.style.display = 'flex';
      bar3D.style.display = 'none';

      if (angleBadgeText) {
        angleBadgeText.textContent = getAngleDescription(currentFrame);
      }
    });

    btnMode3D.addEventListener('click', () => {
      currentMode = '3d';
      if (isAutoSpinning) stopAutoSpin();

      btnMode3D.classList.add('active');
      btnMode3D.setAttribute('aria-selected', 'true');
      btnMode360.classList.remove('active');
      btnMode360.setAttribute('aria-selected', 'false');

      layer3D.classList.add('active');
      layer360.classList.remove('active');
      bar3D.style.display = 'flex';
      bar360.style.display = 'none';

      if (angleBadgeText) {
        angleBadgeText.textContent = '3D Real-Time WebGL CAD Mesh Active';
      }
    });
  }

  // CAD Model Viewer Controls
  if (cadViewer) {
    if (btnToggleCadRotate) {
      btnToggleCadRotate.addEventListener('click', () => {
        if (cadViewer.hasAttribute('auto-rotate')) {
          cadViewer.removeAttribute('auto-rotate');
          btnToggleCadRotate.classList.remove('active');
          if (cadRotateBtnLabel) cadRotateBtnLabel.textContent = 'Auto-Rotate: Off';
        } else {
          cadViewer.setAttribute('auto-rotate', '');
          btnToggleCadRotate.classList.add('active');
          if (cadRotateBtnLabel) cadRotateBtnLabel.textContent = 'Auto-Rotate: On';
        }
      });
    }

    if (btnResetCadCamera) {
      btnResetCadCamera.addEventListener('click', () => {
        cadViewer.cameraOrbit = '45deg 70deg 105%';
        if (angleBadgeText) angleBadgeText.textContent = 'Camera Reset to Isometric Default';
        cadPresetPills.forEach((p, i) => {
          if (i === 0) p.classList.add('active');
          else p.classList.remove('active');
        });
      });
    }

    cadPresetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        cadPresetPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const orbit = pill.getAttribute('data-orbit');
        const name = pill.getAttribute('data-name');
        cadViewer.cameraOrbit = orbit;

        if (angleBadgeText) {
          angleBadgeText.textContent = `CAD Angle: ${name}`;
        }
      });
    });
  }

  // Set initial frame
  setFrame(0, true);
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

