/* ============================================================
   TARIFLY ADMIN — Логика админ-панели
   ============================================================ */

/* ---------------- 0. ЭКРАНИРОВАНИЕ ---------------- */
/* Любой текст, введённый в форме, может попасть в innerHTML (таблица, поля формы).
   Без экранирования спецсимволы (<, >, ", ') могут сломать вёрстку или выполниться как HTML. */
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ESCAPE_MAP[ch]);
}

/* ---------------- 1. СХЕМЫ ДАННЫХ ---------------- */
const SCHEMAS = {
  tariffs: {
    title: 'Тарифы',
    desc: 'Управление тарифами для сайта',
    storageKey: 'tarifly_tariffs',
    isArray: true,
    columns: [
      { key: 'op', label: 'Оператор', render: v => `<span class="tag tag-${esc(v)}">${esc(opName(v))}</span>` },
      { key: 'name', label: 'Название' },
      { key: 'plans', label: 'Планы', render: v => {
          if (Array.isArray(v) && v.length) return v.map(p => esc(p.label || p.code || '?')).join(' / ');
          return '—';
        }},
      { key: 'price', label: 'От', render: (v, row) => {
          const plans = Array.isArray(row.plans) ? row.plans : [];
          if (plans.length) {
            const minP = Math.min(...plans.map(p => Number(p.price) || 0));
            return `<b>от ${esc(minP)} ₽</b>`;
          }
          return v !== undefined && v !== '' ? `<b>${esc(v)} ₽</b>` : '—';
        }},
      { key: 'img', label: 'Фото', render: v => v ? `<img src="${esc(v)}" style="width:40px;height:40px;object-fit:contain;border-radius:8px;background:#f4f5f8;" loading="lazy">` : '—' }
    ],
    // fields used only as meta; modal is custom for tariffs
    fields: [
      { key: 'op', label: 'Оператор', type: 'select', options: [
        { value: 'mts', label: 'МТС' },
        { value: 'mfn', label: 'МегаФон' },
        { value: 'bee', label: 'Билайн' },
        { value: 'yota', label: 'Yota' }
      ]},
      { key: 'name', label: 'Название тарифа', type: 'text' },
      { key: 'img', label: 'Изображение', type: 'text' },
      { key: 'desc', label: 'Описание', type: 'textarea' }
    ],
    defaults: [
      {
        op: 'mts', name: 'Больше для своих', img: '', desc: 'Семейный тариф с безлимитным интернетом. Выберите объём минут под свои задачи.',
        plans: [
          { label: 'M', gb: '30', min: '500', sms: '100', price: 399, features: ['30 ГБ', '500 минут', '100 SMS'] },
          { label: 'L', gb: '50', min: '800', sms: '200', price: 549, features: ['50 ГБ', '800 минут', '200 SMS', 'Раздача'] },
          { label: 'XL', gb: '∞', min: '∞', sms: '500', price: 799, features: ['Безлимит ГБ', 'Безлимит минут', '500 SMS', 'Приоритет'] }
        ]
      },
      {
        op: 'mts', name: 'MTS Smart', img: '', desc: 'Смарт-тариф для ежедневного использования.',
        plans: [
          { label: 'M', gb: '15', min: '400', sms: '100', price: 180, features: ['15 ГБ', '400 минут'] },
          { label: 'L', gb: '∞', min: '900', sms: '500', price: 299, features: ['Безлимит ГБ', '900 минут', '500 SMS'] }
        ]
      },
      {
        op: 'mfn', name: 'Минимум', img: '', desc: 'Базовый тариф МегаФон.',
        plans: [
          { label: 'M', gb: '15', min: '400', sms: '200', price: 350, features: ['15 ГБ', '400 минут'] },
          { label: 'L', gb: '30', min: '600', sms: '300', price: 450, features: ['30 ГБ', '600 минут', '300 SMS'] },
          { label: 'XL', gb: '50', min: '∞', sms: '500', price: 650, features: ['50 ГБ', 'Безлимит минут', '500 SMS'] }
        ]
      },
      {
        op: 'bee', name: 'Решение', img: '', desc: 'Гибкие планы Билайн для работы и жизни.',
        plans: [
          { label: 'M', gb: '20', min: '500', sms: '100', price: 350, features: ['20 ГБ', '500 минут'] },
          { label: 'L', gb: '30', min: '∞', sms: '300', price: 450, features: ['30 ГБ', 'Безлимит на Билайн', '300 SMS'] },
          { label: 'XL', gb: '∞', min: '∞', sms: '500', price: 700, features: ['Безлимит ГБ', 'Безлимит минут', '500 SMS'] }
        ]
      },
      {
        op: 'yota', name: 'Смартфон', img: '', desc: 'Yota для смартфонов — выберите свой объём.',
        plans: [
          { label: 'M', gb: '∞', min: '300', sms: '0', price: 300, features: ['Безлимит ГБ', '300 минут'] },
          { label: 'L', gb: '∞', min: '500', sms: '0', price: 400, features: ['Безлимит ГБ', '500 минут'] },
          { label: 'XL', gb: '∞', min: '∞', sms: '0', price: 550, features: ['Безлимит ГБ', 'Безлимит минут'] }
        ]
      }
    ]
  },

  numbers: {
    title: 'Красивые номера',
    desc: 'Управление каталогом номеров',
    storageKey: 'tarifly_numbers',
    isArray: true,
    columns: [
      { key: 'op', label: 'Оператор', render: v => `<span class="tag tag-${esc(v)}">${esc(opName(v))}</span>` },
      { key: 'num', label: 'Номер' },
      { key: 'desc', label: 'Описание' },
      { key: 'hit', label: 'ХИТ', render: v => v ? '⭐ Да' : '—' }
    ],
    fields: [
      { key: 'op', label: 'Оператор', type: 'select', options: [
        { value: 'mts', label: 'МТС' },
        { value: 'mfn', label: 'МегаФон' },
        { value: 'bee', label: 'Билайн' },
        { value: 'yota', label: 'Yota' },
        { value: 'tele2', label: 'Теле2' }
      ]},
      { key: 'num', label: 'Номер телефона', type: 'text', hint: 'Например: +7 918 368-05-05' },
      { key: 'desc', label: 'Описание', type: 'text' },
      { key: 'hit', label: 'ХИТ-номер', type: 'select', options: [
        { value: '', label: 'Нет' },
        { value: 'true', label: 'Да' }
      ]}
    ],
    defaults: [
      { op: 'mts', num: '+7 918 368-05-05', desc: 'Лёгкий запоминающийся номер', hit: true },
      { op: 'mfn', num: '+7 925 444-77-77', desc: 'Удобный и запоминающийся' },
      { op: 'bee', num: '+7 963 555-22-22', desc: 'Стильный номер для бизнеса' },
      { op: 'mts', num: '+7 989 827-01-01', desc: 'Престижный номер' },
      { op: 'tele2', num: '+7 977 999-33-33', desc: 'Лёгкий и запоминающийся' },
      { op: 'mfn', num: '+7 926 111-00-11', desc: 'Идеальный для вашего бизнеса' }
    ]
  },

  newnumbers: {
    title: 'Новые номера с тарифами',
    desc: 'Номер + тариф в одном предложении (вкладка «Новые»)',
    storageKey: 'tarifly_newnumbers',
    isArray: true,
    columns: [
      { key: 'op', label: 'Оператор', render: v => `<span class="tag tag-${esc(v)}">${esc(opName(v))}</span>` },
      { key: 'num', label: 'Номер' },
      { key: 'tariff', label: 'Тариф' },
      { key: 'gb', label: 'ГБ' },
      { key: 'min', label: 'Мин' },
      { key: 'price', label: 'Цена', render: v => `<b>${esc(v)} ₽</b>` },
      { key: 'hit', label: 'ХИТ', render: v => v ? '⭐ Да' : '—' }
    ],
    fields: [
      { key: 'op', label: 'Оператор', type: 'select', options: [
        { value: 'mts', label: 'МТС' },
        { value: 'mfn', label: 'МегаФон' },
        { value: 'bee', label: 'Билайн' },
        { value: 'yota', label: 'Yota' },
        { value: 'tele2', label: 'Теле2' }
      ]},
      { key: 'num', label: 'Номер телефона', type: 'text', hint: 'Например: +7 999 123-45-67' },
      { key: 'tariff', label: 'Название тарифа', type: 'text', hint: 'Как на карточке, например: MTS Smart' },
      { key: 'gb', label: 'Гигабайты', type: 'text', hint: 'Можно ∞' },
      { key: 'min', label: 'Минуты', type: 'text', hint: 'Можно ∞' },
      { key: 'sms', label: 'SMS', type: 'text' },
      { key: 'price', label: 'Цена (₽/мес)', type: 'number' },
      { key: 'hit', label: 'ХИТ', type: 'select', options: [
        { value: '', label: 'Нет' },
        { value: 'true', label: 'Да' }
      ]},
      { key: 'desc', label: 'Описание (опционально)', type: 'textarea', hint: 'Доп. текст, если понадобится на сайте' }
    ],
    defaults: [
      { op: 'mts', num: '+7 999 123-45-67', tariff: 'MTS Smart', gb: '∞', min: '900', sms: '500', price: 180, hit: true, desc: '' },
      { op: 'mfn', num: '+7 926 555-11-22', tariff: 'Минимум', gb: '15', min: '600', sms: '300', price: 400, desc: '' },
      { op: 'bee', num: '+7 963 777-88-99', tariff: 'Решение', gb: '30', min: '∞', sms: '300', price: 450, desc: '' },
      { op: 'yota', num: '+7 977 111-22-33', tariff: 'Смартфон', gb: '∞', min: '500', sms: '0', price: 400, desc: '' },
      { op: 'mts', num: '+7 918 005-05-05', tariff: 'Больше для своих', gb: '∞', min: '500', sms: '200', price: 500, hit: true, desc: '' },
      { op: 'tele2', num: '+7 977 999-33-33', tariff: 'Для модемов', gb: '∞', min: '0', sms: '0', price: 350, desc: '' }
    ]
  },

  zayavki: {
    title: 'Заявки',
    desc: 'Список заявок клиентов',
    storageKey: 'tarifly_zayavki',
    isArray: true,
    columns: [
      { key: 'type', label: 'Тип', render: v => v === 'tariff' ? 'Тариф' : 'Номер' },
      { key: 'op', label: 'Оператор', render: v => `<span class="tag tag-${esc(v)}">${esc(opName(v))}</span>` },
      { key: 'title', label: 'Название' },
      { key: 'status', label: 'Статус', render: (v, row) => `<span class="tag tag-${esc(v)}">${esc(row.statusText)}</span>` },
      { key: 'date', label: 'Дата' }
    ],
    fields: [
      { key: 'type', label: 'Тип заявки', type: 'select', options: [
        { value: 'tariff', label: 'Тариф' },
        { value: 'number', label: 'Номер' }
      ]},
      { key: 'op', label: 'Оператор', type: 'select', options: [
        { value: 'mts', label: 'МТС' },
        { value: 'mfn', label: 'МегаФон' },
        { value: 'bee', label: 'Билайн' },
        { value: 'yota', label: 'Yota' }
      ]},
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'sub', label: 'Подзаголовок', type: 'text' },
      { key: 'meta', label: 'Характеристики', type: 'text', hint: 'Через запятую, например: 50 ГБ, Безлимит, 300 SMS' },
      { key: 'status', label: 'Статус', type: 'select', options: [
        { value: 'done', label: 'Выполнена' },
        { value: 'process', label: 'В обработке' },
        { value: 'wait', label: 'Ожидает ответа' }
      ]},
      { key: 'statusText', label: 'Текст статуса', type: 'text', hint: 'Например: Выполнена' },
      { key: 'date', label: 'Дата', type: 'text', hint: 'Формат: 10.09.2025 14:32' }
    ],
    defaults: [
      { type: 'tariff', op: 'mts', title: 'Умный бизнес 2025', sub: 'Для юридических лиц', meta: ['Безлимитные звонки', '50 ГБ', '500 SMS'], status: 'done', statusText: 'Выполнена', date: '10.09.2025 14:32' },
      { type: 'number', op: 'mfn', title: '+7 925 444-77-77', sub: 'Золотой номер', meta: ['Красивый номер', 'МегаФон'], status: 'process', statusText: 'В обработке', date: '09.09.2025 18:17' },
      { type: 'tariff', op: 'bee', title: 'Решение', sub: 'Для бизнеса', meta: ['Безлимит на Билайн', '30 ГБ', '300 SMS'], status: 'wait', statusText: 'Ожидает ответа', date: '08.09.2025 12:45' },
      { type: 'number', op: 'yota', title: 'Новый номер для модемов - 172', sub: 'Специальный номер для модемов', meta: ['4G/5G', 'Безлимитный интернет'], status: 'done', statusText: 'Выполнена', date: '06.09.2025 16:20' },
      { type: 'tariff', op: 'mfn', title: 'Минимум', sub: 'Базовый тариф', meta: ['600 минут', '5 ГБ', '300 SMS'], status: 'wait', statusText: 'Ожидает ответа', date: '05.09.2025 11:03' }
    ]
  },

  news: {
    title: 'Новости',
    desc: 'Новостная лента на странице «Инфо»',
    storageKey: 'tarifly_news',
    isArray: true,
    columns: [
      { key: 'op', label: 'Оператор', render: v => `<span class="tag tag-${esc(v)}">${esc(opName(v))}</span>` },
      { key: 'date', label: 'Дата' },
      { key: 'title', label: 'Заголовок' }
    ],
    fields: [
      { key: 'op', label: 'Оператор', type: 'select', options: [
        { value: 'mts', label: 'МТС' },
        { value: 'mfn', label: 'МегаФон' },
        { value: 'bee', label: 'Билайн' },
        { value: 'yota', label: 'Yota' }
      ]},
      { key: 'date', label: 'Дата', type: 'text', hint: 'Например: 10 сентября 2025' },
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'text', label: 'Текст', type: 'textarea' }
    ],
    defaults: [
      { op: 'mts', date: '10 сентября 2025', title: 'МТС запустил новые красивые номера 05-05', text: 'Теперь доступны новые номера с окончанием 05-05.' },
      { op: 'mfn', date: '8 сентября 2025', title: 'Мегафон обновил тариф «Минимум»', text: 'Ещё больше интернета и выгодные условия.' },
      { op: 'bee', date: '5 сентября 2025', title: 'Билайн предлагает новые номера для бизнеса', text: 'Специальные условия для корпоративных клиентов.' },
      { op: 'yota', date: '2 сентября 2025', title: 'Yota расширяет покрытие 4G/5G', text: 'Ещё больше регионов с высокоскоростным интернетом.' }
    ]
  },

  operators: {
    title: 'Операторы',
    desc: 'Список операторов на главной (и код для связи с тарифами/номерами)',
    storageKey: 'tarifly_operators',
    isArray: true,
    columns: [
      { key: 'op', label: 'Код', render: v => v ? `<span class="tag tag-${esc(v)}">${esc(opName(v))}</span>` : '—' },
      { key: 'name', label: 'Название' },
      { key: 'img', label: 'Логотип', render: v => v ? `<img src="${esc(v)}" loading="lazy" style="width:32px;height:32px;object-fit:contain;border-radius:8px;">` : '—' }
    ],
    fields: [
      { key: 'op', label: 'Код оператора', type: 'select', options: [
        { value: 'mts', label: 'МТС (mts)' },
        { value: 'mfn', label: 'МегаФон (mfn)' },
        { value: 'bee', label: 'Билайн (bee)' },
        { value: 'yota', label: 'Yota (yota)' },
        { value: 'tele2', label: 'Теле2 (tele2)' }
      ], hint: 'Нужен для фильтрации тарифов и номеров в панели оператора' },
      { key: 'name', label: 'Отображаемое название', type: 'text' },
      { key: 'img', label: 'Путь к логотипу', type: 'text', hint: 'Например: icons/megafon.png' }
    ],
    defaults: [
      { op: 'mfn', name: 'Мегафон', img: 'icons/megafon.png' },
      { op: 'bee', name: 'Билайн', img: 'icons/beeline.png' },
      { op: 'mts', name: 'МТС', img: 'icons/mts.png' },
      { op: 'yota', name: 'ЙОТА', img: 'icons/yota.png' }
    ]
  },

  promo: {
    title: 'Баннер',
    desc: 'Рекламный блок на главной странице',
    storageKey: 'tarifly_promo',
    isArray: false,
    fields: [
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'desc', label: 'Описание', type: 'textarea' },
      { key: 'num1', label: 'Номер 1', type: 'text' },
      { key: 'num2', label: 'Номер 2', type: 'text' },
      { key: 'btnText', label: 'Текст кнопки', type: 'text', hint: 'По умолчанию: Перейти к номерам' },
      { key: 'btnLink', label: 'Ссылка кнопки', type: 'text', hint: 'Например: #newnumbers или #nomera' }
    ],
    defaults: {
      title: 'Красивые номера уже ждут вас',
      desc: 'Легкие, запоминающиеся, для работы и жизни.',
      num1: '+7 920 001-01-01',
      num2: '+7 932 707-07-07',
      btnText: 'Перейти к номерам',
      btnLink: '#newnumbers'
    }
  },

  support: {
    title: 'WhatsApp / Telegram',
    desc: 'Номер для заявок с сайта и ссылка Telegram',
    storageKey: 'tarifly_support',
    isArray: false,
    fields: [
      { key: 'whatsapp', label: 'WhatsApp (только цифры)', type: 'text', hint: 'Например 79001234567 — сюда уходят «Оформить в WhatsApp»' },
      { key: 'telegram', label: 'Telegram', type: 'text', hint: 'https://t.me/... или @username' }
    ],
    defaults: {
      whatsapp: '70000000000',
      telegram: 'https://t.me/tarifly_support'
    }
  },

  settings: {
    title: 'Настройки',
    desc: 'Сброс данных и служебные действия',
    storageKey: 'tarifly_settings',
    isArray: false,
    fields: [],
    defaults: {}
  }
};

