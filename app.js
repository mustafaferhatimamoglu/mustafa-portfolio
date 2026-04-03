document.addEventListener('DOMContentLoaded', () => {
    let currentData = null;
    let currentLang = localStorage.getItem('lang') || 'tr';
    const langPanel = document.getElementById('lang-panel');
    const langToggle = document.getElementById('lang-toggle');
    const projectsContainer = document.getElementById('projects-container');
    
    // Telegram Configuration
    const TG_TOKEN = '8463888693:AAHS2xsejdWebakw3DOklRljfR9SwQjOCak';
    const TG_CHAT_ID = '6069420562';

    // 1. Initialize Application
    init();
    initParticles();
    setupContactForm();

    async function init() {
        try {
            const response = await fetch('data.json');
            currentData = await response.json();
            
            // Check IP only if no language preference is saved
            if (!localStorage.getItem('lang')) {
                checkLocation();
            }

            renderContent();
            setupProjectSlider();
            initTypewriter();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // 2. IP & Location Logic
    async function checkLocation() {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const locData = await res.json();
            if (locData.country_code !== 'TR') {
                showLangPanel();
            }
        } catch (e) {
            console.warn('Location check failed, defaulting to TR');
        }
    }

    function showLangPanel() {
        langPanel.classList.remove('hidden');
        
        document.getElementById('btn-en').addEventListener('click', () => {
            switchLanguage('en');
            langPanel.classList.add('hidden');
        });

        document.getElementById('btn-tr-stay').addEventListener('click', () => {
            langPanel.classList.add('hidden');
        });
    }

    // 3. Language Logic
    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        
        // Update Flag UI
        const flagImg = document.getElementById('lang-flag');
        const langCode = document.getElementById('lang-code');
        if (lang === 'tr') {
            flagImg.src = 'https://flagcdn.com/w40/tr.png';
            langCode.textContent = 'TR';
        } else {
            flagImg.src = 'https://flagcdn.com/w40/gb.png';
            langCode.textContent = 'EN';
        }

        renderContent();
    }

    langToggle.addEventListener('click', () => {
        switchLanguage(currentLang === 'tr' ? 'en' : 'tr');
    });

    // 4. Rendering Logic
    function renderContent() {
        const d = currentData[currentLang];
        
        // Hero
        document.getElementById('hero-name').textContent = d.hero.name;
        document.getElementById('hero-welcome').textContent = d.hero.welcomeText;
        document.getElementById('hero-title').textContent = d.hero.title.toUpperCase();

        // About
        document.getElementById('about-content').innerHTML = `<p>${d.about.text}</p>`;
        const phone = currentLang === 'tr' ? 'TEL: 0555 005 1800' : 'PHONE: +90 555 005 1800';
        document.getElementById('about-status-box').innerHTML = currentLang === 'tr' ? 
            `// KONUM: KAYSERİ, TR<br>// ROL: BİLGİSAYAR & MAKİNE MÜHENDİSİ<br>// ${phone}` :
            `// LOCATION: KAYSERI, TR<br>// ROLE: COMPUTER & MECHANICAL ENGINEER<br>// ${phone}`;

        // Skills
        renderSkills(d.skills);

        // Projects
        renderProjects(d.projects);

        // Static UI Translations
        updateStaticStrings(currentLang);
    }

    function updateStaticStrings(lang) {
        const strings = {
            tr: {
                'nav-hero': 'HAYAT',
                'nav-about': 'HAKKINDA',
                'nav-skills': 'YETKİNLİK',
                'nav-projects': 'PROJELER',
                'nav-contact': 'İLETİŞİM',
                'about-title': '[01] Hakkında',
                'skills-title': '[02] Uzmanlık Alanları',
                'projects-title': '[03] Seçilmiş Projeler',
                'projects-desc': '// 30+ MÜHENDİSLİK PROJESİ',
                'contact-title': '[04] Bağlantı Kur',
                'label-name': 'Ad Soyad',
                'label-email': 'E-posta Adresi',
                'label-msg': 'Mesajınız',
                'btn-send': 'MESAJI GÖNDER',
                'footer-text': `© ${new Date().getFullYear()} MUSTAFA FERHAT İMAMOĞLU // TÜM HAKLARI SAKLIDIR.`
            },
            en: {
                'nav-hero': 'LIFE',
                'nav-about': 'ABOUT',
                'nav-skills': 'SKILLS',
                'nav-projects': 'PROJECTS',
                'nav-contact': 'CONTACT',
                'about-title': '[01] About',
                'skills-title': '[02] Expertise',
                'projects-title': '[03] Selected Projects',
                'projects-desc': '// 30+ ENGINEERING PROJECTS',
                'contact-title': '[04] Get In Touch',
                'label-name': 'Full Name',
                'label-email': 'Email Address',
                'label-msg': 'Your Message',
                'btn-send': 'SEND MESSAGE',
                'footer-text': `© ${new Date().getFullYear()} MUSTAFA FERHAT İMAMOĞLU // ALL RIGHTS RESERVED.`
            }
        };

        const currentStrings = strings[lang];
        Object.keys(currentStrings).forEach(key => {
            const el = document.querySelector(`[data-key="${key}"]`);
            if (el) el.textContent = currentStrings[key];
        });

        // Placeholders
        document.getElementById('name').placeholder = lang === 'tr' ? 'Adınız Soyadınız' : 'Your Full Name';
        document.getElementById('email').placeholder = lang === 'tr' ? 'email@ornek.com' : 'email@example.com';
        document.getElementById('message').placeholder = lang === 'tr' ? 'Mesajınız...' : 'Your Message...';
    }

    function renderSkills(skills) {
        const container = document.getElementById('skills-container');
        container.innerHTML = '';
        skills.forEach(skillGroup => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            
            // Reference site inspired: Skill Meters instead of just tags
            const meters = skillGroup.items.map(item => {
                // Proficiency levels (statistically realistic)
                const level = Math.floor(Math.random() * 16) + 80; 
                return `
                    <div class="skill-item">
                        <div class="skill-info">
                            <span>${item}</span>
                        </div>
                        <div class="skill-bar-bg">
                            <div class="skill-bar-fill" style="width: ${level}%"></div>
                        </div>
                    </div>
                `;
            }).join('');

            card.innerHTML = `
                <h3 class="mono-text">${skillGroup.category}</h3>
                <div class="skill-meter-container">
                    ${meters}
                </div>
            `;
            container.appendChild(card);
        });
    }

    // 6. Typewriter Effect
    let typewriterIndex = 0;
    let isDeleting = false;
    function initTypewriter() {
        const target = document.getElementById('hero-title');
        const rolesTR = [
            'Bilgisayar Mühendisi', 'Makine Mühendisi', 'Siber Güvenlik Uzmanı', 'Gömülü Sistem Tasarımcısı',
            'Full Stack Developer', 'IoT Mimarı', 'Ağ Güvenlik Analisti', 'PLC Programcısı',
            'Endüstriyel Otomasyon Mühendisi', 'Yapay Zeka Araştırmacısı', 'DevSecOps Mühendisi',
            'Robotik Sistem Geliştiricisi', 'Penetrasyon Test Uzmanı', 'Bulut Güvenlik Mimarı', 
            'FPGA Geliştiricisi', 'Backend Mühendisi', 'Frontend Uzmanı', 'Mobil Uygulama Geliştiricisi',
            'Donanım Tasarımcısı', 'Mekatronik Mühendisi', 'Veri Bilimcisi', 'Blokzinciri Yazılımcısı',
            'Linux Sistem Yöneticisi', 'Savunma Sanayii Yazılımcısı', 'SCADA Uzmanı', 'RF Mühendisi',
            'Sızma Testi Koordinatörü', 'Otomotiv Yazılım Uzmanı', 'Dijital İkiz Geliştiricisi', 
            'Kriptografi Araştırmacısı', 'Firmware Mühendisi', 'Kontrol Sistemleri Uzmanı'
        ];
        
        const rolesEN = [
            'Computer Engineer', 'Mechanical Engineer', 'Cyber Security Expert', 'Embedded Systems Designer',
            'Full Stack Developer', 'IoT Architect', 'Network Security Analyst', 'PLC Programmer',
            'Industrial Automation Engineer', 'AI Researcher', 'DevSecOps Engineer',
            'Robotic Systems Developer', 'Penetration Tester', 'Cloud Security Architect',
            'FPGA Developer', 'Backend Engineer', 'Frontend Specialist', 'Mobile App Developer',
            'Hardware Designer', 'Mechatronics Engineer', 'Data Scientist', 'Blockchain Developer',
            'Linux SysAdmin', 'Defense Systems Developer', 'SCADA Specialist', 'RF Engineer',
            'Red Team Coordinator', 'Automotive Software Expert', 'Digital Twin Developer',
            'Cryptography Researcher', 'Firmware Engineer', 'Control Systems Specialist'
        ];

        const roles = currentLang === 'tr' ? rolesTR : rolesEN;
        
        let currentRole = roles[typewriterIndex % roles.length];
        let fullText = currentRole;
        let displayText = isDeleting ? 
            fullText.substring(0, target.textContent.length - 1) : 
            fullText.substring(0, target.textContent.length + 1);

        target.textContent = '\u00A0' + displayText;

        // Ultra-fast speed (3x+ optimization)
        let typeSpeed = isDeleting ? 10 : 25; 

        if (!isDeleting && displayText === fullText) {
            typeSpeed = 400; // Minimal pause at end
            isDeleting = true;
        } else if (isDeleting && displayText === '') {
            isDeleting = false;
            typewriterIndex++;
            typeSpeed = 100; // Minimal pause after delete
        }

        setTimeout(initTypewriter, typeSpeed);
    }


    // 8. Telegram Contact Form
    function setupContactForm() {
        const form = document.querySelector('form[name="contact"]');
        const statusEl = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            const text = `🚀 *Yeni Portfolyo Mesajı*\n\n👤 *İsim:* ${name}\n📧 *E-posta:* ${email}\n\n💬 *Mesaj:*\n${message}`;

            submitBtn.disabled = true;
            statusEl.textContent = currentLang === 'tr' ? 'Gönderiliyor...' : 'Sending...';
            statusEl.className = 'form-status';
            statusEl.style.display = 'block';

            try {
                const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TG_CHAT_ID,
                        text: text,
                        parse_mode: 'Markdown'
                    })
                });

                if (response.ok) {
                    statusEl.textContent = currentLang === 'tr' ? '✅ Mesaj başarıyla gönderildi!' : '✅ Message sent successfully!';
                    statusEl.classList.add('success');
                    form.reset();
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                statusEl.textContent = currentLang === 'tr' ? '❌ Hata oluştu. Lütfen tekrar deneyin.' : '❌ Error occurred. Please try again.';
                statusEl.classList.add('error');
            } finally {
                submitBtn.disabled = false;
                setTimeout(() => {
                    statusEl.style.display = 'none';
                }, 5000);
            }
        });
    }

    function renderProjects(projects) {
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const techList = project.tech.map(t => `<span>${t}</span>`).join('');
            const btnText = currentLang === 'tr' ? 'İNCELE' : 'VIEW';
            
            card.innerHTML = `
                <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span class="mono-text" style="font-size: 0.7rem;">// ${project.id.toUpperCase()}</span>
                        <h3 style="margin-top: 0.5rem; font-size: 1.1rem;">${project.title}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 1rem 0;">${project.description}</p>
                        <div class="project-tech" style="margin-bottom: 2rem;">
                            ${techList}
                        </div>
                    </div>
                    <a href="#" class="btn" style="width: 100%">${btnText} <i class="fas fa-arrow-right" style="font-size: 0.8rem; margin-left: 5px;"></i></a>
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }

    // 5. Slider Controls
    function setupProjectSlider() {
        const slider = document.querySelector('.projects-slider-container');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');

        nextBtn.onclick = () => {
            slider.scrollBy({ left: 400, behavior: 'smooth' });
        };
        prevBtn.onclick = () => {
            slider.scrollBy({ left: -400, behavior: 'smooth' });
        };

        // Drag to scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // 6. Particle System (antigravity.google style)
    function initParticles() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 100;
        
        const mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

                // Mouse interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
                }
            }
            draw() {
                ctx.fillStyle = 'rgba(0, 255, 170, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function handleParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 170, ${1 - distance/100})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleParticles();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }
});
