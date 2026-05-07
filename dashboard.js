/* ═══════════════════════════════════════════════════════════════
   TalentPulse AI — Dashboard Script
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initDashboardTerminal();
    initStatsAnimation();
});

// ─── 1. Dashboard Terminal Simulation ───
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
        
        // Auto-scroll
        terminal.scrollTop = terminal.scrollHeight;
        
        i++;
        setTimeout(addLog, 2000 + Math.random() * 3000);
    }
    
    // Start with a few initial logs
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

// ─── 2. Stats Progress Animation ───
function initStatsAnimation() {
    const bars = document.querySelectorAll('.stat-bar-fill');
    bars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 2s cubic-bezier(0.2, 0.8, 0.2, 1)';
            bar.style.width = targetWidth;
        }, 300);
    });
}
