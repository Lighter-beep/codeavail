const snippetList = document.getElementById('snippetList');
const searchBar = document.getElementById('searchBar');
const tabBtns = document.querySelectorAll('.tab-btn');
const themeToggle = document.getElementById('themeToggle');
let allSnippets = [];
// --- 1. Load Data & Control Cinematic Loader ---
fetch('snippets.json')
    .then(res => res.json())
    .then(data => {
        allSnippets = data;
        renderSnippets(allSnippets);
        
        // BOSS: Wait for the typewriter and line animation to finish (approx 2.5s)
        setTimeout(() => {
            const loader = document.getElementById('loader-wrapper');
            if(loader) {
                // This adds the CSS class that slides the screen UP
                loader.classList.add('hide-up');
                
                // Remove it from the DOM entirely after the slide animation (0.8s)
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }
        }, 2500); 
    })
    .catch(err => {
        console.error("Boss, the system failed to boot:", err);
        const loader = document.getElementById('loader-wrapper');
        if(loader) loader.style.display = 'none'; 
    });

// --- 2. Render Snippets to UI ---
function renderSnippets(snippets) {
    snippetList.innerHTML = snippets.map(s => `
        <div class="card ${s.isWeb ? 'web-card' : ''}" data-cat="${s.category}">
            <span class="lang-tag">${s.category}</span>
            <button class="copy-btn" onclick="copyCode(this)">Copy</button>
            <h3>${s.title}</h3>
            ${s.isWeb ? `<div class="demo-box">${s.demo}</div>` : ''}
            <pre><code class="language-${s.language}">${s.code}</code></pre>
        </div>
    `).join('');
    
    // Refresh syntax highlighting
    Prism.highlightAll();
}

// --- 3. Search & Filter Logic ---
function filterSnippets() {
    const term = searchBar.value.toLowerCase();
    const activeCat = document.querySelector('.tab-btn.active').dataset.cat;

    const filtered = allSnippets.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(term);
        const matchesTab = activeCat === 'all' || s.category === activeCat;
        return matchesSearch && matchesTab;
    });
    renderSnippets(filtered);
}

searchBar.addEventListener('input', filterSnippets);

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterSnippets();
    });
});

// --- 4. Copy Function ----
window.copyCode = (btn) => {
    const code = btn.parentElement.querySelector('code').innerText;
    navigator.clipboard.writeText(code);
    const originalText = btn.innerText;
    btn.innerText = "COPIED!";
    btn.style.background = "#00ff88";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "var(--accent)";
    }, 2000);
};

// --- 5. Theme Toggle ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.innerText = isLight ? "[ DARK_MODE ]" : "[ LIGHT_MODE ]";
});