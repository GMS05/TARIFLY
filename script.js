/* ============================================================
   TARIFLY — SPA-роутер + рендер всех разделов
   Данные читаются из localStorage (синхронизируются с админкой)
   ============================================================ */

const PAGES = ['home', 'tarify', 'newnumbers', 'nomera', 'zayavki', 'info'];

/* ---------------- ДЕФОЛТНЫЕ ДАННЫЕ ---------------- */
const DEFAULTS = {
  tariffs: [
    { op: 'mts', name: 'Больше для своих', gb: '∞', min: '500', sms: '200', price: 500 },
    { op: 'mts', name: 'Дилер 2.0', gb: '∞', min: '500', sms: '100', price: 299 },
    { op: 'mts', name: 'MTS Smart', gb: '∞', min: '900', sms: '500', price: 180 },
    { op: 'mfn', name: 'Минимум', gb: '15', min: '600', sms: '300', price: 400 },
    { op: 'mfn', name: 'Премиум', gb: '50', min: '∞', sms: '500', price: 900 },
    { op: 'bee', name: 'Решение', gb: '30', min: '∞', sms: '300', price: 450 },
    { op: 'bee', name: 'Просто', gb: '15', min: '400', sms: '200', price: 250 },
    { op: 'yota', name: 'Для модемов', gb: '∞', min: '0', sms: '0', price: 350 },
    { op: 'yota', name: 'Смартфон', gb: '∞', min: '500', sms: '0', price: 400 }
  ],
  newnumbers: [
    { op: 'mts', num: '+7 999 123-45-67', tariff: 'MTS Smart', gb: '∞', min: '900', sms: '500', price: 180, hit: true },
    { op: 'mfn', num: '+7 926 555-11-22', tariff: 'Минимум', gb: '15', min: '600', sms: '300', price: 400 },
    { op: 'bee', num: '+7 963 777-88-99', tariff: 'Решение', gb: '30', min: '∞', sms: '300', price: 450 },
    { op: 'yota', num: '+7 977 111-22-33', tariff: 'Смартфон', gb: '∞', min: '500', sms: '0', price: 400 },
    { op: 'mts', num: '+7 918 005-05-05', tariff: 'Больше для своих', gb: '∞', min: '500', sms: '200', price: 500, hit: true },
    { op: 'tele2', num: '+7 977 999-33-33', tariff: 'Для модемов', gb: '∞', min: '0', sms: '0', price: 350 }
  ],
  numbers: [
    { op: 'mts', num: '+7 918 368-05-05', desc: 'Лёгкий запоминающийся номер', hit: true },
    { op: 'mfn', num: '+7 925 444-77-77', desc: 'Удобный и запоминающийся' },
    { op: 'bee', num: '+7 963 555-22-22', desc: 'Стильный номер для бизнеса' },
    { op: 'mts', num: '+7 989 827-01-01', desc: 'Престижный номер' },
    { op: 'tele2', num: '+7 977 999-33-33', desc: 'Лёгкий и запоминающийся' },
    { op: 'mfn', num: '+7 926 111-00-11', desc: 'Идеальный для вашего бизнеса' }
  ],
  zayavki: [
    { type: 'tariff', op: 'mts', title: 'Умный бизнес 2025', sub: 'Для юридических лиц', meta: ['Безлимитные звонки', '50 ГБ', '500 SMS'], status: 'done', statusText: 'Выполнена', date: '10.09.2025 14:32' },
    { type: 'number', op: 'mfn', title: '+7 925 444-77-77', sub: 'Золотой номер', meta: ['Красивый номер', 'МегаФон'], status: 'process', statusText: 'В обработке', date: '09.09.2025 18:17' },
    { type: 'tariff', op: 'bee', title: 'Решение', sub: 'Для бизнеса', meta: ['Безлимит на Билайн', '30 ГБ', '300 SMS'], status: 'wait', statusText: 'Ожидает ответа', date: '08.09.2025 12:45' },
    { type: 'number', op: 'yota', title: 'Новый номер для модемов - 172', sub: 'Специальный номер для модемов', meta: ['4G/5G', 'Безлимитный интернет'], status: 'done', statusText: 'Выполнена', date: '06.09.2025 16:20' },
    { type: 'tariff', op: 'mfn', title: 'Минимум', sub: 'Базовый тариф', meta: ['600 минут', '5 ГБ', '300 SMS'], status: 'wait', statusText: 'Ожидает ответа', date: '05.09.2025 11:03' },
    { type: 'number', op: 'mts', title: '+7 918 523-05-05', sub: 'Красивый номер', meta: ['Золотой номер', 'МТС'], status: 'done', statusText: 'Выполнена', date: '03.09.2025 09:48' },
    { type: 'number', op: 'bee', title: '+7 989 813-05-05', sub: 'Красивый номер', meta: ['Премиум номер', 'Билайн'], status: 'done', statusText: 'Выполнена', date: '01.09.2025 21:12' }
  ],
  operators: [
    { op: 'mfn', name: 'Мегафон', img: 'icons/megafon.png' },
    { op: 'bee', name: 'Билайн', img: 'icons/beeline.png' },
    { op: 'mts', name: 'МТС', img: 'icons/mts.png' },
    { op: 'yota', name: 'ЙОТА', img: 'icons/yota.png' }
  ],
  news: [
    { op: 'mts', date: '10 сентября 2025', title: 'МТС запустил новые красивые номера 05-05', text: 'Теперь доступны новые номера с окончанием 05-05.' },
    { op: 'mfn', date: '8 сентября 2025', title: 'Мегафон обновил тариф «Минимум»', text: 'Ещё больше интернета и выгодные условия.' },
    { op: 'bee', date: '5 сентября 2025', title: 'Билайн предлагает новые номера для бизнеса', text: 'Специальные условия для корпоративных клиентов.' },
    { op: 'yota', date: '2 сентября 2025', title: 'Yota расширяет покрытие 4G/5G', text: 'Ещё больше регионов с высокоскоростным интернетом.' }
  ],
  promo: {
    title: 'Красивые номера уже ждут вас',
    desc: 'Легкие, запоминающиеся, для работы и жизни.',
    num1: '+7 920 001-01-01',
    num2: '+7 932 707-07-07'
  }
};

