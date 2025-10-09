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
(async function initI18n(){
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
      renderSkills(); renderExperience(); renderProjects(getActiveProjectFilter());
    });
  }
})();

// typewriter
(function typewriter(){
  const el = $('#typer'); if(!el) return;
  const phrases = ()=> JSON.parse(el.getAttribute('data-phrases'));
  let i=0,j=0,deleting=false,pause=800;
  function tick(){
    const cur = phrases()[i % phrases().length];
    if(!deleting){ el.textContent = cur.slice(0, ++j); if(j===cur.length){ deleting=true; return void setTimeout(tick, pause);} }
    else { el.textContent = cur.slice(0, --j); if(j===0){ deleting=false; i++; } }
    setTimeout(tick, (deleting?28:40) + Math.random()*50);
  }
  tick();
})();

// skills
const SKILLS = {
  tr: [
    { name: 'C# / .NET & WinForms', level: 96, desc: 'Kurumsal otomasyon, envanter, üretim ve raporlama uygulamaları.' },
    { name: 'ASP.NET Core & REST API', level: 90, desc: 'B2B/B2C iş akışları, entegrasyon servisleri ve JWT kimlik doğrulama.' },
    { name: 'MSSQL, T-SQL & ETL', level: 92, desc: 'Performans optimizasyonu, anlık raporlama ve veri ambarı replikasyonları.' },
    { name: 'DevExpress & Raporlama', level: 88, desc: 'Rich UI, dashboard, parametrik rapor ve esnek grid çözümleri.' },
    { name: 'Python & OpenCV', level: 82, desc: 'Hatalı ürün tespiti, kalite kontrol ve veri önişleme pipeline’ları.' },
    { name: 'TensorFlow Lite / Edge AI', level: 78, desc: 'ESP32-CAM üstünde gerçek zamanlı sınıflandırma ve anomaly scoring.' },
    { name: 'IoT — ESP32, MQTT, Modbus', level: 86, desc: 'Endüstriyel gateway, saha cihazı telemetrisi ve bulut haberleşmesi.' },
    { name: 'C/C++ Gömülü', level: 80, desc: 'RTOS, sürücü geliştirme, sensör füzyonu ve düşük seviye protokoller.' },
    { name: 'Linux, AD & Sanallaştırma', level: 84, desc: 'VM, yedekleme, güvenlik sertifikasyonları ve merkezi kimlik altyapısı.' },
    { name: 'Test & Doğrulama Otomasyonu', level: 88, desc: 'DO-160/MIL-STD-810 test hücreleri, veri toplama ve raporlama.' },
    { name: 'ERP & Entegrasyon', level: 90, desc: 'Logo, Netsis, Mikro ve 3. parti lojistik/paylaşım platformları.' },
    { name: 'DevOps & Sürümleme', level: 76, desc: 'GitLab CI, otomatik dağıtım, sürümleme ve yapılandırma yönetimi.' }
  ],
  en: [
    { name: 'C# / .NET & WinForms', level: 96, desc: 'Enterprise automation, inventory, manufacturing and reporting apps.' },
    { name: 'ASP.NET Core & REST APIs', level: 90, desc: 'B2B/B2C workflows, integration services and JWT based auth.' },
    { name: 'MSSQL, T-SQL & ETL', level: 92, desc: 'Performance tuning, real-time dashboards and warehouse replication.' },
    { name: 'DevExpress & Reporting', level: 88, desc: 'Rich UI, dashboards, parameterized reports and flexible grids.' },
    { name: 'Python & OpenCV', level: 82, desc: 'Defect detection, quality inspection and data pre-processing pipelines.' },
    { name: 'TensorFlow Lite / Edge AI', level: 78, desc: 'On-device classification and anomaly scoring on ESP32-CAM.' },
    { name: 'IoT — ESP32, MQTT, Modbus', level: 86, desc: 'Industrial gateways, field telemetry and cloud messaging.' },
    { name: 'C/C++ Embedded', level: 80, desc: 'RTOS, driver development, sensor fusion and low-level protocols.' },
    { name: 'Linux, AD & Virtualization', level: 84, desc: 'VM management, backup, security hardening and central identity.' },
    { name: 'Test & Verification Automation', level: 88, desc: 'DO-160/MIL-STD-810 rigs, data acquisition and compliance reporting.' },
    { name: 'ERP & Integrations', level: 90, desc: 'Logo, Netsis, Mikro plus 3rd-party logistics and marketplace platforms.' },
    { name: 'DevOps & Release Engineering', level: 76, desc: 'GitLab CI, automated deployments and configuration management.' }
  ]
};
function renderSkills(){
  const grid = $('#skillsGrid'); if(!grid) return;
  grid.innerHTML='';
  (SKILLS[currentLang]||[]).forEach(skill=>{
    const d=document.createElement('div'); d.className='skill';
    const level = skill.level ?? 80;
    d.innerHTML = `<h4>${skill.name}</h4><div class="meter"><i style="width:${level}%"></i></div>${skill.desc ? `<p>${skill.desc}</p>` : ''}`;
    grid.appendChild(d);
  });
}