function opName(code) {
  return { mts: 'МТС', mfn: 'МегаФон', bee: 'Билайн', yota: 'Yota', tele2: 'Теле2' }[code] || code;
}

/* ---------------- 2. ХРАНИЛИЩЕ ---------------- */
function loadData(schema) {
  try {
    const raw = localStorage.getItem(schema.storageKey);
    if (!raw) return JSON.parse(JSON.stringify(schema.defaults));
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Ошибка чтения', schema.storageKey, e);
    return JSON.parse(JSON.stringify(schema.defaults));
  }
}

function saveData(schema, data) {
  try {
    localStorage.setItem(schema.storageKey, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Ошибка сохранения', schema.storageKey, e);
    toast('Ошибка сохранения', 'error');
    return false;
  }
}

/* ---------------- 3. СОСТОЯНИЕ ---------------- */
let currentTab = 'tariffs';
let editingIndex = -1;

/* ---------------- 4. РЕНДЕР СТРАНИЦЫ ---------------- */
function renderPage() {
  const schema = SCHEMAS[currentTab];
  if (!schema) return;

  document.getElementById('pageTitle').textContent = schema.title;
  document.getElementById('pageDesc').textContent = schema.desc;

  const content = document.getElementById('content');

  // Настройки — служебные действия
  if (currentTab === 'settings') {
    content.innerHTML = `
      <div class="card" style="padding:24px;">
        <p style="color:var(--ink-soft);margin-bottom:16px;line-height:1.5;">
          Данные хранятся в браузере (localStorage). Экспорт сохраняет JSON-бэкап, импорт загружает его обратно.
          Сброс удаляет все ключи <code>tarifly_*</code> и подставляет значения по умолчанию.
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button type="button" class="btn btn-secondary" id="settingsExport">Экспорт всех данных</button>
          <button type="button" class="btn btn-secondary" id="settingsImport">Импорт из файла</button>
          <button type="button" class="btn btn-danger" id="settingsReset">Сбросить всё к дефолту</button>
        </div>
      </div>`;
    document.getElementById('settingsExport')?.addEventListener('click', exportAll);
    document.getElementById('settingsImport')?.addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('settingsReset')?.addEventListener('click', resetAll);
    return;
  }

  const data = loadData(schema);

  // Если это объект (баннер) — показываем форму напрямую
  if (!schema.isArray) {
    content.innerHTML = renderObjectView(schema, data);
    bindObjectView();
    return;
  }

  // Массив — таблица
  if (data.length === 0) {
    content.innerHTML = `
      <div class="card">
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Пока нет данных. Нажмите «Добавить», чтобы создать первую запись.
        </div>
      </div>`;
    return;
  }

  const rows = data.map((row, i) => {
    const cells = schema.columns.map(col => {
      const v = row[col.key];
      const cell = col.render ? col.render(v, row) : (v !== undefined && v !== '' ? esc(v) : '—');
      return `<td>${cell}</td>`;
    }).join('');
    return `
      <tr>
        ${cells}
        <td>
          <div class="td-actions">
            <button class="btn-icon" title="Редактировать" data-action="edit" data-idx="${i}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon danger" title="Удалить" data-action="delete" data-idx="${i}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  content.innerHTML = `
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${schema.columns.map(c => `<th>${esc(c.label)}</th>`).join('')}
              <th style="text-align:right;">Действия</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;

  // Обработка кнопок
  content.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (btn.dataset.action === 'edit') openModal(idx);
      if (btn.dataset.action === 'delete') deleteItem(idx);
    });
  });
}