/* ---------------- УТИЛИТЫ ---------------- */
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ESCAPE_MAP[ch]);
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('Ошибка чтения', key, e);
    return fallback;
  }
}

let tariffs    = readStorage('tarifly_tariffs',    DEFAULTS.tariffs);
let newNumbers = readStorage('tarifly_newnumbers', DEFAULTS.newnumbers);
let numbers    = readStorage('tarifly_numbers',    DEFAULTS.numbers);
let zayavki    = readStorage('tarifly_zayavki',    DEFAULTS.zayavki);
let operators  = readStorage('tarifly_operators',  DEFAULTS.operators);
let newsList   = readStorage('tarifly_news',       DEFAULTS.news);
let promo      = readStorage('tarifly_promo',      DEFAULTS.promo);
let support    = readStorage('tarifly_support', {
  whatsapp: '70000000000',
  telegram: 'https://t.me/tarifly_support'
});

const opLabels   = { mts: 'МТС', mfn: 'МЕГАФОН', bee: 'БИЛАЙН', yota: 'YOTA', tele2: 'ТЕЛЕ2' };
const opInitials = { mts: 'МТС', mfn: 'МФ', bee: 'Б', yota: 'Y', tele2: 'Т2' };
function initialsFor(op) {
  return opInitials[op] || esc(String(op || '?').slice(0, 2).toUpperCase());
}

const OP_LOGO_FALLBACK = {
  mts: 'icons/mts.png',
  mfn: 'icons/megafon.png',
  bee: 'icons/beeline.png',
  yota: 'icons/yota.png',
  tele2: 'icons/tele2.png'
};

function operatorLogoSrc(op) {
  const list = operators || [];
  const found = list.find(o => {
    if (o.op) return o.op === op;
    const n = String(o.name || '').toLowerCase();
    if (op === 'mts' && (n.includes('мтс') || n.includes('mts'))) return true;
    if (op === 'mfn' && (n.includes('мега') || n.includes('mega'))) return true;
    if (op === 'bee' && (n.includes('билайн') || n.includes('bee'))) return true;
    if (op === 'yota' && (n.includes('йота') || n.includes('yota') || n.includes('ёта'))) return true;
    if (op === 'tele2' && (n.includes('теле2') || n.includes('tele2'))) return true;
    return false;
  });
  if (found && found.img) return found.img;
  return OP_LOGO_FALLBACK[op] || '';
}

function opLogoHTML(op) {
  const src = operatorLogoSrc(op);
  const label = opLabels[op] || op;
  if (src) {
    return `<div class="op-logo-img" title="${esc(label)}"><img src="${esc(src)}" alt="${esc(label)}" loading="lazy"></div>`;
  }
  return `<div class="op-logo ${esc(op)}">${initialsFor(op)}</div>`;
}


