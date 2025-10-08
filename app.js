// ====== Kısa yardımcılar ======
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const CFG = window.APP_CONFIG;

// ====== i18n sözlüğü ======
const LANGS = {
  tr: {
    nav:{about:'Hakkımda',skills:'Yetenekler',experience:'Deneyim',projects:'Projeler',contact:'İletişim'},
    hero:{hello:'Merhaba,',iAm:'ben',badge:'Yazılım • Makine • Elektronik',cvAi:'Görüntü işleme & AI',
          viewProjects:'Projelerimi Gör',contactMe:'İletişime Geç',years:'🧑‍💻 8+ yıl deneyim'},
    sections:{about:'Hakkımda',skills:'Yetenekler',experience:'Deneyim',projects:'Projeler',contact:'İletişim'},
    about:{text:'Yazılım geliştirme tarafında, makine ve elektronik disiplinlerini birleştiren çözümler üretiyorum.',
           focus:'Odak Alanlarım',edu:'Eğitim'},
    filters:{all:'Tümü',software:'Yazılım',iot:'IoT / Gömülü',ai:'Görüntü İşleme / AI',automation:'Otomasyon/Test'},
    contact:{whats:'WhatsApp Görüşme Başlat',call:'Ara: {phone}',tg:'Telegram: @{user}'},
    form:{title:'İletişim Formu',name:'Ad Soyad',company:'Firma',email:'E-posta',phone:'Telefon',msg:'Mesaj',
          alsoTg:'Mesajı Telegram’dan da gönder',send:'Gönder',
          noteTg:'Gönderimden sonra Telegram’da onay bağlantısı gelecektir.'},
    auth:{login:'Giriş Yap',title:'Müşteri Portalı',desc:'Telegram üzerinden giriş veya onay akışı.',
          signup:'Yeni Müşteri Ol',cancel:'Kapat'},
    signup:{title:'Yeni Müşteri — Bilgi Formu',fullname:'Ad Soyad',company:'Firma',email:'E-posta',
            phone:'Telefon',taxoffice:'Vergi Dairesi',taxno:'Vergi No / TCKN',address:'Fatura Adresi',send:'Gönder',
            note:'Gönderimden sonra Telegram üzerinden 2 aşamalı onay alınır.'},
    ui:{sending:'Gönderiliyor…',sent:'Gönderildi ✅',error:'Hata'}
  },
  en: {
    nav:{about:'About',skills:'Skills',experience:'Experience',projects:'Projects',contact:'Contact'},
    hero:{hello:'Hello,',iAm:'I am',badge:'Software • Mechanical • Electronics',cvAi:'Computer Vision & AI',
          viewProjects:'View Projects',contactMe:'Contact Me',years:'🧑‍💻 8+ years experience'},
    sections:{about:'About',skills:'Skills',experience:'Experience',projects:'Projects',contact:'Contact'},
    about:{text:'I build solutions that fuse software with mechanical & electronics disciplines.',
           focus:'Focus Areas',edu:'Education'},
    filters:{all:'All',software:'Software',iot:'IoT / Embedded',ai:'Computer Vision / AI',automation:'Automation/Testing'},
    contact:{whats:'Start WhatsApp Chat',call:'Call: {phone}',tg:'Telegram: @{user}'},
    form:{title:'Contact Form',name:'Full Name',company:'Company',email:'Email',phone:'Phone',msg:'Message',
          alsoTg:'Also send via Telegram',send:'Send',
          noteTg:'After submission, you will receive an approval link on Telegram.'},
    auth:{login:'Log In',title:'Client Portal',desc:'Sign-in/approvals are handled via Telegram.',
          signup:'Become a Client',cancel:'Close'},
    signup:{title:'New Client — Info Form',fullname:'Full Name',company:'Company',email:'Email',
            phone:'Phone',taxoffice:'Tax Office',taxno:'Tax No / National ID',address:'Billing Address',send:'Send',
            note:'After submission, a two-step approval is required on Telegram.'},
    ui:{sending:'Sending…',sent:'Sent ✅',error:'Error'}
  }
};
let currentLang = localStorage.getItem('lang') || CFG.LANG_DEFAULT || 'tr';

// ====== Tema ======
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

