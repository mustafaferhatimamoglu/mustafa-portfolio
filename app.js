/* app.js */
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const CFG = window.APP_CONFIG || {};

const getActiveProjectFilter = () => $('.chip.is-active')?.dataset.filter || 'all';

const INLINE_FALLBACKS = {
  tr: {
    nav: { about: 'Hakkımda', skills: 'Yetenekler', experience: 'Deneyim', projects: 'Projeler', contact: 'İletişim' },
    hero: {
      hello: 'Merhaba,',
      iAm: 'ben',
      badge: 'Yazılım • Makine • Elektronik',
      cvAi: 'Görüntü işleme & AI',
      erp: 'ERP/B2B2C Entegrasyon',
      viewProjects: 'Projelerimi Gör',
      contactMe: 'İletişime Geç',
      years: '🧑‍💻 8+ yıl deneyim'
    },
    sections: { about: 'Hakkımda', skills: 'Yetenekler', experience: 'Deneyim', projects: 'Projeler', contact: 'İletişim' },
    about: {
      text: 'Yazılım, makine ve elektronik disiplinlerini birleştiren uçtan uca çözümler geliştiriyorum.',
      focus: 'Odak Alanlarım',
      tags: ['Kurumsal Uygulamalar', 'IoT & ESP32', 'Görüntü İşleme / AI', 'ERP/CRM Entegrasyon', 'Doğrulama & Test'],
      edu: 'Eğitim',
      edu1: 'Erciyes Üniversitesi — Bilgisayar Mühendisliği (Lisans)',
      edu2: 'Erciyes Üniversitesi — Makine Mühendisliği (Lisans)'
    },
    filters: { all: 'Tümü', software: 'Yazılım', iot: 'IoT / Gömülü', ai: 'Görüntü İşleme / AI', automation: 'Otomasyon/Test' },
    contact: {
      whats: 'WhatsApp Görüşme Başlat',
      call: 'Ara: {phone}',
      tg: 'Telegram: @{user}',
      mail: 'E-posta Gönder'
    },
    form: {
      title: 'İletişim Formu',
      name: 'Ad Soyad',
      company: 'Firma',
      email: 'E-posta',
      phone: 'Telefon',
      msg: 'Mesaj',
      send: 'Gönder'
    },
    auth: {
      login: 'Giriş Yap',
      title: 'Müşteri Portalı',
      desc: 'Telegram üzerinden giriş ve onay akışı.',
      signup: 'Yeni Müşteri Ol',
      cancel: 'Kapat'
    },
    signup: {
      title: 'Yeni Müşteri — Bilgi Formu',
      fullname: 'Ad Soyad',
      company: 'Firma',
      email: 'E-posta',
      phone: 'Telefon',
      taxoffice: 'Vergi Dairesi',
      taxno: 'Vergi No / TCKN',
      address: 'Fatura Adresi',
      send: 'Gönder',
      note: 'Gönderimden sonra Telegram üzerinden iki aşamalı onay alınır.'
    },
    ui: { sending: 'Gönderiliyor…', sent: 'Gönderildi ✅', error: 'Hata' }
  },
  en: {
    nav: { about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects', contact: 'Contact' },
    hero: {
      hello: 'Hello,',
      iAm: 'I am',
      badge: 'Software • Mechanical • Electronics',
      cvAi: 'Computer Vision & AI',
      erp: 'ERP/B2B2C Integrations',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
      years: '🧑‍💻 8+ years experience'
    },
    sections: { about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects', contact: 'Contact' },
    about: {
      text: 'I build end-to-end solutions that fuse software with mechanical and electronics disciplines.',
      focus: 'Focus Areas',
      tags: ['Corporate Applications', 'IoT & Embedded Systems', 'Computer Vision / AI', 'ERP/CRM Integration', 'Integration & Validation'],
      edu: 'Education',
      edu1: 'Erciyes University — Computer Engineering (BSc)',
      edu2: 'Erciyes University — Mechanical Engineering (BSc)'
    },
    filters: { all: 'All', software: 'Software', iot: 'IoT / Embedded', ai: 'Computer Vision / AI', automation: 'Automation/Testing' },
    contact: {
      whats: 'Start WhatsApp Chat',
      call: 'Call: {phone}',
      tg: 'Telegram: @{user}',
      mail: 'Send Email'
    },
    form: {
      title: 'Contact Form',
      name: 'Full Name',
      company: 'Company',
      email: 'Email',
      phone: 'Phone',
      msg: 'Message',
      send: 'Send'
    },
    auth: {
      login: 'Log In',
      title: 'Client Portal',
      desc: 'Sign-in and approvals are handled via Telegram.',
      signup: 'Become a Client',
      cancel: 'Close'
    },
    signup: {
      title: 'New Client — Information',
      fullname: 'Full Name',
      company: 'Company',
      email: 'Email',
      phone: 'Phone',
      taxoffice: 'Tax Office',
      taxno: 'Tax No / National ID',
      address: 'Billing Address',
      send: 'Send',
      note: 'A two-step approval is required via Telegram after submission.'
    },
    ui: { sending: 'Sending…', sent: 'Sent ✅', error: 'Error' }
  }
};

let currentLang = localStorage.getItem('lang') || CFG.LANG_DEFAULT || 'tr';
if(!INLINE_FALLBACKS[currentLang]) currentLang = 'tr';
let DICT = null; // loaded JSON dictionary

async function loadLangDict(lc){
  const fallback = INLINE_FALLBACKS[lc] || INLINE_FALLBACKS.tr;
  try{
    const url = new URL(`lang/${lc}.json`, window.location.href);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if(!res.ok) throw new Error(`lang load failed: ${lc} (${res.status})`);
    return await res.json();
  }catch(err){
    console.warn(`i18n fallback engaged for ${lc}`, err);
    return fallback ? JSON.parse(JSON.stringify(fallback)) : {};
  }
}
function t(path, vars={}){
  const parts = path.split('.');
  let val = DICT;
  for(const p of parts){ val = val?.[p]; }
  if(typeof val !== 'string') return '';
  return val.replace(/\{(\w+)\}/g, (_,k)=> vars[k] ?? '');
}
async function applyI18n(){
  DICT = await loadLangDict(currentLang);
  const phoneHuman = CFG.CONTACT?.PHONE_HUMAN || '';
  const botUser = CFG.TELEGRAM?.BOT_USERNAME || '';
  $$('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const vars = (key==='contact.call') ? {phone: phoneHuman}
               : (key==='contact.tg')   ? {user: botUser}
               : {};
    el.textContent = t(key, vars);
  });
  // focus tags from dict
  const tags = DICT?.about?.tags || [];
  const ul = $('#focusTags'); if(ul){ ul.innerHTML=''; tags.forEach(txt=>{ const li=document.createElement('li'); li.textContent=txt; ul.appendChild(li); }); }
  // typer phrases
  const typer = $('#typer'); if(typer){ const attr = currentLang==='en' ? 'data-phrases-en' : 'data-phrases-tr'; typer.setAttribute('data-phrases', typer.getAttribute(attr)); }
  // links
  const phoneE164 = CFG.CONTACT?.PHONE_E164 || '';
  const whatsText = CFG.CONTACT?.WHATS_TEXT || '';
  const whatsHref = phoneE164 ? `https://wa.me/${phoneE164.replace('+','')}?text=${encodeURIComponent(whatsText)}` : '#';
  $('#btnWhats')?.setAttribute('href', whatsHref);
  $('#btnCall')?.setAttribute('href', phoneE164 ? `tel:${phoneE164}` : '#');
  $('#btnTg')?.setAttribute('href', botUser ? `https://t.me/${botUser}` : '#');
  const mailHref = CFG.CONTACT?.EMAIL ? `mailto:${CFG.CONTACT.EMAIL}` : '#';
  $('#btnMail')?.setAttribute('href', mailHref);
  $('#btnTgLogin')?.setAttribute('href', botUser ? `https://t.me/${botUser}?start=login` : '#');
  // location
  if(CFG.SHOW_LOCATION){ $('#heroMeta')?.removeAttribute('hidden'); } else { $('#heroMeta')?.setAttribute('hidden',''); }
}

// theme & header
(function initChrome(){
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if(savedTheme==='light') root.classList.add('light');
  if(themeToggle){
    themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
    themeToggle.addEventListener('click', ()=>{
      root.classList.toggle('light');
      localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
      themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
    });
  }
  $('#year') && ($('#year').textContent = new Date().getFullYear());
  const menuToggle = $('#menuToggle'); const mainNav = $('#mainNav');
  menuToggle?.addEventListener('click', ()=>{ const open = mainNav.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); });
})();