/* ---------------- WHATSAPP-ЗАЯВКИ ---------------- */
function waDigits() {
  const d = String(support?.whatsapp || '').replace(/\D/g, '');
  return d || '70000000000';
}
function normalizeTgLink(v) {
  const t = String(v || '').trim();
  if (!t) return 'https://t.me/tarifly_support';
  if (t.startsWith('http')) return t;
  if (t.startsWith('@')) return 'https://t.me/' + t.slice(1);
  if (t.startsWith('t.me/')) return 'https://' + t;
  return 'https://t.me/' + t.replace(/^\/+/, '');
}
function renderSupportLinks() {
  const tg = document.getElementById('supportTg');
  const wa = document.getElementById('supportWa');
  if (tg) tg.href = normalizeTgLink(support.telegram);
  if (wa) wa.href = 'https://wa.me/' + waDigits();
}
function openWhatsAppOrder(message) {
  const url = 'https://wa.me/' + waDigits() + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}
function msgTariff(t, plan) {
  const op = opLabels[t.op] || t.op;
  const p = plan || (getTariffPlans(t)[0] || {});
  const planPart = p.label ? `, план ${p.label}` : '';
  const specs = [p.gb && `${p.gb} ГБ`, p.min && `${p.min} мин`, p.sms && `${p.sms} SMS`, (p.price !== undefined && p.price !== '') && `${p.price} ₽/мес`]
    .filter(Boolean).join(', ');
  return `Здравствуйте! Хочу подключить тариф «${t.name}» (${op})${planPart}.\n${specs ? 'Условия: ' + specs + '.' : ''}\nОформление через TARIFLY.`;
}
function msgBundle(n) {
  const op = opLabels[n.op] || n.op;
  return `Здравствуйте! Хочу подключить номер ${n.num} (${op}) с тарифом «${n.tariff}».\nУсловия: ${n.gb} ГБ, ${n.min} мин, ${n.sms} SMS, ${n.price} ₽/мес.\nОформление через TARIFLY.`;
}
function msgNumber(n) {
  const op = opLabels[n.op] || n.op;
  const desc = n.desc ? ` (${n.desc})` : '';
  return `Здравствуйте! Интересует красивый номер ${n.num} — ${op}${desc}.\nОформление через TARIFLY.`;
}
function msgPickNumber() {
  return 'Здравствуйте! Не нашёл нужный красивый номер на сайте. Помогите с подбором, пожалуйста.\nОбращение через TARIFLY.';
}

const WA_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6 0-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.2.8.9-3.1-.2-.3C4.3 15 3.8 13.5 3.8 12 3.8 7.5 7.5 3.8 12 3.8S20.2 7.5 20.2 12 16.5 20.2 12 20.2z"/></svg>`;

function waOrderBtnHTML(attrs = 'data-wa-order') {
  return `<button type="button" class="wa-order-btn" ${attrs}>${WA_ICON}<span>Оформить в WhatsApp</span></button>`;
}

/* ---------------- SPA-РОУТЕР ---------------- */
function setActivePage(pageId) {
  if (!PAGES.includes(pageId)) pageId = 'home';

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'page-enter'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    void target.offsetWidth;
    target.classList.add('page-enter');
  }

  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });

  updateNavIndicator();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage(pageId) {
  if (!PAGES.includes(pageId)) pageId = 'home';
  if (location.hash !== '#' + pageId) history.pushState(null, '', '#' + pageId);
  setActivePage(pageId);
}

/* ---------------- ИНДИКАТОР НИЖНЕГО МЕНЮ ---------------- */
function updateNavIndicator(instant = false) {
  const nav = document.getElementById('bottomNav');
  const indicator = document.getElementById('navIndicator');
  const active = nav && nav.querySelector('.nav-item.active');
  if (!nav || !indicator || !active) return;

  const navRect = nav.getBoundingClientRect();
  const itemRect = active.getBoundingClientRect();
  const left = itemRect.left - navRect.left;
  const top = itemRect.top - navRect.top;

  if (instant) indicator.classList.add('no-anim');
  indicator.style.width = itemRect.width + 'px';
  indicator.style.height = itemRect.height + 'px';
  indicator.style.transform = `translate(${left}px, ${top}px)`;
  if (instant) {
    void indicator.offsetWidth;
    indicator.classList.remove('no-anim');
  }
}

let navResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(navResizeTimer);
  navResizeTimer = setTimeout(() => updateNavIndicator(true), 120);
}, { passive: true });

