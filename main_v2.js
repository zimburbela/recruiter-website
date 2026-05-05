// 1. Lenis Smooth Scroll Initialization
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Interactive Cursor
const cursor = document.querySelector('.custom-cursor');
const dot = document.querySelector('.cursor-dot');
let cursorX = 0, cursorY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    dotX = e.clientX;
    dotY = e.clientY;
    
    // Snappy dot, smooth ring
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;
});

// Smooth ring follow loop
function cursorLoop() {
    const ringX = parseFloat(cursor.style.left || 0);
    const ringY = parseFloat(cursor.style.top || 0);
    
    cursor.style.left = `${ringX + (cursorX - ringX) * 0.15}px`;
    cursor.style.top = `${ringY + (cursorY - ringY) * 0.15}px`;
    
    requestAnimationFrame(cursorLoop);
}
cursorLoop();

// Cursor Hover States
document.querySelectorAll('.hover-link').forEach(link => {
    link.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    link.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// 3. Magnetic Bento & Card Hover
document.querySelectorAll('.magnetic').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 4. Cyber-Scramble Text Effect
class ScrambleText {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#_';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Init Scramble on specific elements
const phrases = [
    'Створюємо майбутнє',
    'Автоматизація 2.0',
    'Ваш Бренд'
];
const fx = new ScrambleText(document.querySelector('.logo'));
let counter = 0;
setInterval(() => {
    fx.setText(phrases[counter]);
    counter = (counter + 1) % phrases.length;
}, 4000);

// 5. Advanced Neural Network Canvas (Three.js)
let scene, camera, renderer, particles, linesMesh;
const maxDistance = 4;

function initNetwork() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 150;
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const velocities = [];

    for (let i = 0; i < particlesCount * 3; i+=3) {
        posArray[i] = (Math.random() - 0.5) * 40;
        posArray[i+1] = (Math.random() - 0.5) * 40;
        posArray[i+2] = (Math.random() - 0.5) * 20;

        velocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.1, color: 0x00e5ff });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Initial Line setup (empty)
    const linesMaterial = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.15 });
    linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), linesMaterial);
    scene.add(linesMesh);

    // Save velocities to userData
    particles.userData.velocities = velocities;

    networkAnimate();
}

function networkAnimate() {
    requestAnimationFrame(networkAnimate);

    const positions = particles.geometry.attributes.position.array;
    const vels = particles.userData.velocities;
    const linePositions = [];

    // Move particles
    for(let i=0; i<positions.length; i+=3) {
        const idx = i/3;
        positions[i] += vels[idx].x;
        positions[i+1] += vels[idx].y;
        positions[i+2] += vels[idx].z;

        // Bounce bounds
        if(Math.abs(positions[i]) > 20) vels[idx].x *= -1;
        if(Math.abs(positions[i+1]) > 20) vels[idx].y *= -1;
        if(Math.abs(positions[i+2]) > 10) vels[idx].z *= -1;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Connect particles
    let vertexCount = 0;
    for ( let i = 0; i < positions.length; i += 3 ) {
        for ( let j = i + 3; j < positions.length; j += 3 ) {
            const dx = positions[ i ] - positions[ j ];
            const dy = positions[ i + 1 ] - positions[ j + 1 ];
            const dz = positions[ i + 2 ] - positions[ j + 2 ];
            const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

            if ( dist < maxDistance ) {
                linePositions.push(
                    positions[ i ], positions[ i + 1 ], positions[ i + 2 ],
                    positions[ j ], positions[ j + 1 ], positions[ j + 2 ]
                );
                vertexCount += 2;
            }
        }
    }

    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    // Parallax on scroll & mouse
    const scrollY = window.scrollY;
    camera.position.y = -(scrollY * 0.005);
    camera.position.x += ( (cursorX/window.innerWidth - 0.5) * 5 - camera.position.x ) * 0.05;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if(camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// 6. Terminal Typewriter (From Previous)
function initTerminalSimulation() {
    const termBody = document.getElementById('scrolling-terminal');
    if (!termBody) return;

    const logs = [
        "➡️ Шукаю найкращих спеціалістів у Telegram...",
        "➡️ Читаю тисячі повідомлень та резюме...",
        { text: "✅ Знайдено 154 потенційних кандидати", class: "success" },
        "➡️ Аналізую досвід роботи кожного...",
        { text: "🔥 ІДЕАЛЬНИЙ КАНДИДАТ: @a***_***_dev", class: "action" },
        "➡️ Перевіряю його навички та портфоліо...",
        { text: "⭐ Оцінка: 94/100. Кандидат ідеально підходить!", class: "success" },
        "➡️ Складаю індивідуальне запрошення на роботу...",
        { text: "✉️ Повідомлення відправлено! Чекаю на відповідь...", class: "action" }
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
                setTimeout(typeChar, Math.random() * 20 + 20); // Faster
            } else {
                currentLog++;
                if (termBody.children.length > 7) {
                    termBody.removeChild(termBody.firstChild);
                }
                setTimeout(typeNextLine, Math.random() * 2000 + 500);
            }
        }
        typeChar();
    }
    setTimeout(typeNextLine, 1000);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNetwork();
    initTerminalSimulation();
});
