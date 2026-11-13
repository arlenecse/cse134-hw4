const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const storageKey = "theme";

function getTheme() {
    try {
        return localStorage.getItem(storageKey);

    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(storageKey, theme);
    } catch (error) {
        console.error("Error saving theme to localStorage:", error);
    }
}

function setTheme(theme) {
    root.dataset.theme = theme;

    const darkTheme = theme === "dark";


    themeToggle.setAttribute(
        "aria-label",
        darkTheme ? "Switch to light theme" : "Switch to dark theme"
    );
}

function changeTheme(theme) {
    if (
        !("startViewTransition" in document) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        setTheme(theme);
        return;
    }

    document.startViewTransition(() => {
        setTheme(theme);
    });
}

const savedTheme = getTheme();
const startingTheme = savedTheme === "dark" ? "dark" : "light";

setTheme(startingTheme);
themeToggle.hidden = false;

themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    changeTheme(nextTheme);
    saveTheme(nextTheme);
});