// Initial Sample Data
const DEFAULT_TRANSACTIONS = [
  { id: "TRX-1041", customer: "Budi Santoso", category: "Elektronik", date: "2026-11-01", amount: 2450000, status: "Selesai" },
  { id: "TRX-1042", customer: "Siti Rahma", category: "Fashion", date: "2026-11-01", amount: 350000, status: "Selesai" },
  { id: "TRX-1043", customer: "Ahmad Fauzi", category: "Makanan", date: "2026-10-31", amount: 120000, status: "Pending" },
  { id: "TRX-1044", customer: "Dewi Lestari", category: "Kecantikan", date: "2026-10-31", amount: 480000, status: "Selesai" },
  { id: "TRX-1045", customer: "Rian Hidayat", category: "Elektronik", date: "2026-10-30", amount: 1200000, status: "Dibatalkan" },
  { id: "TRX-1046", customer: "Maya Putri", category: "Fashion", date: "2026-10-30", amount: 620000, status: "Selesai" }
];

// App State
let transactions = JSON.parse(localStorage.getItem("dashboard_transactions")) || DEFAULT_TRANSACTIONS;
let revenueChart = null;
let categoryChart = null;
let currentSort = { field: "date", order: "desc" };

// DOM Elements
const currentDateDisplay = document.getElementById("currentDateDisplay");
const statRevenue = document.getElementById("statRevenue");
const statOrders = document.getElementById("statOrders");
const transactionTableBody = document.getElementById("transactionTableBody");
const tableCountDisplay = document.getElementById("tableCountDisplay");
const globalSearch = document.getElementById("globalSearch");
const tableSearch = document.getElementById("tableSearch");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const btnResetFilter = document.getElementById("btnResetFilter");
const btnExportCSV = document.getElementById("btnExportCSV");