/* ---------------- ВИДЖЕТ ПОДДЕРЖКИ ---------------- */
function openSupportWidget() {
  const overlay = document.getElementById('supportOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}
function closeSupportWidget() {
  const overlay = document.getElementById('supportOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

/* ---------------- РЕНДЕР: ТАРИФЫ ---------------- */
function renderTariffs(filter = 'all') {
  const grid = document.getElementById('tariffGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? tariffs : tariffs.filter(t => t.op === filter);
  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state">Тарифов для этого оператора пока нет</div>';
    return;
  }

  grid.innerHTML = filtered.map((t, cardIdx) => {
    const plans = getTariffPlans(t);
    const active = plans[0];
    const multi = plans.length > 1;
    const imgBlock = t.img
      ? `<div class="tariff-img-wrap"><img class="tariff-img" src="${esc(t.img)}" alt="${esc(t.name)}" loading="lazy"></div>`
      : '';
    const planSwitch = multi ? `
      <div class="plan-switch" role="tablist">
        ${plans.map((p, i) => `
          <button type="button" class="plan-chip${i === 0 ? ' active' : ''}" data-plan="${i}" role="tab">${esc(p.label || ('P' + (i + 1)))}</button>
        `).join('')}
      </div>` : '';
    const features = Array.isArray(active.features) ? active.features : [];
    const detailDesc = active.desc || t.desc || '';
    const hasDetails = !!(detailDesc || features.length);

    return `
    <article class="tariff-card" data-card="${cardIdx}" data-name="${esc(t.name)}">
      <div class="tariff-banner tariff-op-${esc(t.op)}${t.img ? ' has-img' : ''}">
        ${imgBlock}
        <span class="op-tag">${esc(opLabels[t.op] || t.op)}</span>
        <h3>${esc(t.name)}</h3>
      </div>
      <div class="tariff-body">
        ${planSwitch}
        <div class="tariff-specs" data-specs>
          <span class="spec-pill">${esc(active.gb)} ГБ</span>
          <span class="spec-pill">${esc(active.min)} мин</span>
          <span class="spec-pill">${esc(active.sms)} SMS</span>
        </div>
        <div class="tariff-price" data-price>${esc(active.price)} ₽<span>/мес</span></div>
        <div class="tariff-details" data-details>
          ${detailDesc ? `<p class="tariff-desc">${esc(detailDesc)}</p>` : ''}
          ${features.length ? `<ul class="tariff-features">${features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        </div>
        <div class="tariff-actions">
          ${hasDetails ? `<button type="button" class="tariff-cta" data-tariff-toggle>Подробнее</button>` : ''}
          ${waOrderBtnHTML('data-tariff-wa')}
        </div>
      </div>
    </article>`;
  }).join('');

  grid.querySelectorAll('.plan-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const card = chip.closest('.tariff-card');
      if (!card) return;
      const cardIdx = parseInt(card.dataset.card, 10);
      const t = filtered[cardIdx];
      if (!t) return;
      const plans = getTariffPlans(t);
      const plan = plans[parseInt(chip.dataset.plan, 10)];
      if (!plan) return;
      card.querySelectorAll('.plan-chip').forEach(c => c.classList.toggle('active', c === chip));
      const specs = card.querySelector('[data-specs]');
      if (specs) {
        specs.innerHTML = `
          <span class="spec-pill">${esc(plan.gb)} ГБ</span>
          <span class="spec-pill">${esc(plan.min)} мин</span>
          <span class="spec-pill">${esc(plan.sms)} SMS</span>`;
      }
      const priceEl = card.querySelector('[data-price]');
      if (priceEl) priceEl.innerHTML = `${esc(plan.price)} ₽<span>/мес</span>`;
      const features = Array.isArray(plan.features) ? plan.features : [];
      const detailDesc = plan.desc || t.desc || '';
      const details = card.querySelector('[data-details]');
      if (details) {
        details.innerHTML = `
          ${detailDesc ? `<p class="tariff-desc">${esc(detailDesc)}</p>` : ''}
          ${features.length ? `<ul class="tariff-features">${features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}`;
      }
    });
  });

  grid.querySelectorAll('[data-tariff-toggle]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.tariff-card');
      if (!card) return;
      const open = card.classList.toggle('is-open');
      btn.textContent = open ? 'Свернуть' : 'Подробнее';
    });
  });

  grid.querySelectorAll('[data-tariff-wa]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.tariff-card');
      if (!card) return;
      const idx = parseInt(card.dataset.card, 10);
      const t = filtered[idx];
      if (!t) return;
      const plans = getTariffPlans(t);
      const activeChip = card.querySelector('.plan-chip.active');
      const planIdx = activeChip ? parseInt(activeChip.dataset.plan, 10) : 0;
      openWhatsAppOrder(msgTariff(t, plans[planIdx] || plans[0]));
    });
  });
}

