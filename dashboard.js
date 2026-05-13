/* -----------------------------------------------------------------------
   TalentPulse AI - Dashboard Script
   ----------------------------------------------------------------------- */

const CONFIG = {
    API_BASE_URL: 'https://zimburbels-talentpulse-api.hf.space/api', 
    USE_MOCK: false
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const userRole = localStorage.getItem('user_role') || 'recruiter';
    
    // Redirect if on wrong page
    const currentPage = window.location.pathname.split('/').pop();
    if (userRole === 'candidate' && currentPage === 'dashboard.html') {
        window.location.href = 'dashboard_candidate.html';
        return;
    } else if (userRole === 'recruiter' && currentPage === 'dashboard_candidate.html') {
        window.location.href = 'dashboard.html';
        return;
    }

    initDashboardTerminal(userRole);
    loadStats();
    if (userRole === 'candidate') {
        loadVacancies();
    } else {
        loadCandidates();
    }
    loadAgents();
    initHistoryNavigation();
});

function initHistoryNavigation() {
    const navHistory = document.getElementById('nav-history');
    const overviewContent = document.querySelector('.stats-row').parentElement; // Main content wrapper
    const historyContent = document.getElementById('history-content');
    const overviewNav = document.querySelector('.nav-item.active');

    if (!navHistory) return;

    navHistory.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Toggle Nav
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        navHistory.classList.add('active');

        // Toggle Content
        document.querySelector('.stats-row').style.display = 'none';
        document.querySelector('.dashboard-grid').style.display = 'none';
        historyContent.style.display = 'block';

        loadHistory();
    });

    // Handle back to overview
    const navOverview = document.querySelector('.nav-item:first-child');
    if (navOverview) {
        navOverview.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navOverview.classList.add('active');
            
            document.querySelector('.stats-row').style.display = 'grid';
            document.querySelector('.dashboard-grid').style.display = 'grid';
            historyContent.style.display = 'none';
        });
    }
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !CONFIG.USE_MOCK) {
        window.location.href = 'login.html';
    }
    return token;
}

// --- Helper for Fetch with Auth ---
async function fetchAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    return fetch(url, { ...options, headers });
}

// --- 0. Agent Loader ---
async function loadAgents() {
    const list = document.getElementById('sidebar-agents');
    if (!list) return;

    try {
        let agents;
        if (CONFIG.USE_MOCK) {
            agents = [
                { name: 'Головний Агент', status: 'active' },
                { name: 'Lviv Scouting', status: 'active' },
                { name: 'Dev Hunter', status: 'stopped' }
            ];
        } else {
            const res = await fetchAuth(`${CONFIG.API_BASE_URL}/agents`);
            agents = await res.json();
        }

        list.innerHTML = '';
        agents.forEach(agent => {
            const item = document.createElement('div');
            item.className = 'nav-item';
            item.style.padding = '0.5rem 1rem';
            item.style.fontSize = '0.85rem';
            item.style.gap = '0.8rem';
            const isActive = agent.status === 'active';
            item.innerHTML = `
                <div class="badge-dot" style="background: ${isActive ? 'var(--success)' : 'var(--text-dim)'}; width: 8px; height: 8px; flex-shrink: 0;"></div>
                <span class="nav-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${agent.name}</span>
            `;
            list.appendChild(item);
        });
    } catch (e) {
        console.error("Failed to load agents", e);
    }
}

// --- 1. Stats Loader ---
async function loadStats() {
    try {
        let statsData;
        if (CONFIG.USE_MOCK) {
            statsData = [{ candidates_found: 42, hot_leads: 7, messages_analyzed: 1284, ads_posted: 12 }];
        } else {
            const res = await fetchAuth(`${CONFIG.API_BASE_URL}/stats`);
            statsData = await res.json();
        }
        
        if (statsData && statsData.length > 0) {
            const latest = statsData[0];
            const values = document.querySelectorAll('.stat-pill .value');
            if (values.length >= 3) {
                values[0].innerText = latest.messages_analyzed.toLocaleString();
                values[1].innerText = latest.candidates_found;
                values[2].innerText = latest.hot_leads;
            }
            initStatsAnimation();
        }
    } catch (e) {
        console.error("Failed to load stats", e);
        initStatsAnimation(); // run anyway for mock feel
    }
}

