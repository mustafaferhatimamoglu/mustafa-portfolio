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
  tr: ['C# / .NET','MSSQL','DevExpress','Entity Framework','ASP.NET','JavaScript','Python / OpenCV','IoT / ESP32 / C/C++','Görüntü İşleme / AI','ERP / B2B2C Entegrasyon','Linux & AD & Sanallaştırma','Test & Doğrulama Otomasyonu'],
  en: ['C# / .NET','MSSQL','DevExpress','Entity Framework','ASP.NET','JavaScript','Python / OpenCV','IoT / ESP32 / C/C++','Computer Vision / AI','ERP / B2B2C Integration','Linux & AD & Virtualization','Test Automation & Validation']
};
const SKILL_LEVELS = [95,90,85,85,80,75,70,85,75,85,70,80];
function renderSkills(){
  const grid = $('#skillsGrid'); if(!grid) return;
  grid.innerHTML='';
  (SKILLS[currentLang]||[]).forEach((name,idx)=>{
    const d=document.createElement('div'); d.className='skill';
    d.innerHTML = `<h4>${name}</h4><div class="meter"><i style="width:${SKILL_LEVELS[idx]}%"></i></div>`;
    grid.appendChild(d);
  });
}

// experience
const EXPERIENCE = [
  {title_tr:'Bilgi İşlem Uzmanı', title_en:'IT Specialist', company:'Şirikçioğlu Tekstil', time:'', location:'Kayseri',
   bullets_tr:['Sunucu, network, güvenlik (firewall)','C# WinForms + MSSQL iç yazılımlar','AD, sanallaştırma, yedekleme','IP CCTV + kalite görüntü işleme'],
   bullets_en:['Servers, networking, firewall','C# WinForms + MSSQL internal tools','AD, virtualization, backups','IP CCTV + quality vision']},
  {title_tr:'Sistem Mühendisi', title_en:'Systems Engineer', company:'Ayruz Endüstri', time:'', location:'Kayseri',
   bullets_tr:['Tasarım/entegrasyon/doğrulama','DO-178/DO-254; MIL-STD-810G/DO-160','Helikopter vinç, yakıt probu, test ekipmanları'],
   bullets_en:['Design/integration/verification','DO-178/DO-254; MIL-STD-810G/DO-160','Helicopter hoist, fuel probe, test rigs']},
  {title_tr:'Sistem Mühendisi', title_en:'Systems Engineer', company:'Zirve Bilişim', time:'', location:'Kayseri',
   bullets_tr:['Firewall, sanallaştırma, NAS','Logo entegrasyonlar, ağ optimizasyonu','Kamera/güvenlik, destek süreçleri'],
   bullets_en:['Firewall, virtualization, NAS','ERP integrations, network optimization','CCTV/security, user support']},
  {title_tr:'Yazılım Mühendisi', title_en:'Software Engineer', company:'Sedaş Bilgisayar', time:'', location:'',
   bullets_tr:['Netsis/Logo B2B2C-ERP','TURPAK istasyon yönetimi','Bulut yedekleme, raporlama'],
   bullets_en:['Netsis/Logo B2B2C-ERP','TURPAK station mgmt','Cloud backup, reporting']}
];
function renderExperience(){
  const list = $('#experienceList'); if(!list) return;
  list.innerHTML='';
  EXPERIENCE.forEach(j=>{
    const el=document.createElement('div'); el.className='job';
    const title = currentLang==='en' ? j.title_en : j.title_tr;
    const bullets = currentLang==='en' ? j.bullets_en : j.bullets_tr;
    const meta = [j.time, CFG.SHOW_LOCATION ? j.location : ''].filter(Boolean).join(' • ');
    el.innerHTML = `<h4>${title} — ${j.company}</h4>${meta?`<div class="meta">${meta}</div>`:''}
      <ul>${bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
    list.appendChild(el);
  });
}

// projects
const PROJECTS = {
  tr: [
    {title:'ESP32-CAM Darbe Algılama', desc:'G-sensör tetikli fotoğraf, alt yazı, Telegram gönderimi.', tags:['ESP32','IoT','Görüntü'] , type:'iot'},
    {title:'Vision/AI Hatları', desc:'OpenCV/TensorFlow + ESP32 entegrasyonu.', tags:['Python','AI'], type:'ai'},
    {title:'Çevresel Test Otomasyonu', desc:'DO-160 / MIL-STD-810 veri toplama & rapor.', tags:['C#','.NET'], type:'automation'}
  ],
  en: [
    {title:'ESP32-CAM Shock Detection', desc:'G-sensor triggered snapshot, overlay, Telegram delivery.', tags:['ESP32','IoT','Vision'] , type:'iot'},
    {title:'Vision/AI Pipelines', desc:'OpenCV/TensorFlow + ESP32 integration.', tags:['Python','AI'], type:'ai'},
    {title:'Environmental Test Automation', desc:'DO-160 / MIL-STD-810 data capture & reporting.', tags:['C#','.NET'], type:'automation'}
  ]
};
function renderProjects(filter='all'){
  const grid = $('#projectsGrid'); if(!grid) return;
  grid.innerHTML='';
  (PROJECTS[currentLang]||[]).filter(p=> filter==='all' || p.type===filter).forEach(p=>{
    const c=document.createElement('div'); c.className='card';
    c.innerHTML = `<div class="title">${p.title}</div>
                   <div class="desc">${p.desc}</div>
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