/* ---------------- РЕНДЕР: НОВЫЕ НОМЕРА С ТАРИФАМИ ---------------- */
function renderNewNumbers(filter = 'all') {
  const list = document.getElementById('newNumbersList');
  if (!list) return;
  const filtered = filter === 'all' ? newNumbers : newNumbers.filter(n => n.op === filter);
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">Предложений для этого оператора пока нет</div>';
    return;
  }
  list.innerHTML = filtered.map(n => `
    <article class="bundle-card">
      ${n.hit ? '<span class="hit-badge">ХИТ</span>' : ''}
      <div class="bundle-top">
        ${opLogoHTML(n.op)}
        <div class="bundle-info">
          <div class="bundle-num">${esc(n.num)}</div>
          <div class="bundle-tariff">Тариф: ${esc(n.tariff)}</div>
        </div>
        <div class="bundle-price">${esc(n.price)} ₽<span>/мес</span></div>
      </div>
      <div class="bundle-specs">
        <span class="spec-pill">${esc(n.gb)} ГБ</span>
        <span class="spec-pill">${esc(n.min)} мин</span>
        <span class="spec-pill">${esc(n.sms)} SMS</span>
      </div>
      ${waOrderBtnHTML("data-bundle-wa")}
    </article>
  `).join('');

  list.querySelectorAll('[data-bundle-wa]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.bundle-card');
      const cards = [...list.querySelectorAll('.bundle-card')];
      const n = filtered[cards.indexOf(card)];
      if (n) openWhatsAppOrder(msgBundle(n));
    });
  });
}

/* ---------------- РЕНДЕР: НОМЕРА ---------------- */
function renderNumbers(filter = 'all') {
  const list = document.getElementById('numbersList');
  if (!list) return;
  const filtered = filter === 'all' ? numbers : numbers.filter(n => n.op === filter);
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">Номеров для этого оператора пока нет</div>';
    return;
  }
  list.innerHTML = filtered.map(n => `
    <article class="number-card">
      ${n.hit ? '<span class="hit-badge">ХИТ</span>' : ''}
      <div class="number-card-main">
        ${opLogoHTML(n.op)}
        <div class="number-info">
          <div class="num">${esc(n.num)}</div>
          <div class="desc">${esc(n.desc)}</div>
        </div>
        <div class="number-tag">
          <span class="crown">👑 Красивый номер</span>
        </div>
      </div>
      ${waOrderBtnHTML('data-number-wa')}
    </article>
  `).join('');

  list.querySelectorAll('[data-number-wa]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.number-card');
      const cards = [...list.querySelectorAll('.number-card')];
      const n = filtered[cards.indexOf(card)];
      if (n) openWhatsAppOrder(msgNumber(n));
    });
  });
}

/* ---------------- РЕНДЕР: ЗАЯВКИ ---------------- */
function renderZayavki(filter = 'all') {
  const list = document.getElementById('zayavkiList');
  if (!list) return;
  let filtered = zayavki;
  if (filter === 'tariff') filtered = zayavki.filter(z => z.type === 'tariff');
  else if (filter === 'number') filtered = zayavki.filter(z => z.type === 'number');
  else if (filter === 'process') filtered = zayavki.filter(z => z.status === 'process' || z.status === 'wait');
  else if (filter === 'done') filtered = zayavki.filter(z => z.status === 'done');

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">Заявок пока нет</div>';
    return;
  }

  list.innerHTML = filtered.map(z => `
    <article class="zayavka-card">
      ${opLogoHTML(z.op)}
      <div class="zayavka-body">
        <div class="type">${z.type === 'tariff' ? 'ТАРИФ' : 'НОМЕР'}</div>
        <h3>${esc(z.title)}</h3>
        <div class="sub">${esc(z.sub)}</div>
        <div class="meta">${(z.meta || []).map(m => `<span>${esc(m)}</span>`).join('')}</div>
      </div>
      <div class="zayavka-right">
        <span class="status ${esc(z.status)}">${z.status === 'done' ? '✓ ' : z.status === 'process' ? '⏱ ' : '⏳ '}${esc(z.statusText)}</span>
        <div class="date">${esc(z.date)}</div>
      </div>
    </article>
  `).join('');
}

/* ---------------- ОПЕРАТОР → КОД ---------------- */
function opCodeFromOperator(o) {
  if (o && o.op) return o.op;
  const n = String(o?.name || '').toLowerCase();
  if (n.includes('мтс') || n.includes('mts')) return 'mts';
  if (n.includes('мега') || n.includes('mega') || n.includes('mfn')) return 'mfn';
  if (n.includes('билайн') || n.includes('beeline') || n.includes('bee')) return 'bee';
  if (n.includes('йота') || n.includes('yota') || n.includes('ёта')) return 'yota';
  if (n.includes('теле2') || n.includes('tele2') || n.includes('t2')) return 'tele2';
  return '';
}

