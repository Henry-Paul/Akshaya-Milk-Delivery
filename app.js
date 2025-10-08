/**
 * app.js
 * Akshaya Milk Delivery - client-only PWA demo
 * No real keys. Replace placeholders before production.
 */

/* =============== CONFIG =============== */
const CONFIG = {
  SAMPLE_KEY: 'akshaya_sample_loaded_v1',
  LS_PREFIX: 'akshaya_',
  PLACEHOLDER_UPI: 'UPI_PLACEHOLDER@ybl',
  GOOGLE_MAPS_API_KEY: '<GOOGLE_MAPS_API_KEY>',
  REPO_URL: 'https://github.com/<your-username>/Akshaya-Milk-Delivery'
};

/* =============== UTIL =============== */
const $ = s => document.querySelector(s);
const $all = s => Array.from(document.querySelectorAll(s));
const lsKey = k => CONFIG.LS_PREFIX + k;
const now = () => new Date().toISOString();

/* =============== SAMPLE DATA LOADING =============== */
async function loadSampleDataOnce() {
  if (localStorage.getItem(CONFIG.SAMPLE_KEY)) return;
  try {
    const res = await fetch('/sample-data.json');
    const data = await res.json();
    // store samples namespaced
    localStorage.setItem(lsKey('agencies'), JSON.stringify(data.agencies));
    localStorage.setItem(lsKey('customers'), JSON.stringify(data.customers));
    localStorage.setItem(lsKey('payments'), JSON.stringify([]));
    localStorage.setItem(lsKey('deliveries'), JSON.stringify(data.deliveries || {}));
    localStorage.setItem(lsKey('subscriptions'), JSON.stringify(data.subscriptions || []));
    localStorage.setItem(CONFIG.SAMPLE_KEY, '1');
    console.log('Sample data loaded');
  } catch (e) {
    console.warn('Could not load sample-data.json', e);
  }
}

/* =============== AUTH / SESSION =============== */
const Session = {
  current: null,
  login(role, email) {
    const session = { role, email, startedAt: now() };
    localStorage.setItem(lsKey('session'), JSON.stringify(session));
    this.current = session;
    renderForRole(role);
  },
  logout() {
    localStorage.removeItem(lsKey('session'));
    this.current = null;
    renderForRole(null);
  },
  restore() {
    const s = localStorage.getItem(lsKey('session'));
    if (s) this.current = JSON.parse(s);
  }
};

/* =============== DATA HELPERS =============== */
function getAgencies() {
  return JSON.parse(localStorage.getItem(lsKey('agencies')) || '[]');
}
function saveAgencies(a){ localStorage.setItem(lsKey('agencies'), JSON.stringify(a)); }
function getCustomers(){ return JSON.parse(localStorage.getItem(lsKey('customers')) || '[]'); }
function saveCustomers(c){ localStorage.setItem(lsKey('customers'), JSON.stringify(c)); }
function getPayments(){ return JSON.parse(localStorage.getItem(lsKey('payments')) || '[]'); }
function savePayments(p){ localStorage.setItem(lsKey('payments'), JSON.stringify(p)); }
function getDeliveries(){ return JSON.parse(localStorage.getItem(lsKey('deliveries')) || '{}'); }
function saveDeliveries(d){ localStorage.setItem(lsKey('deliveries'), JSON.stringify(d)); }
function getSubscriptions(){ return JSON.parse(localStorage.getItem(lsKey('subscriptions')) || '[]'); }
function saveSubscriptions(s){ localStorage.setItem(lsKey('subscriptions'), JSON.stringify(s)); }

/* =============== UI RENDERING =============== */
function hideAllPortals(){ $all('.portal').forEach(el=>el.classList.add('hidden')); $('#loginSection').classList.remove('hidden'); }
function renderForRole(role) {
  hideAllPortals();
  if (!role) return;
  $('#loginSection').classList.add('hidden');
  if (role === 'owner') {
    $('#ownerPortal').classList.remove('hidden');
    renderOwner();
  } else if (role === 'agency') {
    $('#agencyPortal').classList.remove('hidden');
    renderAgency();
  } else if (role === 'customer') {
    $('#customerPortal').classList.remove('hidden');
    renderCustomer();
  }
}

/* OWNER */
function renderOwner(){
  const agencies = getAgencies();
  const payments = getPayments();
  const totalRevenue = payments.reduce((s,p)=>s + (p.amount||0),0);
  $('#ownerRevenue').textContent = `₹${totalRevenue}`;
  $('#agencyList').innerHTML = agencies.map(a => {
    const html = `<div class="card"><h4>${escapeHtml(a.businessName)}</h4>
      <div>Agency email: ${escapeHtml(a.email)}</div>
      <div>Customers: ${a.customers?.length || 0}</div>
      <div>Subscription: ${a.plan || 'free'}</div>
    </div>`;
    return html;
  }).join('');
  const subs = getSubscriptions();
  $('#ownerSubs').textContent = `Plans: ${subs.length}`;
  $('#ownerAnalytics').textContent = JSON.stringify({
    totalAgencies: agencies.length,
    totalCustomers: getCustomers().length,
    totalRevenue,
    sampleDate: new Date().toLocaleString()
  }, null, 2);
}