/* ---------------- 5. РЕНДЕР ОБЪЕКТА (баннер) ---------------- */
function renderObjectView(schema, data) {
  const fieldsHTML = schema.fields.map(f => {
    const val = data[f.key] ?? '';
    return renderField(f, val);
  }).join('');

  return `
    <div class="card" style="padding: 24px;">
      <form id="objectForm">
        ${fieldsHTML}
        <div style="margin-top: 20px; display: flex; gap: 8px;">
          <button type="submit" class="btn btn-primary">Сохранить изменения</button>
          <button type="button" class="btn btn-secondary" id="resetObjectBtn">Сбросить к дефолту</button>
        </div>
      </form>
    </div>`;
}

function bindObjectView() {
  const schema = SCHEMAS[currentTab];
  const form = document.getElementById('objectForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {};
    schema.fields.forEach(f => {
      const input = form.querySelector(`[name="${f.key}"]`);
      if (input) data[f.key] = input.value;
    });
    if (saveData(schema, data)) {
      toast('Сохранено!', 'success');
    }
  });

  document.getElementById('resetObjectBtn')?.addEventListener('click', () => {
    if (!confirm('Сбросить к значениям по умолчанию?')) return;
    saveData(schema, schema.defaults);
    renderPage();
    toast('Сброшено', 'success');
  });
}

