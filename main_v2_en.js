/* ═══════════════════════════════════════════════════════════════
   TalentPulse AI — Main Script v3.0 (English Version)
   ═══════════════════════════════════════════════════════════════ */

// ─── 1. Ambient Cursor Glow ───
const cursorGlow = document.querySelector('.cursor-glow');
let glowX = window.innerWidth / 2, glowY = window.innerHeight / 2;
let targetX = glowX, targetY = glowY;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (cursorGlow && (!cursorGlow.style.opacity || cursorGlow.style.opacity === "0")) {
        cursorGlow.style.opacity = "1";
    }
});

function animateGlow() {
    glowX += (targetX - glowX) * 0.07;
    glowY += (targetY - glowY) * 0.07;
    if (cursorGlow) {
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(animateGlow);
}
animateGlow();

// ─── 2. Scroll Reveal Observer ───
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

// ─── 3. Sticky Header ───
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ─── 4. Mobile Hamburger Menu ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ─── 5. Magnetic Bento Hover ───
document.querySelectorAll('.magnetic').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ─── 6. Counter Animation ───
function animateCounters() {
    const statCards = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const target = parseInt(entry.target.dataset.target);
                const duration = 2000;
                const start = performance.now();
                
                const card = entry.target.closest('.stat-card');
                if (card) card.classList.add('animated');
                const barFill = card?.querySelector('.stat-bar-fill');
                if (barFill) {
                    barFill.style.width = barFill.style.width; // trigger reflow
                }

                function updateCount(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(easeProgress * target);
                    entry.target.textContent = current.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                }
                requestAnimationFrame(updateCount);
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(el => counterObserver.observe(el));
}
animateCounters();

// ─── 7. FAQ Accordion ───
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentNode;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');
        
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-answer').style.maxHeight = null;
        });

        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// ─── 8. Smooth Scrolling ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ─── 9. Terminal Typewriter ───
function initTerminalSimulation() {
    const termBody = document.getElementById('scrolling-terminal');
    if (!termBody) return;

    const logs = [
        "⚡ Initializing TalentPulse AI v3.0...",
        "🔗 Connecting to Telegram API...",
        { text: "✅ Connection established. Status: ONLINE", class: "success" },
        "🔍 Scanning group: 'Frontend Developers UK'...",
        "📊 Analyzing 4,500 messages...",
        { text: "🎯 HIGH MATCH DETECTED: @alex_react_dev", class: "action" },
        "🧠 Fetching GitHub profile & portfolio...",
        "📈 React: 95% | TypeScript: 92% | Three.js: 88%",
        { text: "⭐ Overall Score: 96/100 — RECOMMENDED", class: "success" },
        "✍️ Generating personalized outreach message...",
        { text: "✉️ Message sent! Awaiting response...", class: "action" },
        "⏳ Sleeping for 120s to simulate human behavior...",
        "🔍 Scanning new group: 'Python Engineers'...",
        { text: "✅ Found 37 potential candidates", class: "success" },
        { text: "🎯 TOP Candidate: @maria_python_ml", class: "action" },
        "📈 Python: 98% | ML: 94% | FastAPI: 91%",
        { text: "⭐ Score: 97/100 — EXCEPTIONAL MATCH", class: "success" },
    ];

    let currentLog = 0;
    
    function typeNextLine() {
        if (currentLog >= logs.length) currentLog = 0;
        
        const log = logs[currentLog];
        const text = typeof log === 'string' ? log : log.text;
        const className = typeof log === 'string' ? '' : log.class;
        
        const lineElem = document.createElement('div');
        lineElem.className = `term-line ${className}`;
        termBody.appendChild(lineElem);
        
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                lineElem.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeChar, Math.random() * 25 + 15);
            } else {
                currentLog++;
                if (termBody.children.length > 8) {
                    termBody.removeChild(termBody.firstChild);
                }
                setTimeout(typeNextLine, Math.random() * 1800 + 600);
            }
        }
        typeChar();
    }
    setTimeout(typeNextLine, 800);
}

// ─── 10. Three.js Neural Network Background ───
let scene, camera, renderer, particles, linesMesh;
const maxDistance = 4;

function initNetwork() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 120;
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const velocities = [];

    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 40;
        posArray[i+1] = (Math.random() - 0.5) * 30;
        posArray[i+2] = (Math.random() - 0.5) * 15;
        velocities.push({
            x: (Math.random() - 0.5) * 0.04,
            y: (Math.random() - 0.5) * 0.04,
            z: (Math.random() - 0.5) * 0.03
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ 
        size: 0.08, 
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending 
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const linesMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00e5ff, 
        transparent: true, 
        opacity: 0.1 
    });
    linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), linesMaterial);
    scene.add(linesMesh);

    particles.userData.velocities = velocities;
    networkAnimate();
}

function networkAnimate() {
    requestAnimationFrame(networkAnimate);

    const positions = particles.geometry.attributes.position.array;
    const vels = particles.userData.velocities;
    const linePositions = [];

    for (let i = 0; i < positions.length; i += 3) {
        const idx = i / 3;
        positions[i] += vels[idx].x;
        positions[i+1] += vels[idx].y;
        positions[i+2] += vels[idx].z;

        if (Math.abs(positions[i]) > 20) vels[idx].x *= -1;
        if (Math.abs(positions[i+1]) > 15) vels[idx].y *= -1;
        if (Math.abs(positions[i+2]) > 8) vels[idx].z *= -1;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < positions.length; i += 3) {
        for (let j = i + 3; j < positions.length; j += 3) {
            const dx = positions[i] - positions[j];
            const dy = positions[i+1] - positions[j+1];
            const dz = positions[i+2] - positions[j+2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance) {
                linePositions.push(
                    positions[i], positions[i+1], positions[i+2],
                    positions[j], positions[j+1], positions[j+2]
                );
            }
        }
    }

    linesMesh.geometry.dispose();
    linesMesh.geometry = new THREE.BufferGeometry();
    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    camera.position.y = -(window.scrollY * 0.003);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
    initNetwork();
    initTerminalSimulation();
});
