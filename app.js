// ===== Yardımcılar =====
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const CFG = window.APP_CONFIG || {};
const LANGS = {
  tr: {
    nav: {about:'Hakkımda',skills:'Yetenekler',experience:'Deneyim',projects:'Projeler',contact:'İletişim'},
    hero: {hello:'Merhaba,', iAm:'ben', badge:'Yazılım • Makine • Elektronik', cvAi:'Görüntü işleme & AI',
           viewProjects:'Projelerimi Gör', contactMe:'İletişime Geç'},
    sections: {about:'Hakkımda',skills:'Yetenekler',experience:'Deneyim',projects:'Projeler',contact:'İletişim'},
    about: {text:'Yazılım geliştirme ve bilişim sistemlerinde çok disiplinli projeler geliştiriyorum…', focus:'Odak Alanlarım', edu:'Eğitim'},
    filters: {all:'Tümü', software:'Yazılım', iot:'IoT / Gömülü', ai:'Görüntü İşleme / AI', automation:'Otomasyon/Test'},
    contact: {whats:'WhatsApp Görüşme Başlat', call:'Ara: +90 555 005 18 00', tg:'Telegram: @mustafaferhatimamoglu'},
    form: {title:'İletişim Formu', name:'Ad Soyad', company:'Firma', email:'E-posta', phone:'Telefon', msg:'Mesaj', alsoTg:'Mesajı Telegram’dan da gönder', send:'Gönder'},
    auth: {login:'Giriş Yap', title:'Müşteri Portalı', desc:'Giriş yapabilir veya yeni müşteri formunu doldurabilirsiniz.', signup:'Yeni Müşteri Ol', cancel:'Kapat'},
    signup: {title:'Yeni Müşteri — Bilgi Formu', fullname:'Ad Soyad', company:'Firma', email:'E-posta', phone:'Telefon', taxoffice:'Vergi Dairesi', taxno:'Vergi No / TCKN', address:'Fatura Adresi', send:'Gönder'}
  },
  en: {
    nav: {about:'About',skills:'Skills',experience:'Experience',projects:'Projects',contact:'Contact'},
    hero: {hello:'Hello,', iAm:'I am', badge:'Software • Mechanical • Electronics', cvAi:'Computer Vision & AI',
           viewProjects:'View Projects', contactMe:'Contact Me'},
    sections: {about:'About',skills:'Skills',experience:'Experience',projects:'Projects',contact:'Contact'},
    about: {text:'I build multidisciplinary projects across software and IT systems…', focus:'Focus Areas', edu:'Education'},
    filters: {all:'All', software:'Software', iot:'IoT / Embedded', ai:'Computer Vision / AI', automation:'Automation/Testing'},
    contact: {whats:'Start WhatsApp Chat', call:'Call: +90 555 005 18 00', tg:'Telegram: @mustafaferhatimamoglu'},
    form: {title:'Contact Form', name:'Full Name', company:'Company', email:'Email', phone:'Phone', msg:'Message', alsoTg:'Also send over Telegram', send:'Send'},
    auth: {login:'Log In', title:'Client Portal', desc:'Log in or fill out the new client form.', signup:'Become a Client', cancel:'Close'},
    signup: {title:'New Client — Info Form', fullname:'Full Name', company:'Company', email:'Email', phone:'Phone', taxoffice:'Tax Office', taxno:'Tax No / National ID', address:'Billing Address', send:'Send'}
  }
};
let currentLang = localStorage.getItem('lang') || CFG.LANG_DEFAULT || 'tr';

// ===== Tema =====
const root = document.documentElement;
const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if(savedTheme === 'light') root.classList.add('light');
themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
themeToggle.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
});
$('#year').textContent = new Date().getFullYear();