// --- 2. Candidate Loader ---
async function loadCandidates() {
    const table = document.querySelector('.candidate-table');
    if (!table) return;

    try {
        let candidates;
        if (CONFIG.USE_MOCK) {
            candidates = [
                { name: 'Олександр К.', username: 'alex_dev', score: 92, source: 'Djinni.co', dossier: 'React Developer with 5 years experience.' },
                { name: 'Марія Л.', username: 'maria_ui', score: 78, source: 'Telegram', dossier: 'UI/UX Designer specialized in mobile apps.' },
                { name: 'Ден М.', username: 'den_backend', score: 89, source: 'Work.ua', dossier: 'Node.js Backend expert.' }
            ];
        } else {
            const res = await fetchAuth(`${CONFIG.API_BASE_URL}/candidates?limit=5`);
            candidates = await res.json();
        }

        table.innerHTML = ''; 
        candidates.forEach(cand => {
            const row = document.createElement('tr');
            row.className = 'candidate-row';
            const isHot = cand.score >= 85;
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="avatar" style="background: var(--primary); color: #000;">${cand.name ? cand.name[0] : '?'}</div>
                        <div>
                            <div style="font-weight: 700;">${cand.name || 'Анонімний'}</div>
                            <div style="font-size: 0.8rem; color: var(--text-dim);">@${cand.username || 'н/д'} • ${cand.source}</div>
                        </div>
                    </div>
                </td>
                <td><span class="score-badge ${isHot ? 'score-high' : ''}">${isHot ? '🔥' : '✅'} ${cand.score}/100</span></td>
                <td><span style="font-size: 0.8rem; color: var(--text-dim);">${cand.source}</span></td>
                <td style="text-align: right;"><button class="btn btn-outline btn-nav" onclick="alert('${(cand.dossier || '').replace(/'/g, "\\'").substring(0, 100)}...')">Досьє</button></td>
            `;
            table.appendChild(row);
        });
    } catch (e) {
        console.error("Failed to load candidates", e);
    }
}

// --- 2.5. Vacancy Loader ---
async function loadVacancies() {
    const table = document.getElementById('vacancies-table');
    if (!table) return;

    try {
        let vacancies;
        if (CONFIG.USE_MOCK) {
            vacancies = [
                { title: 'Senior Python Engineer', company: 'SoftServe', salary: '$4500 - $6000', source: 'Djinni.co', match_score: 98, url: '#' }
            ];
        } else {
            const res = await fetchAuth(`${CONFIG.API_BASE_URL}/vacancies?limit=10`);
            vacancies = await res.json();
            if(!vacancies.length) {
                table.innerHTML = '<tr class="candidate-row"><td colspan="4" style="text-align:center;color:var(--text-dim);">Поки що немає знайдених вакансій. Зачекайте роботу ШІ...</td></tr>';
                return;
            }
        }

        table.innerHTML = ''; 
        vacancies.forEach(vac => {
            const row = document.createElement('tr');
            row.className = 'candidate-row';
            const isTopMatch = vac.match_score >= 90;
            const fallbackInitial = vac.company ? vac.company[0] : 'V';
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="avatar" style="background: linear-gradient(135deg, #00e5ff, #9d00ff);">${fallbackInitial}</div>
                        <div>
                            <div style="font-weight: 700;">${vac.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-dim);">${vac.company} • ${vac.salary}</div>
                        </div>
                    </div>
                </td>
                <td><span class="score-badge ${isTopMatch ? 'score-high' : ''}">${isTopMatch ? '🔥' : '✅'} ${vac.match_score}% Match</span></td>
                <td><span style="font-size: 0.8rem; color: var(--text-dim);">${vac.source}</span></td>
                <td style="text-align: right;"><a href="${vac.url}" target="_blank" class="btn btn-primary btn-nav">Відгукнутись</a></td>
            `;
            table.appendChild(row);
        });
    } catch (e) {
        console.error("Failed to load vacancies", e);
    }
}

// --- 3. Dashboard Terminal Simulation ---
function initDashboardTerminal(role = 'recruiter') {
    const terminal = document.getElementById('dashboard-terminal');
    if (!terminal) return;

    const recruiterLogs = [
        'Пошук у Telegram: "React Developer Lviv"',
        'Знайдено 5 нових повідомлень у групі "Lviv IT Jobs"',
        'Аналіз кандидата @alex_dev...',
        'Оцінка: 92/100. Знайдено гарячого ліда! 🔥',
        'Надсилання сповіщення власнику через Telegram...',
        'Моніторинг Work.ua: "Project Manager"',
        'Знайдено нову вакансію на Robota.ua',
        'Парсинг Djinni... 12 потенційних кандидатів',
        'Аналіз кандидата @maria_ui...',
        'Оцінка: 78/100. Додано в пул.',
        'Аналіз кандидата @den_backend...',
        'Оцінка: 89/100. Кандидат відповідає вимогам.',
        'Оновлення кампанії: "Senior React" (+2 нових ліда)',
        'Heartbeat: Статус системи OK. Скановано 1200+ профілів сьогодні.'
    ];

    const candidateLogs = [
        'Сканування Djinni: "Python Developer"',
        'Знайдено вакансію у SoftServe ($5000)',
        'Спроба метчингу з вашим резюме...',
        'Метч: 98%. Вакансія додана до списку.',
        'Моніторинг Work.ua: "Backend Engineer"',
        'ШІ аналізує опис вакансії GlobalLogic...',
        'Знайдено нову вакансію у Ciklum',
        'Порівняння навичок: Python, FastAPI ✔️',
        'ШІ генерує супровідний лист для MacPaw...',
        'Статус: 12 нових вакансій знайдено за сьогодні.'
    ];

    const logs = role === 'candidate' ? candidateLogs : recruiterLogs;
    
    let i = 0;
    function addLog() {
        if (terminal.children.length > 15) {
            terminal.removeChild(terminal.firstChild);
        }

        const entry = document.createElement('div');
        entry.className = 'term-entry';
        const ts = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="term-ts">[${ts}]</span> ${logs[i % logs.length]}`;
        terminal.appendChild(entry);
        terminal.scrollTop = terminal.scrollHeight;
        i++;
        setTimeout(addLog, 2000 + Math.random() * 3000);
    }
    
    for(let j=0; j<3; j++) {
        const entry = document.createElement('div');
        entry.className = 'term-entry';
        const ts = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="term-ts">[${ts}]</span> ${logs[j]}`;
        terminal.appendChild(entry);
        i++;
    }
    
    setTimeout(addLog, 2000);
}

