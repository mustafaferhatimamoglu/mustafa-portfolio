// Helpers
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const CFG = Object.assign({
  LANG_DEFAULT:'tr',
  TELEGRAM:{ ENABLED:true, BOT_USERNAME:'' },
  CONTACT:{ PHONE_E164:'', PHONE_HUMAN:'', WHATS_TEXT:'' }
}, window.APP_CONFIG||{});

// i18n sözlüğü (TR & EN) — Teknik İngilizce karşılıklar eklendi
const LANGS = {
  tr: {
    nav:{about:'Hakkımda',skills:'Yetenekler',experience:'Deneyim',projects:'Projeler',contact:'İletişim'},
    hero:{hello:'Merhaba,',iAm:'ben',badge:'Yazılım • Makine • Elektronik',cvAi:'Görüntü işleme & AI',erp:'ERP/B2B2C Entegrasyon',
          viewProjects:'Projelerimi Gör',contactMe:'İletişime Geç',years:'🧑‍💻 8+ yıl deneyim'},
    sections:{about:'Hakkımda',skills:'Yetenekler',experience:'Deneyim',projects:'Projeler',contact:'İletişim'},
    about:{
      text:'Yazılım, makine ve elektronik disiplinlerini birleştiren uçtan uca çözümler geliştiriyorum.',
      focus:'Odak Alanlarım',
      tags:['Kurumsal Uygulamalar','IoT & ESP32','Görüntü İşleme / AI','ERP/CRM Entegrasyon','Doğrulama & Test'],
      edu:'Eğitim',
      edu1:'Erciyes Üniversitesi — Bilgisayar Mühendisliği (Lisans)',
      edu2:'Erciyes Üniversitesi — Makine Mühendisliği (Lisans)'
    },
    filters:{all:'Tümü',software:'Yazılım',iot:'IoT / Gömülü',ai:'Görüntü İşleme / AI',automation:'Otomasyon/Test'},
    contact:{whats:'WhatsApp Görüşme Başlat',call:'Ara: {phone}',tg:'Telegram: @{user}'},
    form:{title:'İletişim Formu',name:'Ad Soyad',company:'Firma',email:'E-posta',phone:'Telefon',msg:'Mesaj',
          alsoTg:'Mesajı Telegram’dan da gönder',send:'Gönder',noteTg:'Gönderimden sonra Telegram’da onay bağlantısı gelecektir.'},
    auth:{login:'Giriş Yap',title:'Müşteri Portalı',desc:'Telegram üzerinden giriş ve onay akışı.',
          signup:'Yeni Müşteri Ol',cancel:'Kapat'},
    signup:{title:'Yeni Müşteri — Bilgi Formu',fullname:'Ad Soyad',company:'Firma',email:'E-posta',
            phone:'Telefon',taxoffice:'Vergi Dairesi',taxno:'Vergi No / TCKN',address:'Fatura Adresi',
            send:'Gönder',note:'Gönderimden sonra Telegram üzerinden iki aşamalı onay alınır.'},
    ui:{sending:'Gönderiliyor…',sent:'Gönderildi ✅',error:'Hata'}
  },
  en: {
    nav:{about:'About',skills:'Skills',experience:'Experience',projects:'Projects',contact:'Contact'},
    hero:{hello:'Hello,',iAm:'I am',badge:'Software • Mechanical • Electronics',cvAi:'Computer Vision & AI',erp:'ERP/B2B2C Integrations',
          viewProjects:'View Projects',contactMe:'Contact Me',years:'🧑‍💻 8+ years experience'},
    sections:{about:'About',skills:'Skills',experience:'Experience',projects:'Projects',contact:'Contact'},
    about:{
      text:'I build end-to-end solutions that fuse software with mechanical and electronics disciplines.',
      focus:'Focus Areas',
      // TR sabitlerinin teknik İngilizcesi
      tags:['Corporate Applications','IoT & Embedded Systems','Computer Vision / AI','ERP/CRM Integration','Integration & Validation'],
      edu:'Education',
      edu1:'Erciyes University — Computer Engineering (BSc)',
      edu2:'Erciyes University — Mechanical Engineering (BSc)'
    },
    filters:{all:'All',software:'Software',iot:'IoT / Embedded',ai:'Computer Vision / AI',automation:'Automation/Testing'},
    contact:{whats:'Start WhatsApp Chat',call:'Call: {phone}',tg:'Telegram: @{user}'},
    form:{title:'Contact Form',name:'Full Name',company:'Company',email:'Email',phone:'Phone',msg:'Message',
          alsoTg:'Also send via Telegram',send:'Send',noteTg:'After submission, you will receive an approval link on Telegram.'},
    auth:{login:'Log In',title:'Client Portal',desc:'Sign-in and approvals are handled via Telegram.',
          signup:'Become a Client',cancel:'Close'},
    signup:{title:'New Client — Information',fullname:'Full Name',company:'Company',email:'Email',
            phone:'Phone',taxoffice:'Tax Office',taxno:'Tax No / National ID',address:'Billing Address',
            send:'Send',note:'A two-step approval is required via Telegram after submission.'},
    ui:{sending:'Sending…',sent:'Sent ✅',error:'Error'}
  }
};
let currentLang = localStorage.getItem('lang') || CFG.LANG_DEFAULT || 'tr';

