function closeMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn = document.querySelector('.mobile-menu-btn');
  if (menu) menu.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}
function toggleMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn = document.querySelector('.mobile-menu-btn');
  if (!menu || !btn) return;
  var open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
function updateScrollChrome() {
  var nav = document.querySelector('nav');
  var topBtn = document.querySelector('.scroll-top');
  var active = window.pageYOffset > 80;
  if (nav) nav.classList.toggle('nav-shrunk', active);
  if (topBtn) topBtn.classList.toggle('visible', window.pageYOffset > 520);
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('scroll', updateScrollChrome, { passive:true });
updateScrollChrome();

  /* ─────────────────────────────────────────
   NAVIGATION — single clean function
   No conflicts with window.scrollTo
   ───────────────────────────────────────── */
function gotoPage(page, anchor) {
  closeMobileMenu();
  window.location.assign((page === 'main' ? '/' : '/' + page + '/') + (anchor || ''));
}

/* ─────────────────────────────────────────
   SERVICES TAB
───────────────────────────────────────── */
var servicesData = [
  { tag:'Strategy', title:'Strategic Planning & Business Direction',
    desc:'We work with MSME founders and leadership teams to craft clear, executable business strategies — defining where to play, how to win, and what to stop doing.',
    points:['Business diagnosis and competitive landscape mapping','Vision, mission and 3-year strategic roadmap','SWOT, PESTLE, and Five Forces deep-dives','OKR / KPI framework design and cascade','Strategy review and refresh cycles'] },
  { tag:'Cost Excellence', title:'Cost Improvement & Margin Expansion',
    desc:'For MSMEs, a 5% cost reduction can mean a 30% jump in profitability. We identify structural cost leakages across procurement, operations, overheads, and logistics.',
    points:['Cost baseline analysis and benchmarking','Procurement optimisation and vendor rationalisation','Zero-Based Budgeting design and implementation','Overhead and SG&A reduction programs','Working capital and cash flow improvement'] },
  { tag:'Supply Chain', title:'Supply Chain Design & Optimisation',
    desc:'From raw material sourcing to last-mile delivery, we help you build supply chains that are lean, visible, and resilient — especially critical for manufacturing MSMEs.',
    points:['End-to-end supply chain mapping and diagnostics','Inventory optimisation and demand forecasting','Supplier evaluation, development, and risk management','Logistics and distribution network design','Supply chain digitisation and technology roadmap'] },
  { tag:'Operations', title:'Operational Excellence & Process Improvement',
    desc:'Operational inefficiency is often invisible until measured. We bring Lean and Six Sigma methodologies to MSME operations — driving throughput, quality, and speed.',
    points:['Process mapping and value stream analysis','Lean transformation and waste elimination','Quality management system design','Productivity benchmarking and improvement','Standard Operating Procedure (SOP) development'] }
];

function setService(i) {
  document.querySelectorAll('.service-tab').forEach(function(t,idx){ t.classList.toggle('active', idx === i); t.setAttribute('aria-pressed', String(idx === i)); });
  var d = servicesData[i];
  var detail = document.getElementById('serviceDetail');
  if (!detail) return;
  detail.innerHTML =
    '<div class="service-detail-tag">'+d.tag+'</div>' +
    '<h3>'+d.title+'</h3>' +
    '<p>'+d.desc+'</p>' +
    '<ul class="service-bullets">'+d.points.map(function(p){return '<li>'+p+'</li>';}).join('')+'</ul>' +
    '<div style="margin-top:24px"><a class="btn-outline" href="/#contact" style="font-size:11px;padding:11px 22px">Discuss This Service →</a></div>';
}
setService(0);

function prefillChallenge(challenge, chip) {
  var message = document.getElementById('f-message');
  if (message && !message.value) {
    message.value = 'I would like help with: ' + challenge + '.';
  } else if (message && message.value.indexOf(challenge) === -1) {
    message.value += '\nChallenge selected: ' + challenge + '.';
  }
  document.querySelectorAll('.challenge-chip.active').forEach(function(c){ c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
  if (chip) { chip.classList.add('active'); chip.setAttribute('aria-pressed', 'true'); }
}

function chooseChallenge(challenge, serviceIndex, anchor) {
  if (typeof serviceIndex === 'number') setService(serviceIndex);
  var target = anchor || '#services';
  window.location.hash = target;
  prefillChallenge(challenge, null);
}

/* ─────────────────────────────────────────
   INTERACTIVE DIAGNOSTIC
───────────────────────────────────────── */
var diagnosticMap = {
  process: { label:'Process documentation', service:3, advice:'Prioritise SOPs, approval matrices, and team training so recurring work stops depending on memory.' },
  cost: { label:'Cost visibility', service:1, advice:'Run a cost baseline, vendor rationalisation, and budget-owner review to uncover margin leakage.' },
  supply: { label:'Supply-chain resilience', service:2, advice:'Map supplier risk, inventory buffers, logistics bottlenecks, and delivery performance before volume scales.' },
  tech: { label:'Technology fit', service:null, advice:'Define ERP requirements, master-data ownership, and dashboard needs before choosing software.' }
};

function updateDiagnostic() {
  var keys = ['process','cost','supply','tech'];
  var values = keys.map(function(key) {
    var input = document.getElementById('diag-' + key);
    var value = input ? parseInt(input.value, 10) : 0;
    var valueEl = document.getElementById('diag-' + key + '-val');
    if (valueEl) valueEl.textContent = value;
    return { key:key, value:value };
  });
  var total = values.reduce(function(sum, item){ return sum + item.value; }, 0);
  var score = Math.round((total / (keys.length * 10)) * 100);
  var scoreEl = document.getElementById('diag-score');
  var ring = document.getElementById('scoreRing');
  if (scoreEl) scoreEl.textContent = score;
  if (ring) ring.style.setProperty('--score', score + '%');

  var stage = 'Build the foundation';
  var title = 'Your systems need structure before scale.';
  var copy = 'The business has enough traction to grow, but inconsistent processes and manual decision-making may create avoidable cost, delays, and founder dependency.';
  if (score >= 75) {
    stage = 'Scale with confidence';
    title = 'You are ready for sharper optimisation.';
    copy = 'Your operating base is strong. The next opportunity is targeted improvement: margin expansion, supply-chain resilience, and technology-enabled governance.';
  } else if (score >= 55) {
    stage = 'Strengthen the engine';
    title = 'You have momentum, but a few weak links can slow growth.';
    copy = 'The foundation exists, yet uneven maturity across teams, vendors, data, or workflows can create hidden cost as volumes increase.';
  }

  var stageEl = document.getElementById('diag-stage');
  var titleEl = document.getElementById('diag-title');
  var copyEl = document.getElementById('diag-copy');
  if (stageEl) stageEl.textContent = stage;
  if (titleEl) titleEl.textContent = title;
  if (copyEl) copyEl.textContent = copy;

  values.sort(function(a,b){ return a.value - b.value; });
  var priorities = values.slice(0, 3).map(function(item) {
    return '<li><span><strong>' + diagnosticMap[item.key].label + ':</strong> ' + diagnosticMap[item.key].advice + '</span></li>';
  }).join('');
  var list = document.getElementById('diag-priorities');
  if (list) list.innerHTML = priorities;
}
updateDiagnostic();

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
function toggleFaq(el) {
  var item = el.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){
    i.classList.remove('open');
    i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    el.setAttribute('aria-expanded', 'true');
  }
}

/* ─────────────────────────────────────────
   SLIDE VIEWER
───────────────────────────────────────── */
var currentSlide = 0;
var totalSlides  = 3;

function goSlide(n) {
  currentSlide = n;
  var track = document.getElementById('slideTrack');
  if (track) track.style.transform = 'translateX(-' + (n * 100) + '%)';
  document.querySelectorAll('.slide-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === n);
  });
  var ctr = document.getElementById('slideCounter');
  if (ctr) ctr.textContent = (n + 1) + ' / ' + totalSlides;
}

function nextSlide() { goSlide((currentSlide + 1) % totalSlides); }
function prevSlide()  { goSlide((currentSlide + totalSlides - 1) % totalSlides); }

/* ─────────────────────────────────────────
   MODALS
───────────────────────────────────────── */
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && document.querySelector('#mobileMenu.open')) {
    closeMobileMenu();
    document.querySelector('.mobile-menu-btn').focus();
  }
});
window.addEventListener('DOMContentLoaded', function() {
  var track = document.getElementById('slideTrack');
  if (track) {
    track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  }
});

/* ─────────────────────────────────────────
   BLOG FILTER
───────────────────────────────────────── */
function filterBlog(cat, el) {
  document.querySelectorAll('.blog-cat').forEach(function(c){
    c.classList.toggle('active', c === el);
    c.setAttribute('aria-pressed', String(c === el));
  });
  el.classList.add('active');
  document.querySelectorAll('.blog-card').forEach(function(card) {
    if (cat === 'all' || card.getAttribute('data-cat') === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ─────────────────────────────────────────
   BLOG POST MODAL
───────────────────────────────────────── */
