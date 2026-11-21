/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - DEVELOPER ONLY DASHBOARD CONTROLLER
 * Requires authenticated Developer / Trustee session (Register First, Then Login)
 */

document.addEventListener('DOMContentLoaded', () => {
  const lockscreen = document.getElementById('developer-lockscreen');
  const loginForm = document.getElementById('dash-lockscreen-login-form');
  const emailInput = document.getElementById('dev-login-email');
  const passwordInput = document.getElementById('dev-login-password');
  const hintBtn = document.getElementById('btn-fill-hint');
  const errorMsg = document.getElementById('lockscreen-error');
  const logoutBtn = document.getElementById('btn-dev-logout');

  // Check if an authenticated user session is already active
  const currentUser = window.TempleDB ? window.TempleDB.getCurrentUser() : null;

  if (currentUser && (currentUser.role === 'Developer' || currentUser.role === 'Trustee' || sessionStorage.getItem('TEMPLE_DEV_AUTH') === 'true')) {
    unlockDashboard(currentUser);
  } else if (currentUser && currentUser.role === 'Devotee') {
    if (errorMsg) {
      errorMsg.textContent = `⚠️ You are logged in as "${currentUser.name}" (Devotee). Developer privileges required. Please register a Developer account or login with admin credentials.`;
      errorMsg.style.display = 'block';
    }
  }

  // Handle Login on Lockscreen
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = emailInput.value.trim();
      const password = passwordInput.value;

      try {
        const session = window.TempleDB.loginUser(identifier, password);
        if (session.role === 'Developer' || session.role === 'Trustee') {
          sessionStorage.setItem('TEMPLE_DEV_AUTH', 'true');
          unlockDashboard(session);
        } else {
          errorMsg.textContent = `❌ Account "${session.name}" has role "${session.role}". Only Developer or Trustee accounts can access this console.`;
          errorMsg.style.display = 'block';
        }
      } catch (err) {
        errorMsg.textContent = "❌ " + (err.message || "Invalid credentials. Please register first!");
        errorMsg.style.display = 'block';
      }
    });
  }

  // Autofill Demo helper
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'developer@siddhivinayakdham.org';
      if (passwordInput) passwordInput.value = 'admin';
      if (errorMsg) errorMsg.style.display = 'none';
    });
  }

  function unlockDashboard(user) {
    if (lockscreen) {
      lockscreen.style.opacity = '0';
      setTimeout(() => {
        lockscreen.style.display = 'none';
      }, 300);
    }

    // Display active developer identity
    const activeUserName = user ? user.name : 'Authorized Developer';
    const activeRole = user ? user.role : 'Developer';
    
    const userBadge = document.getElementById('dash-active-user-badge');
    if (userBadge) {
      userBadge.textContent = `👤 ${activeUserName} (${activeRole})`;
    }

    initDashboard();
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (window.TempleDB) window.TempleDB.logoutUser();
      sessionStorage.removeItem('TEMPLE_DEV_AUTH');
      window.location.href = 'auth.html?tab=login&redirect=developer-dashboard.html';
    });
  }

  function initDashboard() {
    refreshKPIs();
    renderDonationsTable();
    renderBookingsTable();
    initAnnouncementEditor();
    initConsoleLogs();
    initDataActionButtons();
    renderSevaBreakdown();
  }

  // KPIs
  function refreshKPIs() {
    if (!window.TempleDB) return;
    const stats = window.TempleDB.getStats();

    const elTotal = document.getElementById('kpi-total-donations');
    const elDonors = document.getElementById('kpi-total-donors');
    const elBookings = document.getElementById('kpi-total-bookings');
    const elVisitors = document.getElementById('kpi-total-visitors');

    if (elTotal) elTotal.textContent = "₹" + stats.totalDonations.toLocaleString('en-IN');
    if (elDonors) elDonors.textContent = stats.donorCount.toLocaleString();
    if (elBookings) elBookings.textContent = stats.bookingCount.toLocaleString();
    if (elVisitors) elVisitors.textContent = stats.estimatedAartiVisitors.toLocaleString();
  }

  // Seva Breakdown visualization
  function renderSevaBreakdown() {
    const container = document.getElementById('seva-breakdown-bars');
    if (!container || !window.TempleDB) return;

    const stats = window.TempleDB.getStats();
    const breakdown = stats.sevaBreakdown;
    const total = stats.totalDonations || 1;

    let html = '';
    for (const [seva, amount] of Object.entries(breakdown)) {
      const pct = Math.round((amount / total) * 100);
      html += `
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
            <span>${seva}</span>
            <span style="font-weight: 700; color: #f59e0b;">₹${amount.toLocaleString('en-IN')} (${pct}%)</span>
          </div>
          <div style="background: #374151; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #f59e0b, #ef4444); width: ${pct}%; height: 100%;"></div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  // Donations Table with Live Search & Filter
  function renderDonationsTable(query = '', filterSeva = 'ALL') {
    const tableBody = document.getElementById('donations-tbody');
    if (!tableBody || !window.TempleDB) return;

    let donations = window.TempleDB.getDonations();

    if (query) {
      const q = query.toLowerCase();
      donations = donations.filter(d => 
        (d.donorName && d.donorName.toLowerCase().includes(q)) ||
        (d.phone && d.phone.includes(q)) ||
        (d.id && d.id.toLowerCase().includes(q)) ||
        (d.pan && d.pan.toLowerCase().includes(q))
      );
    }

    if (filterSeva !== 'ALL') {
      donations = donations.filter(d => d.sevaType && d.sevaType.includes(filterSeva));
    }

    if (donations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #9ca3af; padding: 2rem;">No donations found matching criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = donations.map(d => `
      <tr>
        <td style="font-family: monospace; color: #fbbf24;">${d.id}</td>
        <td>
          <div style="font-weight: 600; color: #fff;">${d.donorName}</div>
          <div style="font-size: 0.75rem; color: #9ca3af;">${d.phone} &bull; ${d.email || 'No email'}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: #e5e7eb;">${d.sevaType}</div>
          <div style="font-size: 0.75rem; color: #9ca3af;">Gotra: ${d.gotra || 'Kashyapa'}</div>
        </td>
        <td style="font-family: 'Cinzel', serif; font-weight: 700; color: #10b981; font-size: 1rem;">
          ₹${Number(d.amount).toLocaleString('en-IN')}
        </td>
        <td>
          <span style="font-size: 0.8rem; color: #9ca3af;">${d.paymentMode || 'UPI'}</span>
        </td>
        <td>
          <span class="badge-status badge-success">${d.status || 'Verified'}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-gold" onclick="alert('Receipt #${d.receiptNo}\\nDonor: ${d.donorName}\\nAmount: ₹${d.amount}\\nStatus: Verified')">
            Receipt
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Search and Filter Listeners
  const searchInput = document.getElementById('search-donations-input');
  const sevaFilterSelect = document.getElementById('filter-seva-select');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderDonationsTable(e.target.value, sevaFilterSelect ? sevaFilterSelect.value : 'ALL');
    });
  }

  if (sevaFilterSelect) {
    sevaFilterSelect.addEventListener('change', (e) => {
      renderDonationsTable(searchInput ? searchInput.value : '', e.target.value);
    });
  }

  // Bookings Table
  function renderBookingsTable() {
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody || !window.TempleDB) return;

    const bookings = window.TempleDB.getBookings();
    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td style="font-family: monospace; color: #60a5fa;">${b.id}</td>
        <td style="font-weight: 600; color: #fff;">${b.devoteeName}</td>
        <td style="color: #f59e0b;">${b.poojaName}</td>
        <td>📅 ${b.date} &bull; ⏰ ${b.time}</td>
        <td>${b.priest}</td>
        <td style="color: #10b981; font-weight: 700;">₹${b.amountPaid}</td>
        <td><span class="badge-status badge-success">${b.status}</span></td>
      </tr>
    `).join('');
  }

  // Live Announcement Editor
  function initAnnouncementEditor() {
    const input = document.getElementById('announcement-editor-input');
    const btn = document.getElementById('btn-publish-announcement');
    const statusMsg = document.getElementById('broadcast-status-msg');

    if (input && window.TempleDB) {
      input.value = window.TempleDB.getAnnouncement();
    }

    if (btn && input) {
      btn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text) {
          window.TempleDB.setAnnouncement(text);
          if (statusMsg) {
            statusMsg.style.display = 'block';
            statusMsg.textContent = '✅ Broadcast published live to website header!';
            setTimeout(() => statusMsg.style.display = 'none', 3000);
          }
          appendConsoleLog("BROADCAST", `Updated live announcement banner: ${text.substring(0, 30)}...`);
        }
      });
    }
  }

  // Data Action Buttons
  function initDataActionButtons() {
    const btnSeed = document.getElementById('btn-seed-data');
    const btnReset = document.getElementById('btn-reset-db');
    const btnExportCSV = document.getElementById('btn-export-csv');
    const btnExportJSON = document.getElementById('btn-export-json');

    if (btnSeed) {
      btnSeed.addEventListener('click', () => {
        window.TempleDB.seedSampleData();
        refreshKPIs();
        renderDonationsTable();
        renderBookingsTable();
        renderSevaBreakdown();
        appendConsoleLog("DB", "Re-seeded database with sample temple records.");
        alert("Sample Devotee & Donation data populated!");
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all records?")) {
          window.TempleDB.resetAll();
          refreshKPIs();
          renderDonationsTable();
          renderBookingsTable();
          renderSevaBreakdown();
          appendConsoleLog("DB", "Wiped all storage.");
        }
      });
    }

    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => {
        window.TempleDB.exportCSV();
        appendConsoleLog("EXPORT", "Downloaded CSV report.");
      });
    }

    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => {
        window.TempleDB.exportJSON();
        appendConsoleLog("BACKUP", "Downloaded full JSON database snapshot.");
      });
    }
  }

  // Console Logs
  function initConsoleLogs() {
    const consoleBox = document.getElementById('terminal-logs-box');
    if (!consoleBox || !window.TempleDB) return;

    const logs = window.TempleDB.getLogs();
    consoleBox.innerHTML = logs.map(l => `
      <div class="terminal-line">
        <span class="terminal-time">[${l.timestamp}]</span>
        <span style="color: ${l.type === 'DONATION' ? '#10b981' : l.type === 'BROADCAST' ? '#f59e0b' : '#3b82f6'}; font-weight: bold;">[${l.type}]</span>
        ${l.message}
      </div>
    `).join('');
  }

  function appendConsoleLog(type, message) {
    const consoleBox = document.getElementById('terminal-logs-box');
    if (!consoleBox) return;
    const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = `<span class="terminal-time">[${time}]</span> <span style="color: #f59e0b; font-weight: bold;">[${type}]</span> ${message}`;
    consoleBox.insertBefore(div, consoleBox.firstChild);
  }
});