// Tema
const root = document.documentElement;
const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if(savedTheme === 'light') root.classList.add('light');
themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
themeToggle.addEventListener('click', ()=>{
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
});
$('#year').textContent = new Date().getFullYear();

// Menü
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
menuToggle?.addEventListener('click', ()=>{
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// i18n helpers
function t(path, vars={}){
  const parts = path.split('.');
  let val = LANGS[currentLang];
  for(const p of parts){ val = val?.[p]; }
  if(typeof val !== 'string') return '';
  return val.replace(/\{(\w+)\}/g, (_,k)=> vars[k] ?? '');
}
function applyI18n(){
  $$('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(key==='contact.call'){
      el.textContent = t(key, {phone: CFG.CONTACT.PHONE_HUMAN});
    } else if(key==='contact.tg'){
      el.textContent = t(key, {user: CFG.TELEGRAM.BOT_USERNAME});
    } else {
      el.textContent = t(key);
    }
  });

  // Focus tags (tamamen sözlükten dolduruluyor)
  const tags = LANGS[currentLang].about.tags;
  const ul = $('#focusTags'); ul.innerHTML = '';
  tags.forEach(txt=>{
    const li = document.createElement('li'); li.textContent = txt; ul.appendChild(li);
  });

  // Typewriter phrases
  const typer = $('#typer');
  const attr = currentLang === 'en' ? 'data-phrases-en' : 'data-phrases-tr';
  typer.setAttribute('data-phrases', typer.getAttribute(attr));

  // Contact links
  $('#btnWhats').setAttribute('href', `https://wa.me/${CFG.CONTACT.PHONE_E164.replace('+','')}?text=${encodeURIComponent(CFG.CONTACT.WHATS_TEXT)}`);
  $('#btnCall').setAttribute('href', `tel:${CFG.CONTACT.PHONE_E164}`);
  $('#btnTg').setAttribute('href', `https://t.me/${CFG.TELEGRAM.BOT_USERNAME}`);

  // Login deep link
  $('#btnTgLogin').setAttribute('href', `https://t.me/${CFG.TELEGRAM.BOT_USERNAME}?start=login`);

  // Location chip
  if(CFG.SHOW_LOCATION){ $('#heroMeta')?.removeAttribute('hidden'); } else { $('#heroMeta')?.setAttribute('hidden',''); }
}
const langSelect = $('#langSelect');
langSelect.value = currentLang;
applyI18n();
langSelect.addEventListener('change', ()=>{
  currentLang = langSelect.value;
  localStorage.setItem('lang', currentLang);
  applyI18n();
});