// --- 4. History Loader ---
async function loadHistory() {
    const timeline = document.getElementById('history-timeline');
    if (!timeline) return;

    try {
        let history = [];
        if (CONFIG.USE_MOCK) {
            history = [
                { type: 'candidate', title: 'Знайдено кандидата: Олександр К.', time: '14:20', desc: 'React Developer (5 років), Djinni.co. Оцінка: 92/100', meta: '🔥 Hot Lead' },
                { type: 'vacancy', title: 'Знайдено вакансію: Senior Python', time: '13:45', desc: 'SoftServe, $5000. Відповідність: 98%', meta: 'Djinni.co' },
                { type: 'candidate', title: 'Знайдено кандидата: Марія Л.', time: '12:10', desc: 'UI/UX Designer, Telegram. Оцінка: 78/100', meta: 'Telegram' },
                { type: 'system', title: 'Запущено новий пошук', time: '10:00', desc: 'Агент розпочав сканування нових груп у Telegram.', meta: 'System' }
            ];
        } else {
            // Fetch real data and merge
            const [candRes, vacRes] = await Promise.all([
                fetchAuth(`${CONFIG.API_BASE_URL}/candidates?limit=20`),
                fetchAuth(`${CONFIG.API_BASE_URL}/vacancies?limit=20`)
            ]);
            
            const candidates = await candRes.json();
            const vacancies = await vacRes.json();
            
            // Merge and sort
            history = [
                ...candidates.map(c => ({ 
                    type: 'candidate', 
                    title: `Знайдено кандидата: ${c.name || 'Анонім'}`, 
                    time: new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    desc: `${c.dossier.substring(0, 100)}...`,
                    meta: `@${c.username || 'n/a'} • ${c.score}/100`,
                    raw_time: new Date(c.created_at)
                })),
                ...vacancies.map(v => ({
                    type: 'vacancy',
                    title: `Знайдено вакансію: ${v.title}`,
                    time: new Date(v.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    desc: `${v.company} - ${v.salary}. Джерело: ${v.source}`,
                    meta: `${v.match_score}% Match`,
                    raw_time: new Date(v.created_at)
                }))
            ].sort((a, b) => b.raw_time - a.raw_time);
        }

        if (history.length === 0) {
            timeline.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-dim);">Історія поки що порожня. Агент працює...</div>';
            return;
        }

        timeline.innerHTML = '';
        history.forEach((item, idx) => {
            const icon = item.type === 'candidate' ? '👥' : (item.type === 'vacancy' ? '💼' : '⚙️');
            const el = document.createElement('div');
            el.className = 'timeline-item';
            el.style.animationDelay = `${idx * 0.1}s`;
            el.innerHTML = `
                <div class="timeline-icon">${icon}</div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-time">${item.time}</div>
                    </div>
                    <div class="timeline-desc">${item.desc}</div>
                    <div class="timeline-meta">
                        <div class="meta-tag"><span>📍</span> ${item.meta}</div>
                    </div>
                </div>
            `;
            timeline.appendChild(el);
        });
    } catch (e) {
        console.error("Failed to load history", e);
        timeline.innerHTML = '<div style="text-align: center; padding: 3rem; color: #ff4d6d;">Помилка при завантаженні історії.</div>';
    }
}

// --- 5. Stats Progress Animation ---
function initStatsAnimation() {
    const bars = document.querySelectorAll('.stat-bar-fill');
    bars.forEach(bar => {
        const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+)%/)[1] + '%';
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 2s cubic-bezier(0.2, 0.8, 0.2, 1)';
            bar.style.width = targetWidth;
        }, 300);
    });
}