// ====== Menü ======
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
menuToggle?.addEventListener('click', ()=>{
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// ====== i18n uygula ======
const langSelect = $('#langSelect');
function t(path, vars={}){
  const parts = path.split('.');
  let val = LANGS[currentLang];
  for(const p of parts) val = val?.[p];
  if(typeof val !== 'string') return '';
  return val.replace(/\{(\w+)\}/g, (_,k)=> vars[k] ?? '');
}
function applyI18n(){
  $$('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    // özel değişken ihtiyacı
    if(key === 'contact.call'){
      el.textContent = t(key, {phone: CFG.CONTACT.PHONE_HUMAN});
    } else if(key === 'contact.tg'){
      el.textContent = t(key, {user: CFG.TELEGRAM.BOT_USERNAME});
    } else {
      el.textContent = t(key);
    }
  });
  // Typer cümleleri
  const typer = $('#typer');
  const attr = currentLang === 'en' ? 'data-phrases-en' : 'data-phrases-tr';
  typer.setAttribute('data-phrases', typer.getAttribute(attr));
  // Contact buton linkleri
  $('#btnWhats').setAttribute('href', `https://wa.me/${CFG.CONTACT.PHONE_E164.replace('+','')}` +
    `?text=${encodeURIComponent(CFG.CONTACT.WHATS_TEXT)}`);
  $('#btnCall').setAttribute('href', `tel:${CFG.CONTACT.PHONE_E164}`);
  $('#btnTg').setAttribute('href', `https://t.me/${CFG.TELEGRAM.BOT_USERNAME}`);
  // Login (Telegram deep-link)
  $('#btnTgLogin').setAttribute('href', `https://t.me/${CFG.TELEGRAM.BOT_USERNAME}?start=login`);
  // Lokasyon chip
  if(CFG.SHOW_LOCATION){ $('#heroMeta')?.removeAttribute('hidden'); } else { $('#heroMeta')?.setAttribute('hidden',''); }
}
langSelect.value = currentLang;
applyI18n();
langSelect.addEventListener('change', ()=>{
  currentLang = langSelect.value;
  localStorage.setItem('lang', currentLang);
  applyI18n();
});

// ====== Typewriter ======
(function typewriter(){
  const el = $('#typer');
  const phrases = ()=> JSON.parse(el.getAttribute('data-phrases'));
  let i=0,j=0,deleting=false,pause=800;
  function tick(){
    const cur = phrases()[i % phrases().length];
    if(!deleting){
      el.textContent = cur.slice(0, ++j);
      if(j===cur.length){ deleting=true; return void setTimeout(tick, pause); }
    }else{
      el.textContent = cur.slice(0, --j);
      if(j===0){ deleting=false; i++; }
    }
    const base = deleting ? 28 : 40;
    setTimeout(tick, base + Math.random()*50);
  }
  tick();
})();

// ====== Yetenekler / Deneyim ======
const skills = [
  {name:'C# / .NET', level:95},{name:'MSSQL', level:90},{name:'DevExpress', level:85},
  {name:'Entity Framework', level:85},{name:'ASP.NET', level:80},{name:'JavaScript', level:75},
  {name:'Python / OpenCV', level:70},{name:'IoT / ESP32 / C/C++', level:85},
  {name:'Görüntü İşleme / AI', level:75},{name:'ERP / B2B2C Entegrasyon', level:85},
  {name:'Linux & AD & Sanallaştırma', level:70},{name:'Test & Doğrulama Otomasyonu', level:80},
];
const skillsGrid = $('#skillsGrid');
skills.forEach(s=>{
  const d=document.createElement('div'); d.className='skill';
  d.innerHTML = `<h4>${s.name}</h4><div class="meter"><i style="width:${s.level}%"></i></div>`;
  skillsGrid.appendChild(d);
});
const experience = [
  {title:'Bilgi İşlem Uzmanı', company:'Şirikçioğlu Tekstil', time:'', location:'Kayseri',
   bullets:['Sunucu, network, güvenlik (firewall)','C# WinForms + MSSQL iç yazılımlar','AD, sanallaştırma, yedekleme','IP CCTV + kalite görüntü işleme']},
  {title:'Sistem Mühendisi', company:'Ayruz Endüstri', time:'', location:'Kayseri',
   bullets:['Tasarım/entegrasyon/doğrulama','DO-178/DO-254; MIL-STD-810G/DO-160','Helikopter vinç, yakıt probu, test ekipmanları']},
  {title:'Sistem Mühendisi', company:'Zirve Bilişim', time:'', location:'Kayseri',
   bullets:['Firewall, sanallaştırma, NAS','Logo entegrasyonlar, ağ optimizasyonu','Kamera/güvenlik, destek süreçleri']},
  {title:'Yazılım Mühendisi', company:'Sedaş Bilgisayar', time:'', location:'',
   bullets:['Netsis/Logo B2B2C-ERP','TURPAK istasyon yönetimi','Bulut yedekleme, raporlama']},
];
const experienceList = $('#experienceList');
experience.forEach(j=>{
  const el=document.createElement('div'); el.className='job';
  const meta = [j.time, CFG.SHOW_LOCATION ? j.location : ''].filter(Boolean).join(' • ');
  el.innerHTML = `<h4>${j.title} — ${j.company}</h4>${meta?`<div class="meta">${meta}</div>`:''}
    <ul>${j.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
  experienceList.appendChild(el);
});

// ====== Projeler ======
const projects = [
  {title:'ESP32-CAM Shock Detector', desc:'G-sensör tetikli fotoğraf, alt yazı, Telegram gönderimi.', tags:['ESP32','IoT','Vision'], type:'iot'},
  {title:'Vision/AI Pipelines', desc:'OpenCV/TensorFlow + ESP32 entegrasyonu', tags:['Python','AI'], type:'ai'},
  {title:'Env. Test Automation', desc:'DO-160 / MIL-STD-810 veri toplama & rapor', tags:['C#','.NET'], type:'automation'},
];
const projectsGrid = $('#projectsGrid');
function renderProjects(filter='all'){
  projectsGrid.innerHTML='';
  projects.filter(p=> filter==='all' || p.type===filter)
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

// ====== SMS (parametreli) ======
if(CFG.SHOW_SMS){
  const smsBtn=document.createElement('a');
  smsBtn.className='btn contact-btn sms';
  smsBtn.href=`sms:${CFG.CONTACT.PHONE_E164}?body=${encodeURIComponent(CFG.CONTACT.WHATS_TEXT)}`;
  smsBtn.textContent = currentLang==='en' ? 'Send SMS' : 'SMS Gönder';
  $('#contactButtons').appendChild(smsBtn);
}

// ====== Telegram Gönderimi ======
async function sendTelegramMessage(text){
  if(!CFG?.TELEGRAM?.ENABLED) return {ok:false, error:'Telegram disabled'};
  const api=`https://api.telegram.org/bot${CFG.TELEGRAM.BOT_TOKEN}/sendMessage`;
  const res = await fetch(api,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: CFG.TELEGRAM.CHAT_ID, text })
  });
  return res.ok ? {ok:true} : {ok:false, error:'Telegram error'};
}
function genPayload(prefix='req'){
  return `${CFG.TELEGRAM.START_PAYLOAD_PREFIX}${prefix}_${Math.random().toString(36).slice(2,10)}`;
}
function approvalLinks(payload){
  // Kullanıcıyı Telegram’a yönlendir; bot, payload ile isteği ilişkilendirir.
  const base=`https://t.me/${CFG.TELEGRAM.BOT_USERNAME}`;
  return {
    open:`${base}?start=${payload}`,
    approve:`${base}?start=approve_${payload}`,
    reject:`${base}?start=reject_${payload}`
  };
}