/* ---------------- 6. ФОРМА ПОЛЯ ---------------- */
function renderField(field, value) {
  const id = `field_${field.key}`;
  let input = '';

  if (field.type === 'select') {
    const opts = field.options.map(o =>
      `<option value="${esc(o.value)}" ${String(value) === String(o.value) ? 'selected' : ''}>${esc(o.label)}</option>`
    ).join('');
    input = `<select id="${id}" name="${field.key}">${opts}</select>`;
  } else if (field.type === 'textarea') {
    input = `<textarea id="${id}" name="${field.key}">${esc(value)}</textarea>`;
  } else if (field.type === 'number') {
    input = `<input type="number" id="${id}" name="${field.key}" value="${esc(value)}">`;
  } else {
    input = `<input type="text" id="${id}" name="${field.key}" value="${esc(value)}">`;
  }

  return `
    <div class="form-row">
      <label for="${id}">${esc(field.label)}</label>
      ${input}
      ${field.hint ? `<div class="form-hint">${esc(field.hint)}</div>` : ''}
    </div>`;
}

/* ---------------- 7. МОДАЛКА ---------------- */
function normalizeTariffPlans(item) {
  if (Array.isArray(item.plans) && item.plans.length) {
    return item.plans.map(p => ({
      label: p.label || p.code || 'M',
      gb: p.gb ?? '',
      min: p.min ?? '',
      sms: p.sms ?? '',
      price: p.price ?? 0,
      features: Array.isArray(p.features) ? p.features : (p.features ? String(p.features).split(',').map(s => s.trim()).filter(Boolean) : []),
      desc: p.desc || ''
    }));
  }
  // legacy flat tariff → one plan
  if (item.gb !== undefined || item.price !== undefined) {
    return [{
      label: 'M',
      gb: item.gb ?? '',
      min: item.min ?? '',
      sms: item.sms ?? '',
      price: item.price ?? 0,
      features: Array.isArray(item.features) ? item.features : [],
      desc: ''
    }];
  }
  return [{ label: 'M', gb: '', min: '', sms: '', price: 0, features: [], desc: '' }];
}