// ===== Menü =====
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
menuToggle?.addEventListener('click', ()=>{
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// ===== Dil Seçimi =====
const langSelect = $('#langSelect');
langSelect.value = currentLang;
function applyI18n(){
  const dict = LANGS[currentLang];
  $$('[data-i18n]').forEach(el=>{
    const path = el.getAttribute('data-i18n').split('.');
    let ref = dict;
    for(const k of path){ ref = ref?.[k]; }
    if(typeof ref === 'string') el.textContent = ref;
  });
  // Hero typewriter phrases
  const typer = $('#typer');
  const phrasesAttr = currentLang === 'en' ? 'data-phrases-en' : 'data-phrases-tr';
  typer.setAttribute('data-phrases', typer.getAttribute(phrasesAttr));
}
applyI18n();
langSelect.addEventListener('change', ()=>{
  currentLang = langSelect.value;
  localStorage.setItem('lang', currentLang);
  applyI18n();
});

// ===== Typewriter (yaz-sil) — başında boşluk + hızlı =====
(function typewriter(){
  const el = $('#typer');
  const getPhrases = ()=> JSON.parse(el.getAttribute('data-phrases'));
  let i=0, j=0, deleting=false, pause=800;
  function tick(){
    const phrases = getPhrases();
    const current = phrases[i % phrases.length];
    if(!deleting){
      el.textContent = current.slice(0, ++j);
      if(j === current.length){ deleting = true; return void setTimeout(tick, pause); }
    } else {
      el.textContent = current.slice(0, --j);
      if(j === 0){ deleting = false; i++; }
    }
    const base = deleting ? 28 : 40;
    setTimeout(tick, base + Math.random()*50);
  }
  tick();
})();

// ===== Lokasyon parametresi =====
if(CFG.SHOW_LOCATION){ $('#heroMeta')?.removeAttribute('hidden'); }

// ===== Yetenekler =====
const skills = [
  {name:'C# / .NET', level:95},
  {name:'MSSQL', level:90},
  {name:'DevExpress', level:85},
  {name:'Entity Framework', level:85},
  {name:'ASP.NET', level:80},
  {name:'JavaScript', level:75},
  {name:'Python / OpenCV', level:70},
  {name:'IoT / ESP32 / C/C++', level:85},
  {name:'Görüntü İşleme / AI', level:75},
  {name:'ERP / B2B2C Entegrasyon', level:85},
  {name:'Linux & AD & Sanallaştırma', level:70},
  {name:'Test & Doğrulama Otomasyonu', level:80},
];
const skillsGrid = $('#skillsGrid');
skills.forEach(s=>{
  const div = document.createElement('div');
  div.className = 'skill';
  div.innerHTML = `<h4>${s.name}</h4><div class="meter"><i style="width:${s.level}%"></i></div>`;
  skillsGrid.appendChild(div);
});

// ===== Deneyim (yıl bilgisi yok) =====
const experience = [
  {title:'Bilgi İşlem Uzmanı', company:'Şirikçioğlu Tekstil', time:'', location:'Kayseri',
   bullets:['Sunucu, network, güvenlik (firewall) kurulumu ve yönetimi',
    'C# WinForms + MSSQL ile iç yazılımlar',
    'Active Directory, sanallaştırma, yedekleme',
    'IP CCTV entegrasyonu; üretim kalite görüntü işleme']},
  {title:'Sistem Mühendisi', company:'Ayruz Endüstri', time:'', location:'Kayseri',
   bullets:['Havacılık projelerinde tasarım, entegrasyon, doğrulama',
    'DO-178/DO-254, MIL-STD-810G/DO-160 test planlama/uygulama',
    'Helikopter vinç yazılımı, yakıt probu, test ekipmanları']},
  {title:'Sistem Mühendisi', company:'Zirve Bilişim', time:'', location:'Kayseri',
   bullets:['BT altyapısı: güvenlik duvarı, sanallaştırma, NAS/yedekleme',
    'Logo entegrasyonlar, ağ optimizasyonu',
    'Kamera/güvenlik sistemleri ve kullanıcı destek']},
  {title:'Yazılım Mühendisi', company:'Sedaş Bilgisayar', time:'', location:'',
   bullets:['Netsis/Logo B2B2C-ERP entegrasyonları',
    'TURPAK istasyon yönetimi; el terminali ekranları',
    'Bulut yedekleme ve raporlama yazılımları']},
];
const experienceList = $('#experienceList');
experience.forEach(j=>{
  const el = document.createElement('div'); el.className='job';
  const meta = [j.time, CFG.SHOW_LOCATION ? j.location : ''].filter(Boolean).join(' • ');
  el.innerHTML = `
    <h4>${j.title} — ${j.company}</h4>
    ${meta ? `<div class="meta">${meta}</div>` : ''}
    <ul>${j.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
  `;
  experienceList.appendChild(el);
});

// ===== Projeler =====
const projects = [
  {title:'Araçta Sarsıntı Algılayan ESP32-CAM',
   desc:'G-sensör tetikli fotoğraf: alt yazılı görüntüyü Telegram’a gönderir.',
   tags:['ESP32','IoT','Görüntü İşleme'], type:'iot', links:[]},
  {title:'Vision/AI Setupları', desc:'OpenCV/TensorFlow + ESP32 entegrasyonu', tags:['Python','AI'], type:'ai', links:[]},
  {title:'Çevresel Test Otomasyonu', desc:'DO-160 / MIL-STD-810 veri toplama & rapor', tags:['C#','.NET'], type:'automation', links:[]},
];
const projectsGrid = $('#projectsGrid');
function renderProjects(filter='all'){
  projectsGrid.innerHTML = '';
  projects.filter(p => filter==='all' || p.type===filter)
    .forEach(p=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div class="title">${p.title}</div>
        <div class="desc">${p.desc}</div>
        <div class="badges">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>
      `;
      projectsGrid.appendChild(card);
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

// ===== SMS (parametreli) =====
if(CFG.SHOW_SMS){
  const smsBtn = document.createElement('a');
  smsBtn.className = 'btn contact-btn sms';
  smsBtn.href = 'sms:+905550051800?body=Merhaba%20Mustafa%2C%20';
  smsBtn.textContent = currentLang==='en' ? 'Send SMS' : 'SMS Gönder';
  $('#contactButtons').appendChild(smsBtn);
}

// ===== İletişim Formu (Formspree + Telegram opsiyonel) =====
async function sendToFormspree(url, data){
  if(!url) return {ok:false, error:'No Formspree URL'};
  const res = await fetch(url, {method:'POST', headers:{'Accept':'application/json'}, body: data});
  return res.ok ? {ok:true} : {ok:false, error: 'Formspree error'};
}
async function sendToTelegram(text){
  if(!CFG.TELEGRAM_ENABLED) return {ok:true};
  // Güvenlik: prod’da token’ı serverless ile saklamanı öneriyoruz.
  const api = `https://api.telegram.org/bot${CFG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(api, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: CFG.TELEGRAM_CHAT_ID, text })
  });
  return res.ok ? {ok:true} : {ok:false, error:'Telegram error'};
}

$('#contactForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const alsoTg = $('#alsoTelegram').checked;

  const pretty = [
    `Yeni mesaj:`,
    `Ad: ${fd.get('name')||'-'}`,
    `Firma: ${fd.get('company')||'-'}`,
    `E-posta: ${fd.get('email')||'-'}`,
    `Telefon: ${fd.get('phone')||'-'}`,
    `Mesaj: ${fd.get('message')||'-'}`
  ].join('\n');

  $('#formStatus').textContent = currentLang==='en' ? 'Sending…' : 'Gönderiliyor…';

  const [tgRes, fsRes] = await Promise.all([
    alsoTg ? sendToTelegram(pretty) : Promise.resolve({ok:true}),
    sendToFormspree(CFG.FORMSPREE_CONTACT, fd)
  ]);

  if(tgRes.ok && fsRes.ok){
    $('#formStatus').textContent = currentLang==='en' ? 'Sent ✅' : 'Gönderildi ✅';
    e.target.reset();
  } else {
    $('#formStatus').textContent = (tgRes.error || fsRes.error || 'Hata');
  }
});

