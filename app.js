// === Tema ===
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
if(saved === 'light') root.classList.add('light');
themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
themeToggle.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
});
document.getElementById('year').textContent = new Date().getFullYear();

// === Hakkımda kısa metin (gerekirse güncelle) ===
// İçerik CV'den derlendi.


// === Yetenekler ===
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
const skillsGrid = document.getElementById('skillsGrid');
skills.forEach(s=>{
  const el = document.createElement('div');
  el.className = 'skill';
  el.innerHTML = `<h4>${s.name}</h4>
    <div class="meter"><i style="width:${s.level}%"></i></div>`;
  skillsGrid.appendChild(el);
});

// === Deneyim === (CV kaynaklı)
const experience = [
  {
    title: 'Bilgi İşlem Uzmanı',
    company: 'Şirikçioğlu Tekstil',
    time: 'Mar 2025 — Devam',
    location: 'Kayseri',
    bullets: [
      'Sunucu, network, güvenlik (firewall) kurulumu ve yönetimi',
      'C# WinForms + MSSQL ile iç yazılımlar (arıza takibi, fazla mesai, sendika)',
      'Active Directory, sanallaştırma, yedekleme süreçleri',
      'IP CCTV sistem entegrasyonu; üretim kalite için görüntü işleme',
    ]
  },
  {
    title:'Sistem Mühendisi',
    company:'Ayruz Endüstri',
    time:'Şub 2023 — Ara 2024',
    location:'Kayseri',
    bullets:[
      'Havacılık projelerinde tasarım, entegrasyon ve doğrulama',
      'DO-178/DO-254, MIL-STD-810G/DO-160 test planlama ve uygulama',
      'Helikopter vinç yazılımı, yakıt probu, test ekipmanları',
    ]
  },
  {
    title:'Sistem Mühendisi',
    company:'Zirve Bilişim',
    time:'Haz 2021 — Şub 2023',
    location:'Kayseri',
    bullets:[
      'BT altyapısı: güvenlik duvarı, sanallaştırma, NAS/yedekleme',
      'Logo uyumlu entegrasyonlar, ağ trafiği optimizasyonu',
      'Kamera/güvenlik sistemleri ve kullanıcı destek süreçleri',
    ]
  },
  {
    title:'Yazılım Mühendisi',
    company:'Sedaş Bilgisayar',
    time:'Ara 2019 — Haz 2021',
    location:'',
    bullets:[
      'Netsis/Logo B2B2C-ERP entegrasyonları',
      'TURPAK entegre istasyon yönetimi; el terminali ekranları',
      'Bulut yedekleme ve özel raporlama yazılımları',
    ]
  }
];
const experienceList = document.getElementById('experienceList');
experience.forEach(j=>{
  const el = document.createElement('div');
  el.className = 'job';
  el.innerHTML = `
    <h4>${j.title} — ${j.company}</h4>
    <div class="meta">${j.time}${j.location ? ' • ' + j.location : ''}</div>
    <ul>${j.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
  experienceList.appendChild(el);
});

// === Projeler ===
const projects = [
  {
    title:'Araçta Sarsıntı Algılayan ESP32-CAM',
    desc:'G-sensör tetikli fotoğraf: altına tarih/saat + ivme yazısı basıp Telegram’a gönderir.',
    tags:['ESP32','IoT','Görüntü İşleme'],
    type:'iot',
    links:[
      {label:'Kod (Arduino skeç)', url:'#'},
      {label:'Teknik Notlar', url:'#'}
    ]
  },
  {
    title:'Yapay Zeka Destekli Görüntü İşleme Sistemleri',
    desc:'Yangın algılama, araç erişim, otopark yönetimi — Python/OpenCV/TensorFlow + ESP32 entegrasyonu.',
    tags:['Python','OpenCV','TensorFlow','AI'],
    type:'ai',
    links:[]
  },
  {
    title:'Otomatik Çevresel Test Sistemi',
    desc:'DO-160 & MIL-STD-810 uyumlu test senaryolarını C#/.NET ile otomatikleştirme, veri toplama ve raporlama.',
    tags:['C#','.NET','Otomasyon'],
    type:'automation',
    links:[]
  },
  {
    title:'Kaan/Hürjet Yakıt Probu',
    desc:'Donanım + gömülü yazılım + entegrasyon ve test aşamaları.',
    tags:['Gömülü','C','C#'],
    type:'iot',
    links:[]
  },
  {
    title:'B2B Sipariş & Fatura Yönetimi',
    desc:'Logo ERP ile tam entegre B2B: sipariş, irsaliye, fatura; web arayüz ve servisler.',
    tags:['ASP.NET','MSSQL','Entegrasyon'],
    type:'software',
    links:[]
  },
  {
    title:'Akıllı Şehir Aydınlatma (ESP32 Mesh)',
    desc:'Mesh yapı, ölçeklenebilir topoloji, MQTT ile gerçek zamanlı izleme.',
    tags:['ESP32','MQTT','IoT'],
    type:'iot',
    links:[]
  },
];

const projectsGrid = document.getElementById('projectsGrid');
function renderProjects(filter='all'){
  projectsGrid.innerHTML = '';
  projects
    .filter(p => filter==='all' ? true : p.type===filter)
    .forEach(p=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="title">${p.title}</div>
        <div class="desc">${p.desc}</div>
        <div class="badges">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>
        <div class="links">
          ${p.links.map(l=>`<a class="btn" target="_blank" rel="noopener" href="${l.url}">${l.label}</a>`).join('')}
        </div>`;
      projectsGrid.appendChild(card);
    });
}
renderProjects();

// Filtreler
document.querySelectorAll('.chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('is-active'));
    chip.classList.add('is-active');
    renderProjects(chip.dataset.filter);
  });
});

// === CV indirme (yerine kendi PDF'ini koy) ===
const cvUrl = 'KariyerCV-A1FEDD2D-C64E-4094-BF9F-E0F35828EA4D.pdf'; // repo köküne ekle
const downloadBtn = document.getElementById('downloadCV');
downloadBtn.setAttribute('href', cvUrl);