function renderPlanEditor(plans) {
  const rows = plans.map((p, i) => `
    <div class="plan-row" data-plan-idx="${i}">
      <div class="plan-row-head">
        <strong>План ${i + 1}</strong>
        <button type="button" class="btn btn-sm btn-danger plan-remove" data-plan-remove="${i}">Удалить</button>
      </div>
      <div class="form-row-2">
        <div class="form-row">
          <label>Метка (M / L / XL)</label>
          <input type="text" name="plan_label_${i}" value="${esc(p.label)}" placeholder="M">
        </div>
        <div class="form-row">
          <label>Цена ₽/мес</label>
          <input type="number" name="plan_price_${i}" value="${esc(p.price)}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-row">
          <label>ГБ</label>
          <input type="text" name="plan_gb_${i}" value="${esc(p.gb)}" placeholder="∞">
        </div>
        <div class="form-row">
          <label>Минуты</label>
          <input type="text" name="plan_min_${i}" value="${esc(p.min)}" placeholder="∞">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-row">
          <label>SMS</label>
          <input type="text" name="plan_sms_${i}" value="${esc(p.sms)}">
        </div>
        <div class="form-row">
          <label>Особенности плана</label>
          <input type="text" name="plan_features_${i}" value="${esc((p.features || []).join(', '))}" placeholder="Через запятую">
        </div>
      </div>
      <div class="form-row">
        <label>Описание плана (опционально)</label>
        <textarea name="plan_desc_${i}" rows="2">${esc(p.desc || '')}</textarea>
      </div>
    </div>
  `).join('');
  return `
    <div class="plans-editor">
      <div class="plans-editor-title">Тарифные планы (M / L / XL)</div>
      <div class="form-hint" style="margin-bottom:12px;">На карточке появятся переключатели. Фото общее для всех планов.</div>
      <div id="plansList">${rows}</div>
      <button type="button" class="btn btn-secondary" id="addPlanBtn" style="margin-top:8px;">+ Добавить план</button>
    </div>`;
}

