const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? `http://${window.location.hostname}:5000/api`
  : "/api";

// ── Helpers ──────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const token = () => localStorage.getItem("buildyourthoughts_token");

function showPage(page) {
  $("login-page").classList.toggle("hidden", page !== "login");
  $("dashboard-page").classList.toggle("hidden", page !== "dashboard");
}

function setSection(name) {
  document.querySelectorAll(".section").forEach((s) => s.classList.add("hidden"));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  $(`section-${name}`).classList.remove("hidden");
  document.querySelector(`[data-section="${name}"]`).classList.add("active");
  $("section-title").textContent = name.charAt(0).toUpperCase() + name.slice(1);
}

// ── Auth ─────────────────────────────────────────────
function logoutAndRedirect() {
  localStorage.removeItem("buildyourthoughts_token");
  $("login-error").classList.add("hidden");
  showPage("login");
}

async function checkAuth() {
  const t = token();
  if (!t) return showPage("login");
  try {
    const res = await fetch(`${API}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: t }),
    });
    const data = await res.json();
    if (data.valid) {
      initDashboard(data.admin);
    } else {
      logoutAndRedirect();
    }
  } catch {
    logoutAndRedirect();
  }
}

$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("login-btn");
  const errEl = $("login-error");
  errEl.classList.add("hidden");
  btn.disabled = true;
  btn.textContent = "Signing in…";

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: $("email").value, password: $("password").value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("buildyourthoughts_token", data.token);
    initDashboard(data.admin);
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
});

$("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("buildyourthoughts_token");
  showPage("login");
});

// ── Dashboard ─────────────────────────────────────────
async function initDashboard(admin) {
  showPage("dashboard");
  const now = new Date().getHours();
  const greet = now < 12 ? "Good morning" : now < 17 ? "Good afternoon" : "Good evening";
  $("admin-greeting").textContent = `${greet}, ${admin.name} 👋`;
  $("admin-badge").textContent = admin.role;
  $("settings-email").textContent = admin.email;
  $("settings-role").textContent = admin.role;

  await Promise.all([loadStats(), loadProjects(), loadActivity()]);

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      setSection(item.dataset.section);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('sidebar-open');
        document.getElementById('sidebar-overlay').classList.remove('active');
      }
    });
  });
}

async function apiFetch(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  if (res.status === 401 || res.status === 403) {
    logoutAndRedirect();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("API error");
  return res.json();
}

async function loadStats() {
  try {
    const s = await apiFetch("/dashboard/stats");
    const cards = [
      { icon: "🚀", value: s.projects.total + "+", label: "Total Projects", sub: `${s.projects.active} active` },
      { icon: "👥", value: s.clients.total + "+", label: "Happy Clients", sub: `+${s.clients.new} this month` },
      { icon: "💰", value: s.revenue.monthly, label: "Monthly Revenue", sub: s.revenue.growth },
      { icon: "🧑‍💻", value: s.team.total + "+", label: "Team Members", sub: `${s.team.departments} departments` },
      { icon: "✉️", value: s.messages.unread, label: "Unread Messages", sub: `${s.messages.total} total` },
      { icon: "⚡", value: s.uptime, label: "Uptime", sub: "Last 30 days" },
    ];
    $("stats-grid").innerHTML = cards.map((c) => `
      <div class="stat-card">
        <div class="stat-icon">${c.icon}</div>
        <div class="stat-value">${c.value}</div>
        <div class="stat-label">${c.label}</div>
        <div class="stat-sub">${c.sub}</div>
      </div>`).join("");
  } catch {}
}

async function loadProjects() {
  try {
    const projects = await apiFetch("/dashboard/projects");
    const tableHTML = `
      <table>
        <thead><tr>
          <th>#</th><th>Project</th><th>Client</th><th>Tech Stack</th><th>Date</th><th>Status</th>
        </tr></thead>
        <tbody>${projects.map((p) => `
          <tr>
            <td>${p.id}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.client}</td>
            <td>${p.tech}</td>
            <td>${p.date}</td>
            <td><span class="status ${p.status.toLowerCase().replace(" ", "-")}">${p.status}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>`;
    $("projects-table-container").innerHTML = tableHTML;
    $("projects-table-container-2").innerHTML = tableHTML;
  } catch {}
}

async function loadActivity() {
  try {
    const items = await apiFetch("/dashboard/activity");
    $("activity-list").innerHTML = items.map((a) => `
      <div class="activity-item">
        <div class="activity-dot dot-${a.color}"></div>
        <div>
          <div class="activity-msg">${a.message}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>`).join("");
  } catch {}
}

// ── Init ──────────────────────────────────────────────
checkAuth();