// Modal Elements
const transactionModal = document.getElementById("transactionModal");
const btnOpenModal = document.getElementById("btnOpenModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCancelModal = document.getElementById("btnCancelModal");
const transactionForm = document.getElementById("transactionForm");

// Theme Elements
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Sidebar Mobile Elements
const sidebar = document.getElementById("sidebar");
const btnToggleSidebar = document.getElementById("btnToggleSidebar");
const btnCloseSidebar = document.getElementById("btnCloseSidebar");

// Toast Element
const toast = document.getElementById("toast");

// --- Helper Functions ---
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDateIndo(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// --- Date Header ---
function initDateHeader() {
  const now = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  currentDateDisplay.textContent = now.toLocaleDateString('id-ID', options);
}

// --- KPI & Statistics Calculation ---
function updateKPIs() {
  const totalRevenue = transactions
    .filter(t => t.status === "Selesai")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  statRevenue.textContent = formatCurrency(totalRevenue);
  statOrders.textContent = transactions.length;
}

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return String(text).replace(regex, '<span class="highlight">$1</span>');
}

// --- Render Transactions Table ---
function renderTable() {
  const searchTerm = (tableSearch ? tableSearch.value : globalSearch.value || "").toLowerCase().trim();
  const selectedStatus = statusFilter.value;
  const selectedCategory = categoryFilter ? categoryFilter.value : "all";

  let filtered = transactions.filter(t => {
    const matchesSearch = 
      t.customer.toLowerCase().includes(searchTerm) ||
      t.id.toLowerCase().includes(searchTerm) ||
      t.category.toLowerCase().includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sorting
  filtered.sort((a, b) => {
    let valA = a[currentSort.field];
    let valB = b[currentSort.field];

    if (currentSort.field === "amount") {
      valA = Number(valA);
      valB = Number(valB);
    } else if (currentSort.field === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return currentSort.order === "asc" ? -1 : 1;
    if (valA > valB) return currentSort.order === "asc" ? 1 : -1;
    return 0;
  });

  // Update table header icons
  document.querySelectorAll(".sortable").forEach(th => {
    const field = th.getAttribute("data-sort");
    const icon = th.querySelector(".sort-icon");
    if (icon) {
      if (field === currentSort.field) {
        icon.textContent = currentSort.order === "asc" ? "▲" : "▼";
        th.style.color = "var(--primary)";
      } else {
        icon.textContent = "↕";
        th.style.color = "";
      }
    }
  });

  transactionTableBody.innerHTML = "";

  if (filtered.length === 0) {
    transactionTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px;">
          Tidak ada transaksi yang cocok dengan filter atau pencarian Anda.
        </td>
      </tr>
    `;
    tableCountDisplay.textContent = "Menampilkan 0 dari " + transactions.length + " transaksi";
    return;
  }

  filtered.forEach(t => {
    const tr = document.createElement("tr");

    let badgeClass = "badge-success";
    if (t.status === "Pending") badgeClass = "badge-warning";
    if (t.status === "Dibatalkan") badgeClass = "badge-danger";

    tr.innerHTML = `
      <td><strong>${highlightMatch(t.id, searchTerm)}</strong></td>
      <td>${highlightMatch(t.customer, searchTerm)}</td>
      <td>${highlightMatch(t.category, searchTerm)}</td>
      <td>${t.date}</td>
      <td><strong>${formatCurrency(t.amount)}</strong></td>
      <td><span class="badge ${badgeClass}">${t.status}</span></td>
      <td>
        <button class="btn-delete" data-id="${t.id}" title="Hapus Transaksi">🗑️</button>
      </td>
    `;
    transactionTableBody.appendChild(tr);
  });

  tableCountDisplay.textContent = `Menampilkan ${filtered.length} dari ${transactions.length} transaksi`;

  // Attach delete handlers
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteTransaction(id);
    });
  });
}
}

// --- Add & Delete Transaction ---
function deleteTransaction(id) {
  if (confirm(`Yakin ingin menghapus transaksi ${id}?`)) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    renderTable();
    updateKPIs();
    updateCategoryChart();
    showToast(`Transaksi ${id} berhasil dihapus.`);
  }
}

function saveData() {
  localStorage.setItem("dashboard_transactions", JSON.stringify(transactions));
}

// --- Chart.js Configurations ---
const chartDatasets = {
  weekly: {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    revenue: [4200000, 5800000, 4900000, 7100000, 8900000, 9500000, 8350000],
    visitors: [1800, 2100, 1950, 2400, 2900, 3100, 2800]
  },
  monthly: {
    labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
    revenue: [18500000, 22400000, 29800000, 34200000],
    visitors: [7500, 8900, 11200, 12800]
  },
  yearly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    revenue: [32, 28, 35, 41, 45, 52, 58, 62, 59, 68, 72, 85].map(v => v * 1000000),
    visitors: [8200, 7900, 9400, 10500, 11200, 13400, 14200, 15100, 14800, 16500, 17200, 19000]
  }
};

function initCharts() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  // Revenue & Visitors Chart
  const ctxRevenue = document.getElementById("revenueChart").getContext("2d");
  revenueChart = new Chart(ctxRevenue, {
    type: "line",
    data: {
      labels: chartDatasets.weekly.labels,
      datasets: [
        {
          label: "Pendapatan (Rp)",
          data: chartDatasets.weekly.revenue,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79, 70, 229, 0.1)",
          fill: true,
          tension: 0.35,
          yAxisID: "y"
        },
        {
          label: "Pengunjung",
          data: chartDatasets.weekly.visitors,
          borderColor: "#06b6d4",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          tension: 0.35,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            callback: (val) => "Rp " + (val / 1000000) + "Jt"
          }
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: textColor }
        }
      }
    }
  });

  // Category Doughnut Chart
  initCategoryChart();
}

function initCategoryChart() {
  const ctxCat = document.getElementById("categoryChart").getContext("2d");
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  const counts = getCategoryCounts();

  categoryChart = new Chart(ctxCat, {
    type: "doughnut",
    data: {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ["#4f46e5", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: textColor, padding: 14 }
        }
      }
    }
  });
}

function getCategoryCounts() {
  const counts = { "Elektronik": 0, "Fashion": 0, "Makanan": 0, "Kecantikan": 0 };
  transactions.forEach(t => {
    if (counts[t.category] !== undefined) {
      counts[t.category]++;
    } else {
      counts[t.category] = 1;
    }
  });
  return counts;
}

function updateCategoryChart() {
  if (!categoryChart) return;
  const counts = getCategoryCounts();
  categoryChart.data.labels = Object.keys(counts);
  categoryChart.data.datasets[0].data = Object.values(counts);
  categoryChart.update();
}

// Chart period buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const period = btn.getAttribute("data-period");
    const data = chartDatasets[period];

    revenueChart.data.labels = data.labels;
    revenueChart.data.datasets[0].data = data.revenue;
    revenueChart.data.datasets[1].data = data.visitors;
    revenueChart.update();
  });
});

// --- Theme (Dark / Light) ---
function initTheme() {
  const savedTheme = localStorage.getItem("dashboard_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("dashboard_theme", next);
  themeIcon.textContent = next === "dark" ? "☀️" : "🌙";

  // Re-render charts with updated theme colors
  if (revenueChart && categoryChart) {
    revenueChart.destroy();
    categoryChart.destroy();
    initCharts();
  }
});

// --- Modal Handlers ---
function openModal() {
  transactionModal.classList.add("active");
  document.getElementById("customerName").focus();
}

function closeModal() {
  transactionModal.classList.remove("active");
  transactionForm.reset();
}

btnOpenModal.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);
btnCancelModal.addEventListener("click", closeModal);

transactionModal.addEventListener("click", (e) => {
  if (e.target === transactionModal) closeModal();
});

// Form Submit Handler
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const customer = document.getElementById("customerName").value.trim();
  const category = document.getElementById("category").value;
  const amount = Number(document.getElementById("amount").value);
  const status = document.getElementById("status").value;

  const newId = "TRX-" + (1000 + transactions.length + Math.floor(Math.random() * 900));
  const today = new Date().toISOString().split("T")[0];

  const newTransaction = {
    id: newId,
    customer,
    category,
    date: today,
    amount,
    status
  };

  transactions.unshift(newTransaction);
  saveData();
  closeModal();
  renderTable();
  updateKPIs();
  updateCategoryChart();
  showToast(`Transaksi ${newId} berhasil ditambahkan!`);
});

// --- Search, Filters & Sorting Handlers ---
if (globalSearch) {
  globalSearch.addEventListener("input", (e) => {
    if (tableSearch) tableSearch.value = e.target.value;
    renderTable();
  });
}

if (tableSearch) {
  tableSearch.addEventListener("input", (e) => {
    if (globalSearch) globalSearch.value = e.target.value;
    renderTable();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", renderTable);
}

if (statusFilter) {
  statusFilter.addEventListener("change", renderTable);
}

if (btnResetFilter) {
  btnResetFilter.addEventListener("click", () => {
    if (globalSearch) globalSearch.value = "";
    if (tableSearch) tableSearch.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (statusFilter) statusFilter.value = "all";
    currentSort = { field: "date", order: "desc" };
    renderTable();
    showToast("Filter berhasil di-reset.");
  });
}

// Column header sorting
document.querySelectorAll(".sortable").forEach(th => {
  th.addEventListener("click", () => {
    const field = th.getAttribute("data-sort");
    if (currentSort.field === field) {
      currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
    } else {
      currentSort.field = field;
      currentSort.order = "asc";
    }
    renderTable();
  });
});

// --- Export to CSV ---
btnExportCSV.addEventListener("click", () => {
  let csvContent = "data:text/csv;charset=utf-8,ID,Pelanggan,Kategori,Tanggal,Nominal,Status\n";
  transactions.forEach(t => {
    csvContent += `"${t.id}","${t.customer}","${t.category}","${t.date}",${t.amount},"${t.status}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `transaksi_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("File CSV berhasil diunduh!");
});

// --- Mobile Sidebar Toggle ---
btnToggleSidebar.addEventListener("click", () => {
  sidebar.classList.add("open");
});

btnCloseSidebar.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  initDateHeader();
  initTheme();
  updateKPIs();
  renderTable();
  initCharts();
});