function openModal(index = -1) {
  const schema = SCHEMAS[currentTab];
  if (!schema.isArray) return;

  editingIndex = index;
  const data = loadData(schema);
  const item = index === -1 ? {} : data[index];

  document.getElementById('modalTitle').textContent = index === -1 ? 'Добавить запись' : 'Редактировать запись';

  // Custom form for tariffs with multi-plan editor
  if (currentTab === 'tariffs') {
    const plans = normalizeTariffPlans(item);
    const baseFields = [
      { key: 'op', label: 'Оператор', type: 'select', options: [
        { value: 'mts', label: 'МТС' },
        { value: 'mfn', label: 'МегаФон' },
        { value: 'bee', label: 'Билайн' },
        { value: 'yota', label: 'Yota' }
      ]},
      { key: 'name', label: 'Название тарифа', type: 'text' },
      { key: 'img', label: 'Изображение тарифа', type: 'text', hint: 'URL или путь. Фото общее для всех планов, показывается целиком' },
      { key: 'desc', label: 'Общее описание', type: 'textarea', hint: 'Показывается в «Подробнее». Можно уточнить в каждом плане' }
    ].map(f => renderField(f, item[f.key] ?? '')).join('');

    document.getElementById('modalBody').innerHTML = `<form id="modalForm">${baseFields}${renderPlanEditor(plans)}</form>`;
    document.getElementById('modal').classList.add('open');
    bindPlanEditor();
    return;
  }

  const fieldsHTML = schema.fields.map(f => {
    let val = item[f.key] ?? '';
    if (f.key === 'meta' && Array.isArray(val)) val = val.join(', ');
    if (f.key === 'features' && Array.isArray(val)) val = val.join(', ');
    if (f.type === 'select' && f.options && f.options[0] && f.options[0].value === '' && val === '') {
      val = '';
    }
    return renderField(f, val);
  }).join('');

  document.getElementById('modalBody').innerHTML = `<form id="modalForm">${fieldsHTML}</form>`;
  document.getElementById('modal').classList.add('open');
}