// language switch
// typewriter
(function typewriter(){
  const el = $('#typer'); if(!el) return;
  const pickFallbackAttr = ()=> el.getAttribute('data-phrases')
    || el.getAttribute(currentLang==='en' ? 'data-phrases-en' : 'data-phrases-tr')
    || el.getAttribute('data-phrases-tr')
    || el.getAttribute('data-phrases-en');
  const readPhrases = ()=>{
    const raw = pickFallbackAttr();
    if(!raw) return [];
    try{ return JSON.parse(raw); }
    catch(err){ console.warn('typewriter phrases parse failed', err); return []; }
  };
  let phrases = readPhrases();
  if(!phrases.length) return;
  let i=0,j=0,deleting=false,pause=800;
  function refreshPhrases(){
    const latest = readPhrases();
    if(latest.length) phrases = latest;
  }
  function tick(){
    refreshPhrases();
    const cur = phrases[i % phrases.length];
    if(!deleting){ el.textContent = cur.slice(0, ++j); if(j===cur.length){ deleting=true; return void setTimeout(tick, pause);} }
    else { el.textContent = cur.slice(0, --j); if(j===0){ deleting=false; i++; } }
    setTimeout(tick, (deleting?28:40) + Math.random()*50);
  }
  tick();
})();

// skills
const SKILLS = {
  tr: [
    'C# / .NET',
    'MSSQL',
    'DevExpress',
    'Entity Framework',
    'ASP.NET',
    'JavaScript',
    'Python / OpenCV',
    'IoT / ESP32 / C/C++',
    'Görüntü İşleme / AI',
    'ERP / B2B2C Entegrasyon',
    'Linux & AD & Sanallaştırma',
    'Test & Doğrulama Otomasyonu'
  ],
  en: [
    'C# / .NET',
    'MSSQL',
    'DevExpress',
    'Entity Framework',
    'ASP.NET',
    'JavaScript',
    'Python / OpenCV',
    'IoT / ESP32 / C/C++',
    'Computer Vision / AI',
    'ERP / B2B2C Integration',
    'Linux & AD & Virtualization',
    'Test & Verification Automation'
  ]
};
const SKILL_LEVELS = [95, 90, 88, 87, 85, 80, 78, 83, 82, 86, 80, 84];
function renderSkills(){
  const grid = $('#skillsGrid'); if(!grid) return;
  grid.innerHTML='';
  (SKILLS[currentLang]||[]).forEach((name,idx)=>{
    const d=document.createElement('div'); d.className='skill';
    const level = SKILL_LEVELS[idx] ?? 80;
    d.innerHTML = `<h4>${name}</h4><div class="meter"><i style="width:${level}%"></i></div>`;
    grid.appendChild(d);
  });
}

