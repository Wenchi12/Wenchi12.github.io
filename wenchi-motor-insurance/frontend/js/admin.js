/* ============================================
   WENCHI ADMIN DASHBOARD JS
   ============================================ */

const API_BASE_URL = 'http://localhost:4000/api';
let quotesCache = [];

// Load quotes on page load
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  // Refresh every 30 seconds
  setInterval(loadQuotes, 30000);
  document.getElementById('filterStatus')?.addEventListener('change', () => displayQuotes(applyFilter()));
  document.getElementById('exportCsvBtn')?.addEventListener('click', () => exportCSV(quotesCache));
});

// Load and display quotes
async function loadQuotes() {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
    const response = await fetch(`${API_BASE_URL}/admin/quotes`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to load quotes');
    }

    const quotes = await response.json();
    quotesCache = quotes;
    const filtered = applyFilter();
    displayQuotes(filtered);
    updateStats(quotes);

  } catch (error) {
    console.error('Error:', error);
    showTableError('Failed to load quotes. Make sure backend is running and you are logged in.');
  }
}

// Display quotes in table
function displayQuotes(quotes) {
  const tbody = document.querySelector('.quotes-table tbody');
  
  if (!quotes || quotes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; padding: 30px; color: #999;">
          No quotes available yet
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = quotes.map((quote, index) => `
    <tr>
      <td>#${quote.id}</td>
      <td>${quote.full_name}</td>
      <td>${quote.email}</td>
      <td>${quote.vehicle_type}</td>
      <td>ZMW ${parseFloat(quote.market_value).toLocaleString()}</td>
      <td>${quote.coverage_type}</td>
      <td><strong>ZMW ${parseFloat(quote.premium).toLocaleString()}</strong></td>
      <td>${quote.status || 'generated'}</td>
      <td>${quote.paid_reference || '-'}</td>
      <td>${formatDate(quote.created_at)}</td>
      <td>
        ${quote.status === 'paid' ? '<span class="paid-badge">Paid</span>' : `<button class="btn btn-small" onclick="markPaid(${quote.id})">Mark Paid</button>`}
        ${quote.paid_reference && (quote.status || 'generated') !== 'paid' ? ` <button class="btn btn-small" onclick="verifyPayment('${quote.paid_reference}', ${quote.id})">Verify</button>` : ''}
      </td>
    </tr>
  `).join('');
}

// mark quote paid manually from admin UI
async function markPaid(quoteId) {
  if (!confirm('Mark quote #' + quoteId + ' as paid?')) return;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/quotes/${quoteId}/paid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ reference: 'manual-admin' })
    });
    if (!res.ok) throw new Error('Failed');
    showToast('Quote marked paid');
    loadQuotes();
  } catch (err) {
    console.error(err);
    showToast('Failed to mark paid');
  }
}

// Update statistics
function updateStats(quotes) {
  if (quotes.length === 0) {
    document.getElementById('totalQuotes').textContent = '0';
    document.getElementById('totalRevenue').textContent = '0';
    document.getElementById('popularCoverage').textContent = '-';
    document.getElementById('avgPremium').textContent = '0';
    return;
  }

  // Total quotes
  document.getElementById('totalQuotes').textContent = quotes.length;

  // Total revenue
  const totalRevenue = quotes.reduce((sum, q) => sum + parseFloat(q.premium), 0);
  document.getElementById('totalRevenue').textContent = Math.round(totalRevenue).toLocaleString();

  // Popular coverage
  const coverageCounts = {};
  quotes.forEach(q => {
    coverageCounts[q.coverage_type] = (coverageCounts[q.coverage_type] || 0) + 1;
  });
  const popularType = Object.keys(coverageCounts).reduce((a, b) => 
    coverageCounts[a] > coverageCounts[b] ? a : b
  );
  document.getElementById('popularCoverage').textContent = popularType;

  // Average premium
  const avgPremium = totalRevenue / quotes.length;
  document.getElementById('avgPremium').textContent = Math.round(avgPremium).toLocaleString();
}

// Format date
function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show error in table
function showTableError(message) {
  const tbody = document.querySelector('.quotes-table tbody');
  tbody.innerHTML = `
    <tr>
      <td colspan="12" style="text-align: center; padding: 30px; color: red;">
        ${message}
      </td>
    </tr>
  `;
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// apply filter to cached quotes
function applyFilter() {
  const filter = document.getElementById('filterStatus')?.value || 'all';
  if (filter === 'all') return quotesCache;
  if (filter === 'paid') return quotesCache.filter(q => (q.status || 'generated') === 'paid');
  if (filter === 'unpaid') return quotesCache.filter(q => (q.status || 'generated') !== 'paid');
  return quotesCache;
}

// export CSV from quotes
function exportCSV(quotes) {
  if (!quotes || !quotes.length) {
    showToast('No data to export');
    return;
  }
  const headers = ['id','full_name','email','vehicle_type','market_value','coverage_type','premium','status','paid_reference','created_at'];
  const rows = quotes.map(q => headers.map(h => `"${(q[h]||'').toString().replace(/"/g,'""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quotes_export_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Verify a payment reference by calling backend verify endpoint
async function verifyPayment(reference, quoteId) {
  if (!confirm('Verify payment reference ' + reference + ' with gateway?')) return;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/payments/verify/${encodeURIComponent(reference)}`, {
      headers: { 'Authorization': token ? 'Bearer ' + token : '' }
    });
    if (!res.ok) throw new Error('verify failed');
    const data = await res.json();
    showToast('Verification: ' + data.verified);
    loadQuotes();
  } catch (err) {
    console.error(err);
    showToast('Verification failed');
  }
}
