/* ═══════════════════════════════════════════════════════════════
   TalentPulse AI — Dashboard Script
   ═══════════════════════════════════════════════════════════════ */

const CONFIG = {
    API_BASE_URL: 'https://zimburbels-recruiter-bot.hf.space/api', 
    USE_MOCK: false
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initDashboardTerminal();
    loadStats();
    loadCandidates();
    loadAgents();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !CONFIG.USE_MOCK) {
        window.location.href = 'login.html';
    }
    return token;
}

// ─── Helper for Fetch with Auth ───
async function fetchAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    return fetch(url, { ...options, headers });
}

// ─── 0. Agent Loader ───
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

// ─── 1. Stats Loader ───
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

// ─── 2. Candidate Loader ───
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
                            <div style="font-weight: 700;">${cand.name || 'Anonymous'}</div>
                            <div style="font-size: 0.8rem; color: var(--text-dim);">@${cand.username || 'n/a'} • ${cand.source}</div>
                        </div>
                    </div>
                </td>
                <td><span class="score-badge ${isHot ? 'score-high' : ''}">${isHot ? '🔥' : '✅'} ${cand.score}/100</span></td>
                <td><span style="font-size: 0.8rem; color: var(--text-dim);">${cand.source}</span></td>
                <td style="text-align: right;"><button class="btn btn-outline btn-nav" onclick="alert('${cand.dossier.replace(/'/g, "\\'").substring(0, 100)}...')">Досьє</button></td>
            `;
            table.appendChild(row);
        });
    } catch (e) {
        console.error("Failed to load candidates", e);
    }
}

// ─── 3. Dashboard Terminal Simulation ───
function initDashboardTerminal() {
    const terminal = document.getElementById('dashboard-terminal');
    if (!terminal) return;

    const logs = [
        'Searching Telegram: "React Developer Lviv"',
        'Found 5 new messages in Group "Lviv IT Jobs"',
        'Analyzing candidate @alex_dev...',
        'Score: 92/100. Hot Lead found! 🔥',
        'Sending notification to owner via Telegram...',
        'Monitoring Work.ua: "Project Manager"',
        'Found new vacancy on Robota.ua',
        'Scraping Djinni... 12 potential matches',
        'Analyzing candidate @maria_ui...',
        'Score: 78/100. Added to pool.',
        'Analyzing candidate @den_backend...',
        'Score: 89/100. Candidate matching requirements.',
        'Updating campaign: "Senior React" (+2 new leads)',
        'Heartbeat: Engine status OK. Scanned 1200+ profiles today.'
    ];
    
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

// ─── 4. Stats Progress Animation ───
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