/* AGENCY */
function renderAgency(){
  const agencies = getAgencies();
  const agency = agencies[0] || agencies.find(a => a.email === 'agency@akshaya.com') || null;
  if (!agency) {
    $('#agencyPanel').innerHTML = '<div class="muted">No agency found in sample data.</div>';
    return;
  }
  // apply brand
  applyBrand(agency);
  $('#businessName').value = agency.businessName || '';
  $('#brandColor').value = agency.brandColor || '#1976d2';
  $('#logoUrl').value = agency.logo || '';

  // trial badge
  const trialRemaining = computeTrialRemaining(agency);
  $('#trialBadge').innerHTML = trialRemaining > 0 ? `<div class="muted">Trial: ${trialRemaining} day(s) remaining. <a href="${buildWaLink('','Hello, my trial status')}" target="_blank">Notify via WhatsApp</a></div>` : `<div class="muted">Trial expired</div>`;

  // customers
  const customers = getCustomers().filter(c => c.agencyId === agency.id);
  $('#customersList').innerHTML = customers.map(c => `<div class="card"><strong>${escapeHtml(c.name)}</strong><div>${escapeHtml(c.phone)}</div></div>`).join('') || '<div class="muted">No customers yet</div>';

  // delivery calendar (simple - 7 days)
  renderDeliveryCalendarForAgency(agency);
}

function computeTrialRemaining(agency){
  if (!agency || !agency.trialStarts) return 0;
  const start = new Date(agency.trialStarts);
  const days = 5;
  const end = new Date(start.getTime() + days*24*60*60*1000);
  const diff = Math.ceil((end - new Date()) / (24*60*60*1000));
  return Math.max(0, diff);
}

function applyBrand(agency){
  if (!agency) return;
  document.documentElement.style.setProperty('--brand', agency.brandColor || '#1976d2');
  $('#brandLogo').src = agency.logo || '/icons/icon-192.png';
  $('#brandTitle').textContent = agency.businessName || 'Akshaya Milk Delivery';
}

/* Customer */
function renderCustomer(){
  const customers = getCustomers();
  const cust = customers.find(c => c.email === 'customer@akshaya.com') || customers[0];
  if (!cust) {
    $('#customerSub').innerHTML = '<div class="muted">No customer in sample data.</div>';
    return;
  }
  $('#customerSub').innerHTML = `<div>${escapeHtml(cust.name)} - ${escapeHtml(cust.package || '500ml')}</div>`;
  const history = getDeliveries()[cust.id] || [];
  $('#customerHistory').innerHTML = history.length ? history.map(h => `<div>${h.date} - ${h.status}</div>`).join('') : '<div class="muted">No deliveries yet</div>';
  // map
  initMap('mapContainer', CONFIG.GOOGLE_MAPS_API_KEY);
}

/* Delivery calendar rendering */
function renderDeliveryCalendarForAgency(agency){
  const cal = $('#deliveryCalendar');
  cal.innerHTML = '';
  const today = new Date();
  for (let i=0;i<14;i++){
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i);
    const key = formatDate(d);
    const deliveries = getDeliveries();
    const status = deliveries[agency.id] && deliveries[agency.id][key] ? deliveries[agency.id][key].status : 'pending';
    const el = document.createElement('div');
    el.className = 'day card';
    el.innerHTML = `<div>${d.getDate()}/${d.getMonth()+1}</div><div><button data-day="${key}">${status==='done'?'✓':'Mark'}</button></div>`;
    el.querySelector('button').addEventListener('click', ()=> {
      markDelivery(agency.id, key);
      renderDeliveryCalendarForAgency(agency);
      renderAgency(); // refresh revenue info
    });
    cal.appendChild(el);
  }
}

/* Mark delivery for agency */
function markDelivery(agencyId, dayKey){
  const deliveries = getDeliveries();
  deliveries[agencyId] = deliveries[agencyId] || {};
  deliveries[agencyId][dayKey] = { status: 'done', recordedAt: now() };
  // increment payment/revenue: assume ₹30 per packet x 1
  const payments = getPayments();
  payments.push({ id: 'pay_' + Date.now(), agencyId, amount: 30, method: 'cash', date: now(), note: 'auto-delivery' });
  savePayments(payments);
  saveDeliveries(deliveries);
}

/* Payments (mock) */
function mockPay(paymentInfo){
  // PaymentInfo: {agencyId, customerId, amount, method}
  const payments = getPayments();
  payments.push({ ...paymentInfo, id: 'pay_'+Date.now(), date: now() });
  savePayments(payments);
  return true;
}

/* WhatsApp helper */
function buildWaLink(phone, text){
  // phone optional. wa.me requires country code - left to user
  const body = encodeURIComponent(text || 'Hello from Akshaya!');
  if (phone) return `https://wa.me/${phone}?text=${body}`;
  return `https://wa.me/?text=${body}`;
}