function getTariffPlans(t) {
  if (Array.isArray(t.plans) && t.plans.length) return t.plans;
  return [{
    label: 'M',
    gb: t.gb ?? '',
    min: t.min ?? '',
    sms: t.sms ?? '',
    price: t.price ?? 0,
    features: Array.isArray(t.features) ? t.features : [],
    desc: ''
  }];
}

function tariffFromPrice(t) {
  const plans = getTariffPlans(t);
  const prices = plans.map(p => Number(p.price) || 0).filter(n => n > 0);
  if (!prices.length) return t.price ?? 0;
  return Math.min(...prices);
}

/* ---------------- ПАНЕЛЬ ОПЕРАТОРА ---------------- */
let opSheetState = { op: '', name: '', img: '', tab: 'tariffs' };

function openOpSheet(operator) {
  const op = opCodeFromOperator(operator);
  if (!op) return;
  opSheetState = { op, name: operator.name || opLabels[op] || op, img: operator.img || '', tab: 'tariffs' };

  const overlay = document.getElementById('opSheetOverlay');
  const head = document.getElementById('opSheetHead');
  if (!overlay || !head) return;

  const initials = initialsFor(op);
  const avatarInner = opSheetState.img
    ? `<img src="${esc(opSheetState.img)}" alt="">`
    : esc(initials);

  head.innerHTML = `
    <div class="op-sheet-avatar ${esc(op)}">${avatarInner}</div>
    <div>
      <h3>${esc(opSheetState.name)}</h3>
      <p>Выберите тариф оператора</p>
    </div>`;

  document.querySelectorAll('#opSheetTabs .op-sheet-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === 'tariffs');
  });

  renderOpSheetList();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeOpSheet() {
  const overlay = document.getElementById('opSheetOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function renderOpSheetList() {
  const list = document.getElementById('opSheetList');
  if (!list) return;
  const { op, tab } = opSheetState;

  if (tab === 'tariffs') {
    const items = tariffs.filter(t => t.op === op);
    if (!items.length) {
      list.innerHTML = '<div class="op-sheet-empty">Тарифов этого оператора пока нет</div>';
      return;
    }
    list.innerHTML = items.map((t, i) => {
      const plans = getTariffPlans(t);
      const price = tariffFromPrice(t);
      const p0 = plans[0];
      const meta = `${esc(p0.gb)} ГБ · ${esc(p0.min)} мин · ${esc(p0.sms)} SMS`;
      const priceLabel = plans.length > 1 ? `от ${esc(price)}` : esc(price);
      return `
        <button type="button" class="op-sheet-item" data-goto="tarify" data-op="${esc(op)}" data-name="${esc(t.name)}">
          <div class="op-sheet-item-main">
            <div class="op-sheet-item-title">${esc(t.name)}</div>
            <div class="op-sheet-item-meta">${meta}${plans.length > 1 ? ' · ' + plans.map(p => esc(p.label)).join('/') : ''}</div>
          </div>
          <div class="op-sheet-item-price">${priceLabel} ₽<span>/мес</span></div>
        </button>`;
    }).join('');
  } else if (tab === 'newnumbers') {
    const items = newNumbers.filter(n => n.op === op);
    if (!items.length) {
      list.innerHTML = '<div class="op-sheet-empty">Новых номеров с тарифами нет</div>';
      return;
    }
    list.innerHTML = items.map(n => `
      <button type="button" class="op-sheet-item" data-goto="newnumbers" data-op="${esc(op)}" data-num="${esc(n.num)}">
        <div class="op-sheet-item-main">
          <div class="op-sheet-item-title">${esc(n.num)}</div>
          <div class="op-sheet-item-meta">Тариф: ${esc(n.tariff)} · ${esc(n.gb)} ГБ · ${esc(n.min)} мин</div>
        </div>
        <div class="op-sheet-item-price">${esc(n.price)} ₽<span>/мес</span></div>
      </button>`).join('');
  } else {
    const items = numbers.filter(n => n.op === op);
    if (!items.length) {
      list.innerHTML = '<div class="op-sheet-empty">Красивых номеров нет</div>';
      return;
    }
    list.innerHTML = items.map(n => `
      <button type="button" class="op-sheet-item" data-goto="nomera" data-op="${esc(op)}" data-num="${esc(n.num)}">
        <div class="op-sheet-item-main">
          <div class="op-sheet-item-title">${esc(n.num)}</div>
          <div class="op-sheet-item-meta">${esc(n.desc || 'Красивый номер')}</div>
        </div>
        <div class="op-sheet-item-price">${n.hit ? '⭐ ХИТ' : '→'}</div>
      </button>`).join('');
  }

  list.querySelectorAll('.op-sheet-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.goto;
      const opCode = btn.dataset.op;
      closeOpSheet();
      goToPage(page);
      // применить фильтр оператора на целевой странице
      requestAnimationFrame(() => {
        if (page === 'tarify') {
          const row = document.getElementById('filterRow');
          if (row) {
            row.querySelectorAll('.filter-chip').forEach(c => {
              c.classList.toggle('active', c.dataset.op === opCode);
            });
            renderTariffs(opCode);
          }
          // подсветка карточки по имени
          const name = btn.dataset.name;
          if (name) {
            setTimeout(() => {
              document.querySelectorAll('#tariffGrid .tariff-card').forEach(card => {
                if (card.dataset.name === name) {
                  card.classList.add('is-open');
                  const tbtn = card.querySelector('[data-tariff-toggle]');
                  if (tbtn) tbtn.textContent = 'Свернуть';
                  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              });
            }, 320);
          }
        } else if (page === 'newnumbers') {
          const row = document.getElementById('newNumbersFilter');
          if (row) {
            row.querySelectorAll('.filter-chip').forEach(c => {
              c.classList.toggle('active', c.dataset.op === opCode);
            });
            renderNewNumbers(opCode);
          }
        } else if (page === 'nomera') {
          const row = document.getElementById('numFilter');
          if (row) {
            row.querySelectorAll('.filter-chip').forEach(c => {
              c.classList.toggle('active', c.dataset.op === opCode);
            });
            renderNumbers(opCode);
          }
        }
      });
    });
  });
}