// Typewriter (başında boşluk + hızlı)
(function typewriter(){
  const el = $('#typer');
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

// Skills (etiketleri dil bazlı)
const SKILLS = {
  tr: ['C# / .NET','MSSQL','DevExpress','Entity Framework','ASP.NET','JavaScript','Python / OpenCV','IoT / ESP32 / C/C++','Görüntü İşleme / AI','ERP / B2B2C Entegrasyon','Linux & AD & Sanallaştırma','Test & Doğrulama Otomasyonu'],
  en: ['C# / .NET','MSSQL','DevExpress','Entity Framework','ASP.NET','JavaScript','Python / OpenCV','IoT / ESP32 / C/C++','Computer Vision / AI','ERP / B2B2C Integration','Linux & AD & Virtualization','Test Automation & Validation']
};
const SKILL_LEVELS = [95,90,85,85,80,75,70,85,75,85,70,80];
const skillsGrid = $('#skillsGrid');
function renderSkills(){
  skillsGrid.innerHTML='';
  SKILLS[currentLang].forEach((name,idx)=>{
    const d=document.createElement('div'); d.className='skill';
    d.innerHTML = `<h4>${name}</h4><div class="meter"><i style="width:${SKILL_LEVELS[idx]}%"></i></div>`;
    skillsGrid.appendChild(d);
  });
}
renderSkills();

// Experience (yıl yok; metinler nötr bırakıldı)
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
const experienceList = $('#experienceList');
function renderExperience(){
  experienceList.innerHTML='';
  EXPERIENCE.forEach(j=>{
    const el=document.createElement('div'); el.className='job';
    const title = currentLang==='en' ? j.title_en : j.title_tr;
    const bullets = currentLang==='en' ? j.bullets_en : j.bullets_tr;
    const meta = [j.time, CFG.SHOW_LOCATION ? j.location : ''].filter(Boolean).join(' • ');
    el.innerHTML = `<h4>${title} — ${j.company}</h4>${meta?`<div class="meta">${meta}</div>`:''}
      <ul>${bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
    experienceList.appendChild(el);
  });
}
renderExperience();

// Projects (TR/EN metinleri)
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
const projectsGrid = $('#projectsGrid');
function renderProjects(filter='all'){
  projectsGrid.innerHTML='';
  PROJECTS[currentLang]
    .filter(p=> filter==='all' || p.type===filter)
    .forEach(p=>{
      const c=document.createElement('div'); c.className='card';
      c.innerHTML = `<div class="title">${p.title}</div>
                     <div class="desc">${p.desc}</div>
                     <div class="badges">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>`;
      projectsGrid.appendChild(c);
    });
}
renderProjects();
$$('.chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    $$('.chip').forEach(c=>c.classList.remove('is-active'));
    chip.classList.add('is-active');
    renderProjects(chip.dataset.filter);
  });
});

// SMS (parametreli)
if(CFG.SHOW_SMS){
  const smsBtn=document.createElement('a');
  smsBtn.className='btn contact-btn sms';
  smsBtn.href=`sms:${CFG.CONTACT.PHONE_E164}?body=${encodeURIComponent(CFG.CONTACT.WHATS_TEXT)}`;
  smsBtn.textContent = currentLang==='en' ? 'Send SMS' : 'SMS Gönder';
  $('#contactButtons').appendChild(smsBtn);
}

// Telegram gönderimi + onay payload
async function sendTelegramMessage(text){
  const api=`https://api.telegram.org/bot${CFG.TELEGRAM.BOT_TOKEN}/sendMessage`;
  const res = await fetch(api, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: CFG.TELEGRAM.CHAT_ID, text })
  });
  return res.ok ? {ok:true} : {ok:false, error:'Telegram error'};
}
function genPayload(prefix='req'){ return `${CFG.TELEGRAM.START_PAYLOAD_PREFIX}${prefix}_${Math.random().toString(36).slice(2,10)}`; }
function approvalLinks(payload){
  const base=`https://t.me/${CFG.TELEGRAM.BOT_USERNAME}`;
  return { open:`${base}?start=${payload}`, approve:`${base}?start=approve_${payload}`, reject:`${base}?start=reject_${payload}` };
}

// Contact form → Telegram only
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

  $('#formStatus').textContent = t('ui.sending');
  const tg = await sendTelegramMessage(pretty);
  $('#formStatus').textContent = tg.ok ? t('ui.sent') : (tg.error || t('ui.error'));
  if(tg.ok) e.target.reset();
});

// Auth modal / Yeni müşteri
const authModal = $('#authModal');
$('#loginBtn')?.addEventListener('click', ()=> authModal.showModal());
authModal?.addEventListener('close', ()=> { $('#signupForm').hidden = true; $('#signupStatus').textContent = ''; });
$$('.modal .actions button, .modal .actions a').forEach(btn=>{
  btn.addEventListener('click',(ev)=>{
    if(ev.target.value==='signup'){ $('#signupForm').hidden = false; }
  });
});
$('#submitSignup')?.addEventListener('click', async ()=>{
  const fd = new FormData($('#signupForm'));
  const payload = genPayload('signup');
  const links = approvalLinks(payload);
  const pretty = [
    currentLang==='en' ? '🧾 New client application' : '🧾 Yeni müşteri başvurusu',
    `Lang: ${currentLang}`,
    `Full Name: ${fd.get('s_fullname')||'-'}`,
    `Company: ${fd.get('s_company')||'-'}`,
    `Email: ${fd.get('s_email')||'-'}`,
    `Phone: ${fd.get('s_phone')||'-'}`,
    `Tax Office: ${fd.get('s_tax_office')||'-'}`,
    `Tax/ID: ${fd.get('s_tax_no')||'-'}`,
    `Billing Address: ${fd.get('s_address')||'-'}`,
    `Payload: ${payload}`,
    '—',
    `✅ Approve: ${links.approve}`,
    `❌ Reject: ${links.reject}`
  ].join('\n');

  $('#signupStatus').textContent = t('ui.sending');
  const tg = await sendTelegramMessage(pretty);
  $('#signupStatus').textContent = tg.ok ? t('ui.sent') : (tg.error || t('ui.error'));
  if(tg.ok) setTimeout(()=>authModal.close(), 900);
});