/* MAPS: placeholder */
function initMap(containerId, apiKey){
  const container = document.getElementById(containerId);
  const fallback = $('#mapFallback');
  if (!apiKey || apiKey.includes('<')) {
    container.style.display = 'none';
    fallback.textContent = 'Google Maps key not set. To enable maps, add GOOGLE_MAPS_API_KEY to app config. (This demo shows a placeholder.)';
    return;
  }
  // If key present, try to inject script and initialize (very light)
  const scriptId = 'gmapjs';
  if (document.getElementById(scriptId)) {
    fallback.textContent = '';
    return;
  }
  const s = document.createElement('script');
  s.id = scriptId;
  s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__initAkshayaMap`;
  s.async = true;
  window.__initAkshayaMap = () => {
    const map = new google.maps.Map(document.getElementById(containerId), { center: {lat:12.97,lng:77.59}, zoom:12 });
    new google.maps.Marker({ position: {lat:12.97,lng:77.59}, map });
  };
  document.head.appendChild(s);
}

/* =============== UTILITIES =============== */
function formatDate(d){ return d.toISOString().slice(0,10); }
function escapeHtml(str=''){ return String(str).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

/* =============== UI EVENTS =============== */
function wireEvents(){
  // role switcher
  $('#roleSelect').addEventListener('change', e => {
    const role = e.target.value;
    Session.login(role, `${role}@akshaya.com`);
  });

  $('#btnLoginDemo').addEventListener('click', ()=> {
    const role = $('#roleSelect').value;
    // demo credentials as required:
    if (role === 'owner') Session.login('owner', 'owner@akshaya.com');
    if (role === 'agency') Session.login('agency', 'agency@akshaya.com');
    if (role === 'customer') Session.login('customer', 'customer@akshaya.com');
  });

  $('#loginForm').addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const email = $('#email').value;
    const pw = $('#password').value;
    // simple demo acceptance
    if (!email) return alert('Enter email');
    const role = email.includes('owner') ? 'owner' : email.includes('agency') ? 'agency' : 'customer';
    Session.login(role, email);
  });

  $('#saveBrand').addEventListener('click', ()=>{
    const agencies = getAgencies();
    const agency = agencies[0];
    if (!agency) return alert('No agency to update');
    agency.businessName = $('#businessName').value || agency.businessName;
    agency.brandColor = $('#brandColor').value || agency.brandColor;
    agency.logo = $('#logoUrl').value || agency.logo;
    saveAgencies(agencies);
    applyBrand(agency);
    alert('Brand updated (saved to localStorage)');
  });

  $('#btnAddCustomer').addEventListener('click', ()=>{
    showModal(`<h3>Add Customer</h3>
      <label>Name <input id="m_name"></label>
      <label>Phone <input id="m_phone"></label>
      <button id="m_save">Save</button>`);
    $('#m_save').addEventListener('click', ()=>{
      const name = $('#m_name').value; const phone = $('#m_phone').value;
      if (!name) return alert('Enter name');
      const customers = getCustomers();
      const agencies = getAgencies();
      const agency = agencies[0];
      const c = { id: 'cust_' + Date.now(), name, phone, email: `${name.replace(/\s/g,'').toLowerCase()}@example.com`, agencyId: agency.id, package: '500ml' };
      customers.push(c); saveCustomers(customers);
      closeModal();
      renderAgency();
    });
  });

  $('#btnPlaceOrder').addEventListener('click', ()=>{
    showModal(`<h3>Mock Payment</h3><p>Amount: ₹30</p><p>UPI: ${escapeHtml(CONFIG.PLACEHOLDER_UPI)}</p><button id="payNow">Pay (Mock)</button>`);
    $('#payNow').addEventListener('click', ()=>{
      const payments = { agencyId: getAgencies()[0].id, customerId: getCustomers()[0].id, amount: 30, method: 'UPI', note: 'mock' };
      mockPay(payments);
      alert('Payment recorded (mock).');
      closeModal();
      renderCustomer();
    });
  });

  // modal close
  $('#modalClose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', (e)=> { if (e.target === $('#modal')) closeModal(); });

  // repo link set
  document.querySelectorAll('#repoLink,#repoLink2').forEach(a => a.href = CONFIG.REPO_URL);
}

/* Modal helpers */
function showModal(html) {
  $('#modalBody').innerHTML = html;
  $('#modal').classList.remove('hidden');
}
function closeModal(){ $('#modal').classList.add('hidden'); $('#modalBody').innerHTML = ''; }

/* =============== PWA: service worker registration =============== */
function registerSW(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW registered', reg);
    }).catch(err => console.warn('SW reg failed', err));
  }
}

/* =============== INIT =============== */
async function init(){
  await loadSampleDataOnce();
  Session.restore();
  wireEvents();
  // Restore UI for session
  if (Session.current) {
    renderForRole(Session.current.role);
  } else {
    $('#roleSelect').value = 'owner';
    hideAllPortals();
  }
  // try to register service worker
  registerSW();
}

init();
window.renderForRole = renderForRole; // expose for debugging
window.buildWaLink = buildWaLink;

/* =============== SMALL SANITY HELPERS =============== */
console.log('Akshaya PWA demo loaded. Demo credentials: owner@akshaya.com, agency@akshaya.com, customer@akshaya.com (any password).');