// ====== İletişim Formu => Telegram only ======
$('#contactForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = genPayload('contact');
  const links = approvalLinks(payload);
  const pretty = [
    `🆕 Yeni iletişim talebi`,
    `Lang: ${currentLang}`,
    `Ad: ${fd.get('name')||'-'}`,
    `Firma: ${fd.get('company')||'-'}`,
    `E-posta: ${fd.get('email')||'-'}`,
    `Telefon: ${fd.get('phone')||'-'}`,
    `Mesaj: ${fd.get('message')||'-'}`,
    `Payload: ${payload}`,
    `—`,
    `✅ Onay: ${links.approve}`,
    `❌ Reddet: ${links.reject}`
  ].join('\n');

  $('#formStatus').textContent = t('ui.sending');
  const tg = await sendTelegramMessage(pretty);
  if(tg.ok){
    $('#formStatus').textContent = t('ui.sent');
    e.target.reset();
    // Kullanıcıyı Telegram’a yönlendirme linki (opsiyonel)
    // window.open(links.open, '_blank');
  } else {
    $('#formStatus').textContent = tg.error || t('ui.error');
  }
});

// ====== Auth Modal / Yeni Müşteri ======
const authModal = $('#authModal');
$('#loginBtn')?.addEventListener('click', ()=> authModal.showModal());
authModal?.addEventListener('close', ()=>{
  $('#signupForm').hidden = true;
  $('#signupStatus').textContent = '';
});
$$('.modal .actions button, .modal .actions a').forEach(btn=>{
  btn.addEventListener('click',(ev)=>{
    if(ev.target.value==='signup'){ $('#signupForm').hidden = false; }
  });
});
$('#submitSignup')?.addEventListener('click', async ()=>{
  const form = $('#signupForm');
  const fd = new FormData(form);
  const payload = genPayload('signup');
  const links = approvalLinks(payload);
  const pretty = [
    `🧾 Yeni müşteri başvurusu`,
    `Lang: ${currentLang}`,
    `Ad Soyad: ${fd.get('s_fullname')||'-'}`,
    `Firma: ${fd.get('s_company')||'-'}`,
    `E-posta: ${fd.get('s_email')||'-'}`,
    `Telefon: ${fd.get('s_phone')||'-'}`,
    `Vergi Dairesi: ${fd.get('s_tax_office')||'-'}`,
    `Vergi No/TCKN: ${fd.get('s_tax_no')||'-'}`,
    `Fatura Adresi: ${fd.get('s_address')||'-'}`,
    `Payload: ${payload}`,
    `—`,
    `✅ Onay: ${links.approve}`,
    `❌ Reddet: ${links.reject}`
  ].join('\n');

  $('#signupStatus').textContent = t('ui.sending');
  const tg = await sendTelegramMessage(pretty);
  if(tg.ok){
    $('#signupStatus').textContent = t('ui.sent');
    setTimeout(()=>authModal.close(), 900);
  } else {
    $('#signupStatus').textContent = tg.error || t('ui.error');
  }
});