function bindPlanEditor() {
  const list = document.getElementById('plansList');
  if (!list) return;

  document.getElementById('addPlanBtn')?.addEventListener('click', () => {
    const count = list.querySelectorAll('.plan-row').length;
    const labels = ['M', 'L', 'XL', 'XXL'];
    const label = labels[count] || `P${count + 1}`;
    const wrap = document.createElement('div');
    wrap.innerHTML = renderPlanEditor([{ label, gb: '', min: '', sms: '', price: 0, features: [], desc: '' }]);
    const row = wrap.querySelector('.plan-row');
    // reindex
    row.dataset.planIdx = String(count);
    row.querySelectorAll('[name]').forEach(inp => {
      inp.name = inp.name.replace(/_\d+$/, '_' + count);
    });
    row.querySelector('[data-plan-remove]')?.setAttribute('data-plan-remove', String(count));
    list.appendChild(row);
    bindPlanRemoveButtons();
  });

  bindPlanRemoveButtons();
}

function bindPlanRemoveButtons() {
  document.querySelectorAll('[data-plan-remove]').forEach(btn => {
    btn.onclick = () => {
      const list = document.getElementById('plansList');
      if (!list || list.querySelectorAll('.plan-row').length <= 1) {
        toast('Нужен хотя бы один план', 'error');
        return;
      }
      btn.closest('.plan-row')?.remove();
    };
  });
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  editingIndex = -1;
}