/* ---------------- РЕНДЕР: ОПЕРАТОРЫ ---------------- */
function renderOperators() {
  const grid = document.getElementById('operatorsGrid');
  if (!grid) return;
  grid.innerHTML = operators.map((o, i) => `
    <div class="operator-card" data-op-idx="${i}" role="button" tabindex="0">
      <div class="op-logo-wrap"><img src="${esc(o.img)}" alt="${esc(o.name)}" class="op-logo" loading="lazy"></div>
      <div class="operator-name">${esc(o.name)}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.operator-card').forEach(card => {
    card.addEventListener('click', () => {
      const i = parseInt(card.dataset.opIdx, 10);
      if (!Number.isNaN(i) && operators[i]) openOpSheet(operators[i]);
    });
  });
}

/* ---------------- РЕНДЕР: НОВОСТИ ---------------- */
function renderNews() {
  const list = document.getElementById('newsList');
  if (!list) return;
  list.innerHTML = newsList.map(n => `
    <article class="news-card">
      ${opLogoHTML(n.op)}
      <div class="news-body">
        <div class="date">${esc(n.date)}</div>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.text)}</p>
      </div>
    </article>
  `).join('');
}

/* ---------------- РЕНДЕР: ПРОМО ---------------- */
function renderPromo() {
  const titleEl = document.getElementById('promoTitle');
  const descEl  = document.getElementById('promoDesc');
  const num1El  = document.getElementById('promoNum1');
  const num2El  = document.getElementById('promoNum2');
  if (titleEl) titleEl.textContent = promo.title;
  if (descEl)  descEl.textContent  = promo.desc;
  const num1Text = num1El && num1El.querySelector('.promo-chip-text');
  const num2Text = num2El && num2El.querySelector('.promo-chip-text');
  if (num1Text) num1Text.textContent = promo.num1;
  if (num2Text) num2Text.textContent = promo.num2;
}

function renderAll() {
  renderTariffs();
  renderNewNumbers();
  renderNumbers();
  renderZayavki();
  renderOperators();
  renderNews();
  renderPromo();
  renderSupportLinks();
}

/* ---------------- ФИЛЬТРЫ ВКЛАДКИ ИНФО ---------------- */
function applyInfoFilter(tab) {
  const page = document.getElementById('page-info');
  if (!page) return;
  const featured = page.querySelector('.info-featured');
  const newsLabel = page.querySelectorAll('.section-label')[0];
  const newsList = document.getElementById('newsList');
  const usefulLabel = page.querySelectorAll('.section-label')[1];
  const usefulList = page.querySelector('.useful-list');

  const show = (el, on) => { if (el) el.style.display = on ? '' : 'none'; };

  if (tab === 'all') {
    show(featured, true); show(newsLabel, true); show(newsList, true);
    show(usefulLabel, true); show(usefulList, true);
  } else if (tab === 'news') {
    show(featured, false); show(newsLabel, true); show(newsList, true);
    show(usefulLabel, false); show(usefulList, false);
  } else if (tab === 'useful') {
    show(featured, false); show(newsLabel, false); show(newsList, false);
    show(usefulLabel, true); show(usefulList, true);
  } else if (tab === 'promo') {
    show(featured, true); show(newsLabel, false); show(newsList, false);
    show(usefulLabel, false); show(usefulList, false);
  }
}


/* ---------------- ИНИЦИАЛИЗАЦИЯ ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  const initialPage = (location.hash.replace('#', '') || 'home');
  setActivePage(initialPage);
  updateNavIndicator(true);

  window.addEventListener('hashchange', () => {
    const p = location.hash.replace('#', '') || 'home';
    setActivePage(p);
  });

  document.body.addEventListener('click', (e) => {
    const supportTrigger = e.target.closest('[data-support-trigger]');
    if (supportTrigger) {
      e.preventDefault();
      openSupportWidget();
      return;
    }
    const supportOverlay = document.getElementById('supportOverlay');
    if (e.target.closest('#supportClose') || e.target === supportOverlay) {
      closeSupportWidget();
      return;
    }

    const navItem = e.target.closest('.bottom-nav .nav-item');
    if (navItem && navItem.dataset.page) {
      e.preventDefault();
      goToPage(navItem.dataset.page);
      return;
    }
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const hash = link.getAttribute('href').replace('#', '');
      if (PAGES.includes(hash)) {
        e.preventDefault();
        goToPage(hash);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSupportWidget();
      closeOpSheet();
    }
  });

  /* Панель оператора */
  document.getElementById('opSheetClose')?.addEventListener('click', closeOpSheet);
  document.getElementById('opSheetOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'opSheetOverlay') closeOpSheet();
  });
  document.getElementById('opSheetTabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.op-sheet-tab');
    if (!tab) return;
    document.querySelectorAll('#opSheetTabs .op-sheet-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    opSheetState.tab = tab.dataset.tab;
    renderOpSheetList();
  });

  /* Фильтры тарифов */
  const filterRow = document.getElementById('filterRow');
  if (filterRow) {
    filterRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      filterRow.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      renderTariffs(btn.dataset.op);
    });
  }

  /* Фильтры новых номеров */
  const newNumbersFilter = document.getElementById('newNumbersFilter');
  if (newNumbersFilter) {
    newNumbersFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      newNumbersFilter.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      renderNewNumbers(btn.dataset.op);
    });
  }

  /* Фильтры номеров */
  const numFilter = document.getElementById('numFilter');
  if (numFilter) {
    numFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      numFilter.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      renderNumbers(btn.dataset.op);
    });
  }

  /* Вкладки заявок */
  const zayavkiTabs = document.getElementById('zayavkiTabs');
  if (zayavkiTabs) {
    zayavkiTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.zayavki-tab');
      if (!btn) return;
      zayavkiTabs.querySelectorAll('.zayavki-tab').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      renderZayavki(btn.dataset.filter);
    });
  }


  /* Инфо — вкладки фильтрации */
  const infoTabs = document.getElementById('infoTabs');
  if (infoTabs) {
    infoTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.info-tab');
      if (!btn) return;
      infoTabs.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      applyInfoFilter(btn.dataset.tab || 'all');
    });
  }

  /* Подбор номера → WhatsApp */
  document.querySelector('.numbers-cta')?.addEventListener('click', (e) => {
    e.preventDefault();
    openWhatsAppOrder(msgPickNumber());
  });

  renderAll();
});

/* ---------------- СИНХРОНИЗАЦИЯ С АДМИНКОЙ ---------------- */
window.addEventListener('storage', (e) => {
  if (!e.key || !e.key.startsWith('tarifly_')) return;
  if (e.key === 'tarifly_tariffs')    { tariffs    = readStorage('tarifly_tariffs',    DEFAULTS.tariffs);    renderTariffs(); }
  if (e.key === 'tarifly_newnumbers') { newNumbers = readStorage('tarifly_newnumbers', DEFAULTS.newnumbers); renderNewNumbers(); }
  if (e.key === 'tarifly_numbers')    { numbers    = readStorage('tarifly_numbers',    DEFAULTS.numbers);    renderNumbers(); }
  if (e.key === 'tarifly_zayavki')    { zayavki    = readStorage('tarifly_zayavki',    DEFAULTS.zayavki);    renderZayavki(); }
  if (e.key === 'tarifly_operators')  { operators  = readStorage('tarifly_operators',  DEFAULTS.operators);  renderOperators(); }
  if (e.key === 'tarifly_news')       { newsList   = readStorage('tarifly_news',       DEFAULTS.news);       renderNews(); }
  if (e.key === 'tarifly_promo')      { promo      = readStorage('tarifly_promo',      DEFAULTS.promo);      renderPromo(); }
  if (e.key === 'tarifly_support')    { support = readStorage('tarifly_support', { whatsapp: '70000000000', telegram: 'https://t.me/tarifly_support' }); renderSupportLinks(); }
});