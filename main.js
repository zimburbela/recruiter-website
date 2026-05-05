// 3D Background Engine (Three.js)
let scene, camera, renderer, mainObject, stardust;

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create Main Floating Geometry (Tech Sphere)
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.3 });
    mainObject = new THREE.LineSegments(wireframe, material);
    scene.add(mainObject);

    // Inner glowing sphere
    const innerGeometry = new THREE.IcosahedronGeometry(1.9, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({ color: 0x7000ff, transparent: true, opacity: 0.2, wireframe: true });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    mainObject.add(innerSphere);

    // Outer glow subtle
    const outerGeometry = new THREE.IcosahedronGeometry(2.2, 2);
    const outerMaterial = new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.05, wireframe: true });
    const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
    mainObject.add(outerSphere);

    // Particles Stardust Layer
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.015, color: 0x00f2ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    stardust = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(stardust);

    camera.position.z = 6;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate Main Object
    mainObject.rotation.y += 0.002;
    mainObject.rotation.x += 0.001;
    
    // Rotate Stardust
    stardust.rotation.y -= 0.0005;

    // React to scroll
    const scrollY = window.scrollY;
    mainObject.position.y = -(scrollY * 0.002);
    
    renderer.render(scene, camera);
}

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    if (mainObject) {
        mainObject.rotation.y += mouseX * 0.05;
        mainObject.rotation.x += mouseY * 0.05;
        stardust.rotation.y += mouseX * 0.02;
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize interactivity and 3D
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    
    // Intersection Observer for reveal animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                if (entry.target.hasAttribute('data-target')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, [data-target]').forEach(el => observer.observe(el));

    // Magnetic Card Effect
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Terminal Typewriter Effect
    initTerminalSimulation();

    // Dynamic 3D Perspective Shift on Scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('section').forEach(section => {
            const speed = 0.05;
            const yPos = -(scrolled * speed);
            section.style.transform = `translateZ(${yPos}px) rotateX(${scrolled * 0.005}deg)`;
        });
    });
});

// Counter Animation
function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    const count = +el.innerText;
    const speed = 200;
    const inc = target / speed;

    if (count < target) {
        el.innerText = Math.ceil(count + inc);
        setTimeout(() => animateCounter(el), 1);
    } else {
        el.innerText = target;
    }
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentNode;
        const answer = button.nextElementSibling;
        const isActive = item.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-answer').style.maxHeight = null;
        });

        // Open current if it was not active
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Terminal Simulation Functions
function initTerminalSimulation() {
    const termBody = document.getElementById('scrolling-terminal');
    if (!termBody) return;

    const logs = [
        "> Initializing AI Recruiter Engine v2.4...",
        "> Connecting to Telegram APIs...",
        { text: "> Connection established. Status: ONLINE", class: "success" },
        "> Scanning Target Group: 'Frontend Developers UA'...",
        "> Analyzing 4,500 messages...",
        { text: "> HIGH MATCH DETECTED: @alex_react_dev", class: "action" },
        "> Fetching GitHub profile...",
        "> Skills: React (95%), TS (90%), Three.js (80%)",
        { text: "> Overall Score: 94/100. Action: APROVED", class: "success" },
        "> Generating personalized outreach message...",
        { text: "> Message Sent! Awaiting response...", class: "action" },
        "> Sleeping for 120s to simulate human behavior..."
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
        
        // Typewriter on text
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                lineElem.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeChar, Math.random() * 30 + 10);
            } else {
                currentLog++;
                if (termBody.children.length > 8) {
                    termBody.removeChild(termBody.firstChild);
                }
                setTimeout(typeNextLine, Math.random() * 1500 + 500);
            }
        }
        typeChar();
    }
    
    setTimeout(typeNextLine, 1500);
}