// experience
const EXPERIENCE = [
  {
    title_tr:'Kıdemli Yazılım ve Sistem Mühendisi',
    title_en:'Senior Software & Systems Engineer',
    company:'Freelance / Danışman',
    time:'2021 — Günümüz',
    location:'Kayseri',
    summary_tr:'Endüstriyel üretim, otomasyon ve görüntü işleme projelerinde danışmanlık.',
    summary_en:'Consulting on industrial manufacturing, automation and computer vision projects.',
    bullets_tr:[
      'ERP, saha cihazları ve bulut servisleri arasında entegrasyon köprüleri.',
      'ESP32 tabanlı veri toplama, edge AI ve durum izleme çözümleri.',
      'Makine parkurlarında test otomasyonu ve raporlama altyapıları.'
    ],
    bullets_en:[
      'Integration bridges between ERP, field devices and cloud services.',
      'ESP32-based data acquisition, edge AI and condition monitoring solutions.',
      'Test automation and reporting frameworks for production lines.'
    ]
  },
  {
    title_tr:'Bilgi İşlem Uzmanı',
    title_en:'IT Specialist',
    company:'Şirikçioğlu Tekstil',
    time:'2017 — 2021',
    location:'Kahramanmaraş',
    summary_tr:'Tekstil üretim tesisleri için uçtan uca IT ve yazılım süreçlerinin yönetimi.',
    summary_en:'Managed end-to-end IT and software operations for textile manufacturing plants.',
    bullets_tr:[
      'Sunucu, network ve güvenlik mimarisinin planlanması ve bakımı.',
      'C# WinForms + MSSQL iç yazılımlar ile depo, kalite ve sevkiyat süreçleri.',
      'AD, sanallaştırma, yedekleme ve felaket kurtarma altyapıları.',
      'IP CCTV ve kalite kontrol için görüntü işleme uygulamaları.'
    ],
    bullets_en:[
      'Planned and maintained server, network and security architectures.',
      'Built WinForms + MSSQL tooling for warehouse, quality and logistics flows.',
      'Handled AD, virtualization, backup and disaster recovery platforms.',
      'Delivered IP CCTV and computer vision tooling for quality inspection.'
    ]
  },
  {
    title_tr:'Sistem Mühendisi',
    title_en:'Systems Engineer',
    company:'Ayruz Endüstri',
    time:'2014 — 2017',
    location:'Kayseri',
    summary_tr:'Havacılık ve savunma projelerinde gömülü sistem tasarım ve doğrulama.',
    summary_en:'Embedded design and verification across aerospace and defence programs.',
    bullets_tr:[
      'Helikopter vinç, yakıt probu ve test ekipmanları için donanım/yazılım entegrasyonu.',
      'DO-178C, DO-254 ve MIL-STD-810G uyumluluk testlerinin yürütülmesi.',
      'Ömür testi, çevresel test ve saha doğrulama süreçlerinin otomasyonu.'
    ],
    bullets_en:[
      'Hardware/software integration for helicopter hoist, fuel probe and test gear.',
      'Executed DO-178C, DO-254 and MIL-STD-810G compliance campaigns.',
      'Automated endurance, environmental and field verification procedures.'
    ]
  },
  {
    title_tr:'Sistem ve Ağ Mühendisi',
    title_en:'Systems & Network Engineer',
    company:'Zirve Bilişim',
    time:'2012 — 2014',
    location:'Kayseri',
    summary_tr:'Kurumsal müşteriler için ağ, güvenlik ve ERP entegrasyon projeleri.',
    summary_en:'Delivered networking, security and ERP integration projects for SMBs.',
    bullets_tr:[
      'Firewall, sanallaştırma, NAS ve yedekleme altyapılarının kurulumu.',
      'Logo/Netsis entegrasyonları, saha servis otomasyonları ve performans optimizasyonu.',
      'SLA tabanlı destek, izleme ve kullanıcı eğitimleri.'
    ],
    bullets_en:[
      'Deployed firewall, virtualization, NAS and backup infrastructures.',
      'Delivered Logo/Netsis integrations, field service automation and performance tuning.',
      'Provided SLA-driven support, monitoring and user enablement.'
    ]
  },
  {
    title_tr:'Yazılım Mühendisi',
    title_en:'Software Engineer',
    company:'Sedaş Bilgisayar',
    time:'2010 — 2012',
    location:'Kayseri',
    summary_tr:'Perakende ve enerji sektöründe ERP/otomasyon çözümleri geliştirme.',
    summary_en:'Developed ERP and automation solutions for retail and energy operations.',
    bullets_tr:[
      'Netsis/Logo B2B2C-ERP entegrasyonları ve satış kanalı otomasyonları.',
      'TURPAK akaryakıt istasyon yönetimi ve IoT sayaç takibi.',
      'Bulut yedekleme, raporlama ve saha ekipleri için mobil uygulamalar.'
    ],
    bullets_en:[
      'Built Netsis/Logo B2B2C-ERP integrations and sales channel automation.',
      'Delivered TURPAK fuel station management with IoT meter tracking.',
      'Implemented cloud backup, reporting and mobile tooling for field teams.'
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
    const summary = currentLang==='en' ? j.summary_en : j.summary_tr;
    const meta = [j.time, CFG.SHOW_LOCATION ? j.location : ''].filter(Boolean).join(' • ');
    el.innerHTML = `<h4>${title} — ${j.company}</h4>${meta?`<div class="meta">${meta}</div>`:''}${summary?`<p class="summary">${summary}</p>`:''}
      <ul>${bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
    list.appendChild(el);
  });
}

// projects
const PROJECTS = {
  tr: [
    {
      title:'ESP32-CAM Darbe Algılama Sistemi',
      desc:'Titreşim/darbe sensörü tetiklemeli görüntü yakalama, zaman damgası ve Telegram bildirim zinciri.',
      impact:'%40 daha hızlı kalite kontrol reaksiyonu ve saha servislerine otomatik rapor.',
      tags:['ESP32','IoT','Görüntü'],
      type:'iot'
    },
    {
      title:'Vision/AI Hatları',
      desc:'OpenCV + TensorFlow Lite pipeline ile üretim bandında hatalı ürün tespiti, edge inference ile gecikme minimizasyonu.',
      impact:'Dakikada 120 ürün izleme, manuel kontrol yükünde %65 azalma.',
      tags:['Python','AI','TensorFlow'],
      type:'ai'
    },
    {
      title:'Çevresel Test Otomasyonu',
      desc:'DO-160G / MIL-STD-810 seanslarında veri toplama, otomatik raporlama ve arıza bildirimleri için .NET tabanlı platform.',
      impact:'Test sürelerinde %30 kısalma, rapor hazırlama süresi dakikalara indi.',
      tags:['C#','.NET','Test'],
      type:'automation'
    },
    {
      title:'ERP & Lojistik Entegrasyonu',
      desc:'Logo ve Netsis ERP ile 3. parti lojistik, e-fatura/e-arşiv servisleri arasında iki yönlü senkronizasyon.',
      impact:'Günlük 15K+ sipariş için hatasız veri akışı ve gerçek zamanlı stok görünürlüğü.',
      tags:['ERP','Integration','REST'],
      type:'software'
    }
  ],
  en: [
    {
      title:'ESP32-CAM Shock Detection',
      desc:'Vibration/impact sensor triggered imaging with timestamp overlays and Telegram alert pipeline.',
      impact:'Enabled 40% faster quality responses plus automated service tickets.',
      tags:['ESP32','IoT','Vision'],
      type:'iot'
    },
    {
      title:'Vision/AI Production Lines',
      desc:'OpenCV + TensorFlow Lite pipeline for on-line defect detection with low-latency edge inference.',
      impact:'Monitors 120 parts per minute and removes 65% of manual inspection overhead.',
      tags:['Python','AI','TensorFlow'],
      type:'ai'
    },
    {
      title:'Environmental Test Automation',
      desc:'.NET platform capturing DO-160G / MIL-STD-810 sessions with automated reports and incident alerts.',
      impact:'Cut test runtime by 30% and reduced reporting to minutes.',
      tags:['C#','.NET','Testing'],
      type:'automation'
    },
    {
      title:'ERP & Logistics Integration',
      desc:'Bi-directional sync between Logo/Netsis ERP and 3rd-party logistics plus e-invoicing providers.',
      impact:'Delivers error-free flow for 15K+ daily orders with real-time stock visibility.',
      tags:['ERP','Integration','REST'],
      type:'software'
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
$$('.chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    $$('.chip').forEach(c=>c.classList.remove('is-active'));
    chip.classList.add('is-active');
    renderProjects(chip.dataset.filter);
  });
});

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