// ===== Müşteri Portalı / Yeni Müşteri Formu =====
const authModal = $('#authModal');
$('#loginBtn')?.addEventListener('click', ()=> authModal.showModal());
authModal?.addEventListener('close', ()=>{
  $('#signupForm').hidden = true;
  $('#signupStatus').textContent = '';
});
$$('.modal .actions button').forEach(btn=>{
  btn.addEventListener('click',(ev)=>{
    const v = ev.target.value;
    if(v==='signup') $('#signupForm').hidden = false;
  });
});
$('#submitSignup')?.addEventListener('click', async ()=>{
  const form = $('#signupForm');
  const fd = new FormData(form);
  const pretty = [
    `Yeni müşteri başvurusu:`,
    `Ad Soyad: ${fd.get('s_fullname')||'-'}`,
    `Firma: ${fd.get('s_company')||'-'}`,
    `E-posta: ${fd.get('s_email')||'-'}`,
    `Telefon: ${fd.get('s_phone')||'-'}`,
    `Vergi Dairesi: ${fd.get('s_tax_office')||'-'}`,
    `Vergi No/TCKN: ${fd.get('s_tax_no')||'-'}`,
    `Fatura Adresi: ${fd.get('s_address')||'-'}`
  ].join('\n');

  $('#signupStatus').textContent = currentLang==='en' ? 'Sending…' : 'Gönderiliyor…';
  const [tgRes, fsRes] = await Promise.all([
    sendToTelegram(pretty),
    sendToFormspree(CFG.FORMSPREE_SIGNUP, fd)
  ]);
  if(tgRes.ok && fsRes.ok){
    $('#signupStatus').textContent = currentLang==='en' ? 'Sent ✅' : 'Gönderildi ✅';
    setTimeout(()=>authModal.close(), 900);
  } else {
    $('#signupStatus').textContent = (tgRes.error || fsRes.error || 'Hata');
  }
});