// experience
const EXPERIENCE = [
  {
    title_tr: 'Bilgi İşlem Uzmanı',
    title_en: 'IT Specialist',
    company: 'Şirikçioğlu Tekstil',
    time_tr: 'Mar 2025 — Devam',
    time_en: 'Mar 2025 — Present',
    location: 'Kayseri',
    bullets_tr: [
      'Sunucu, network, güvenlik (firewall) kurulumu ve yönetimi.',
      'C# WinForms + MSSQL ile iç yazılımlar (arıza takibi, fazla mesai, sendika).',
      'Active Directory, sanallaştırma, yedekleme süreçleri.',
      'IP CCTV sistem entegrasyonu; üretim kalite için görüntü işleme.'
    ],
    bullets_en: [
      'Deploying and administering servers, networking and firewall security.',
      'C# WinForms + MSSQL internal apps (fault tracking, overtime, union workflows).',
      'Active Directory, virtualization and backup operations.',
      'IP CCTV integration with computer vision for production quality.'
    ]
  },
  {
    title_tr: 'Sistem Mühendisi',
    title_en: 'Systems Engineer',
    company: 'Ayruz Endüstri',
    time_tr: 'Şub 2023 — Ara 2024',
    time_en: 'Feb 2023 — Dec 2024',
    location: 'Kayseri',
    bullets_tr: [
      'Havacılık projelerinde tasarım, entegrasyon ve doğrulama.',
      'DO-178/DO-254, MIL-STD-810G/DO-160 test planlama ve uygulama.',
      'Helikopter vinç yazılımı, yakıt probu, test ekipmanları.'
    ],
    bullets_en: [
      'Design, integration and verification across aerospace programmes.',
      'Planned and executed DO-178/DO-254, MIL-STD-810G/DO-160 campaigns.',
      'Helicopter hoist software, fuel probe and test equipment delivery.'
    ]
  },
  {
    title_tr: 'Sistem Mühendisi',
    title_en: 'Systems Engineer',
    company: 'Zirve Bilişim',
    time_tr: 'Haz 2021 — Şub 2023',
    time_en: 'Jun 2021 — Feb 2023',
    location: 'Kayseri',
    bullets_tr: [
      'BT altyapısı: güvenlik duvarı, sanallaştırma, NAS/yedekleme.',
      'Logo uyumlu entegrasyonlar, ağ trafiği optimizasyonu.',
      'Kamera/güvenlik sistemleri ve kullanıcı destek süreçleri.'
    ],
    bullets_en: [
      'IT infrastructure: firewalls, virtualization, NAS/backup platforms.',
      'Logo-aligned integrations and network traffic optimisation.',
      'Camera/security systems and user support operations.'
    ]
  },
  {
    title_tr: 'Yazılım Mühendisi',
    title_en: 'Software Engineer',
    company: 'Sedaş Bilgisayar',
    time_tr: 'Ara 2019 — Haz 2021',
    time_en: 'Dec 2019 — Jun 2021',
    location: 'Kayseri',
    bullets_tr: [
      'Netsis/Logo B2B2C-ERP entegrasyonları.',
      'TURPAK entegre istasyon yönetimi; el terminali ekranları.',
      'Bulut yedekleme ve özel raporlama yazılımları.'
    ],
    bullets_en: [
      'Netsis/Logo B2B2C-ERP integrations.',
      'TURPAK integrated station management and handheld interfaces.',
      'Cloud backup solutions and bespoke reporting software.'
    ]
  }
];
function renderExperience(){
  const list = $('#experienceList'); if(!list) return;
  list.innerHTML='';
  EXPERIENCE.forEach(j=>{
    const el=document.createElement('div'); el.className='job';
    const title = currentLang==='en' ? j.title_en : j.title_tr;
    const bullets = currentLang==='en' ? j.bullets_en : j.bullets_tr;
    const metaTime = currentLang==='en' ? j.time_en : j.time_tr;
    const meta = [metaTime, CFG.SHOW_LOCATION ? j.location : ''].filter(Boolean).join(' • ');
    el.innerHTML = `<h4>${title} — ${j.company}</h4>${meta?`<div class="meta">${meta}</div>`:''}
      <ul>${bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
    list.appendChild(el);
  });
}

// projects
const PROJECTS = {
  tr: [
    {
      title: 'Araçta Sarsıntı Algılayan ESP32-CAM',
      desc: 'G-sensör tetikli fotoğraf: altına tarih/saat + ivme yazısı basıp Telegram’a gönderir.',
      tags: ['ESP32', 'IoT', 'Görüntü İşleme'],
      type: 'iot'
    },
    {
      title: 'Yapay Zeka Destekli Görüntü İşleme Sistemleri',
      desc: 'Yangın algılama, araç erişim, otopark yönetimi — Python/OpenCV/TensorFlow + ESP32 entegrasyonu.',
      tags: ['Python', 'OpenCV', 'TensorFlow', 'AI'],
      type: 'ai'
    },
    {
      title: 'Otomatik Çevresel Test Sistemi',
      desc: 'DO-160 & MIL-STD-810 uyumlu test senaryolarını C#/.NET ile otomatikleştirme, veri toplama ve raporlama.',
      tags: ['C#', '.NET', 'Otomasyon'],
      type: 'automation'
    },
    {
      title: 'Kaan/Hürjet Yakıt Probu',
      desc: 'Donanım + gömülü yazılım + entegrasyon ve test aşamaları.',
      tags: ['Gömülü', 'C', 'C#'],
      type: 'iot'
    },
    {
      title: 'B2B Sipariş & Fatura Yönetimi',
      desc: 'Logo ERP ile tam entegre B2B: sipariş, irsaliye, fatura; web arayüz ve servisler.',
      tags: ['ASP.NET', 'MSSQL', 'Entegrasyon'],
      type: 'software'
    },
    {
      title: 'Akıllı Şehir Aydınlatma (ESP32 Mesh)',
      desc: 'Mesh yapı, ölçeklenebilir topoloji, MQTT ile gerçek zamanlı izleme.',
      tags: ['ESP32', 'MQTT', 'IoT'],
      type: 'iot'
    }
  ],
  en: [
    {
      title: 'In-Vehicle Shock Sensing ESP32-CAM',
      desc: 'G-sensor triggered snapshot; overlays date/time plus acceleration and sends it to Telegram.',
      tags: ['ESP32', 'IoT', 'Computer Vision'],
      type: 'iot'
    },
    {
      title: 'AI-Assisted Computer Vision Systems',
      desc: 'Fire detection, vehicle access and parking control — Python/OpenCV/TensorFlow with ESP32 integration.',
      tags: ['Python', 'OpenCV', 'TensorFlow', 'AI'],
      type: 'ai'
    },
    {
      title: 'Automated Environmental Test System',
      desc: 'Automating DO-160 & MIL-STD-810 scenarios via C#/.NET for data capture and reporting.',
      tags: ['C#', '.NET', 'Automation'],
      type: 'automation'
    },
    {
      title: 'Kaan/Hürjet Fuel Probe',
      desc: 'Hardware plus embedded software development with integration and testing stages.',
      tags: ['Embedded', 'C', 'C#'],
      type: 'iot'
    },
    {
      title: 'B2B Order & Invoice Management',
      desc: 'Fully integrated B2B with Logo ERP covering orders, dispatch, invoicing and service interfaces.',
      tags: ['ASP.NET', 'MSSQL', 'Integration'],
      type: 'software'
    },
    {
      title: 'Smart City Lighting (ESP32 Mesh)',
      desc: 'Mesh topology with scalable expansion and real-time monitoring through MQTT.',
      tags: ['ESP32', 'MQTT', 'IoT'],
      type: 'iot'
    }
  ]
};
function renderProjects(filter='all'){
  const grid = $('#projectsGrid'); if(!grid) return;
  grid.innerHTML='';
  (PROJECTS[currentLang]||[]).filter(p=> filter==='all' || p.type===filter).forEach(p=>{
    const c=document.createElement('div'); c.className='card';
    c.innerHTML = `<div class="title">${p.title}</div>
                   <div class="desc">${p.desc}</div>
                   ${p.impact ? `<div class="impact">${p.impact}</div>` : ''}
                   <div class="badges">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>`;
    grid.appendChild(c);
  });
}

async function initI18n(){
  await applyI18n();
  renderSkills();
  renderExperience();
  renderProjects(getActiveProjectFilter());
  const langSelect = $('#langSelect');
  if(langSelect){
    langSelect.value = currentLang;
    langSelect.addEventListener('change', async ()=>{
      currentLang = langSelect.value;
      localStorage.setItem('lang', currentLang);
      await applyI18n();
      renderSkills();
      renderExperience();
      renderProjects(getActiveProjectFilter());
    });
  }
}

initI18n();
// SMS (optional)
if(CFG.SHOW_SMS && CFG.CONTACT?.PHONE_E164){
  const smsBtn=document.createElement('a');
  smsBtn.className='btn contact-btn sms';
  const smsText = encodeURIComponent(CFG.CONTACT?.WHATS_TEXT || '');
  smsBtn.href=`sms:${CFG.CONTACT.PHONE_E164}?body=${smsText}`;
  smsBtn.textContent = currentLang==='en' ? 'Send SMS' : 'SMS Gönder';
  $('#contactButtons')?.appendChild(smsBtn);
}

// Telegram only
async function sendTelegramMessage(text){
  const botToken = CFG.TELEGRAM?.BOT_TOKEN;
  const chatId = CFG.TELEGRAM?.CHAT_ID;
  if(!botToken || !chatId){
    console.warn('Telegram configuration missing token or chat ID');
    return { ok:false, error:'Telegram error' };
  }
  const api=`https://api.telegram.org/bot${botToken}/sendMessage`;
  try{
    const res = await fetch(api,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: chatId, text }) });
    return res.ok ? {ok:true} : {ok:false, error:'Telegram error'};
  }catch(err){
    console.warn('Telegram request failed', err);
    return {ok:false, error:'Telegram error'};
  }
}
function genPayload(prefix='req'){
  const startPrefix = CFG.TELEGRAM?.START_PAYLOAD_PREFIX || '';
  return `${startPrefix}${prefix}_${Math.random().toString(36).slice(2,10)}`;
}
function approvalLinks(payload){
  const botUser = CFG.TELEGRAM?.BOT_USERNAME || '';
  const base = botUser ? `https://t.me/${botUser}` : 'https://t.me/';
  return { open:`${base}?start=${payload}`, approve:`${base}?start=approve_${payload}`, reject:`${base}?start=reject_${payload}` };
}
$('#contactForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = genPayload('contact');
  const links = approvalLinks(payload);
  const pretty = [
    currentLang==='en' ? '🆕 New contact request' : '🆕 Yeni iletişim talebi',
    `Lang: ${currentLang}`,
    `Name: ${fd.get('name')||'-'}`,
    `Company: ${fd.get('company')||'-'}`,
    `Email: ${fd.get('email')||'-'}`,
    `Phone: ${fd.get('phone')||'-'}`,
    `Message: ${fd.get('message')||'-'}`,
    `Payload: ${payload}`,
    '—',
    `✅ Approve: ${links.approve}`,
    `❌ Reject: ${links.reject}`
  ].join('\n');

  const status = $('#formStatus'); if(status) status.textContent = (currentLang==='en'?'Sending…':'Gönderiliyor…');
  const tg = await sendTelegramMessage(pretty);
  if(status) status.textContent = tg.ok ? (currentLang==='en'?'Sent ✅':'Gönderildi ✅') : (tg.error || (currentLang==='en'?'Error':'Hata'));
  if(tg.ok) e.target.reset();
});
