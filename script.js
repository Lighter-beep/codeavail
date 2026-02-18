let activeCategory = "all";

const tabs = document.querySelectorAll(".tab-btn");
const cards = document.querySelectorAll(".card");
const searchBar = document.getElementById("searchBar");

// Category Filtering logic
tabs.forEach(btn => {
    btn.addEventListener("click", () => {
        tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.cat;
        applyFilters();
    });
});

// Search logic
if (searchBar) {
    searchBar.addEventListener("input", applyFilters);
}

function applyFilters() {
    const query = searchBar.value.toLowerCase();

    cards.forEach(card => {
        const matchCat = (activeCategory === "all" || card.dataset.cat === activeCategory);
        const matchSearch = card.dataset.search?.includes(query) || card.innerText.toLowerCase().includes(query);
        card.style.display = (matchCat && matchSearch) ? "block" : "none";
    });
}

// Clipboard Copy logic
document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const code = btn.parentElement.querySelector("code").innerText;

        navigator.clipboard.writeText(code)
            .then(() => {
                btn.innerText = "Copied!";
                setTimeout(() => btn.innerText = "Copy", 2000);
            })
            .catch(() => {
                alert("Clipboard failed.");
            });
    });
});

// Theme Toggle logic
const toggleBtn = document.getElementById("themeToggle");
let isLight = false;

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        isLight = !isLight;

        document.documentElement.style.setProperty("--bg", isLight ? "#ffffff" : "#0b0e14");
        document.documentElement.style.setProperty("--card", isLight ? "#f6f8fa" : "#151921");
        document.documentElement.style.setProperty("--border", isLight ? "#d0d7de" : "#2d333b");
        document.body.style.color = isLight ? "#24292f" : "#adbac7";

        toggleBtn.innerText = isLight ? "[ DARK_MODE ]" : "[ LIGHT_MODE ]";
    });
}