function saveModal() {
  const schema = SCHEMAS[currentTab];
  const form = document.getElementById('modalForm');
  if (!form) return;

  // ---- Тарифы с планами ----
  if (currentTab === 'tariffs') {
    const op = form.querySelector('[name="op"]')?.value?.trim() || '';
    const name = form.querySelector('[name="name"]')?.value?.trim() || '';
    const img = form.querySelector('[name="img"]')?.value?.trim() || '';
    const desc = form.querySelector('[name="desc"]')?.value?.trim() || '';

    let valid = true;
    if (!op) { form.querySelector('[name="op"]').style.borderColor = '#e30613'; valid = false; }
    else form.querySelector('[name="op"]').style.borderColor = '';
    if (!name) { form.querySelector('[name="name"]').style.borderColor = '#e30613'; valid = false; }
    else form.querySelector('[name="name"]').style.borderColor = '';

    const planRows = [...form.querySelectorAll('.plan-row')];
    if (!planRows.length) {
      toast('Добавьте хотя бы один план', 'error');
      return;
    }

    const plans = planRows.map((row, i) => {
      const get = (suffix) => row.querySelector(`[name^="plan_${suffix}_"]`)?.value?.trim() ?? '';
      // names may be plan_label_0 etc
      const label = row.querySelector(`input[name^="plan_label_"]`)?.value?.trim() || 'M';
      const gb = row.querySelector(`input[name^="plan_gb_"]`)?.value?.trim() || '';
      const min = row.querySelector(`input[name^="plan_min_"]`)?.value?.trim() || '';
      const sms = row.querySelector(`input[name^="plan_sms_"]`)?.value?.trim() || '';
      const priceRaw = row.querySelector(`input[name^="plan_price_"]`)?.value?.trim() || '0';
      const featuresRaw = row.querySelector(`input[name^="plan_features_"]`)?.value?.trim() || '';
      const planDesc = row.querySelector(`textarea[name^="plan_desc_"]`)?.value?.trim() || '';
      if (!gb && !min && !priceRaw) valid = false;
      return {
        label,
        gb,
        min,
        sms,
        price: Number(priceRaw) || 0,
        features: featuresRaw ? featuresRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
        desc: planDesc
      };
    });

    if (!valid) {
      toast('Заполните название и планы', 'error');
      return;
    }

    // mirror first plan to top-level for backward compat
    const first = plans[0];
    const data = {
      op, name, img, desc,
      plans,
      gb: first.gb, min: first.min, sms: first.sms, price: first.price,
      features: first.features
    };

    const list = loadData(schema);
    if (editingIndex === -1) list.push(data);
    else list[editingIndex] = data;

    if (saveData(schema, list)) {
      toast(editingIndex === -1 ? 'Добавлено!' : 'Сохранено!', 'success');
      closeModal();
      renderPage();
    }
    return;
  }

  // ---- Остальные разделы ----
  let valid = true;
  const OPTIONAL_FIELDS = ['hit', 'sms', 'meta', 'img', 'desc', 'features', 'btnText', 'btnLink', 'tariff'];
  const data = {};
  schema.fields.forEach(f => {
    const input = form.querySelector(`[name="${f.key}"]`);
    if (!input) return;
    const raw = input.value.trim();
    const isEmpty = raw === '';

    if (isEmpty && !OPTIONAL_FIELDS.includes(f.key)) {
      input.style.borderColor = '#e30613';
      valid = false;
    } else {
      input.style.borderColor = '';
    }

    let v = raw;
    if (f.type === 'number') v = isEmpty ? 0 : Number(raw);
    if (f.key === 'hit') v = (raw === 'true');
    if (f.key === 'meta') v = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (f.key === 'features') v = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];

    data[f.key] = v;
  });

  if (!valid) {
    toast('Заполните обязательные поля', 'error');
    return;
  }

  const list = loadData(schema);
  if (editingIndex === -1) list.push(data);
  else list[editingIndex] = data;

  if (saveData(schema, list)) {
    toast(editingIndex === -1 ? 'Добавлено!' : 'Сохранено!', 'success');
    closeModal();
    renderPage();
  }
}

function deleteItem(index) {
  const schema = SCHEMAS[currentTab];
  if (!confirm('Удалить эту запись?')) return;
  const list = loadData(schema);
  list.splice(index, 1);
  if (saveData(schema, list)) {
    toast('Удалено', 'success');
    renderPage();
  }
}

/* ---------------- 8. ЭКСПОРТ / ИМПОРТ ---------------- */
function exportAll() {
  const backup = { version: 1, exportedAt: new Date().toISOString(), data: {} };
  Object.keys(SCHEMAS).forEach(k => {
    backup.data[k] = loadData(SCHEMAS[k]);
  });

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tarifly-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Экспортировано', 'success');
}

function importAll(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.data) throw new Error('Неверный формат файла');
      Object.keys(SCHEMAS).forEach(k => {
        if (parsed.data[k] !== undefined) {
          saveData(SCHEMAS[k], parsed.data[k]);
        }
      });
      toast('Импортировано', 'success');
      renderPage();
    } catch (err) {
      toast('Ошибка: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!confirm('Сбросить ВСЕ данные к значениям по умолчанию?')) return;
  Object.keys(SCHEMAS).forEach(k => {
    localStorage.removeItem(SCHEMAS[k].storageKey);
  });
  toast('Все данные сброшены', 'success');
  renderPage();
}

/* ---------------- 9. TOAST ---------------- */
let toastTimer;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 2200);
}

/* ---------------- 10. ИНИЦИАЛИЗАЦИЯ ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderPage();

  // Переключение вкладок
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentTab = link.dataset.tab;
      renderPage();
      // Закрыть сайдбар на мобильных
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // Кнопки
  document.getElementById('addBtn').addEventListener('click', () => {
    if (SCHEMAS[currentTab].isArray) openModal(-1);
    else toast('Этот раздел не поддерживает добавление', 'error');
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalSave').addEventListener('click', saveModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });

  document.getElementById('exportBtn').addEventListener('click', exportAll);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', (e) => {
    if (e.target.files[0]) importAll(e.target.files[0]);
    e.target.value = '';
  });

  // Мобильное меню
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Горячие клавиши
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});

/* ============================================================
   ГЛОБАЛЬНЫЙ ДОСТУП — чтобы основной сайт мог читать данные
   (используется в script.js основного сайта)
   ============================================================ */
window.TARIFLY_DATA = {
  load(schemaKey) {
    const schema = SCHEMAS[schemaKey];
    if (!schema) return null;
    return loadData(schema);
  }
};