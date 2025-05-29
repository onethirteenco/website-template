// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const getTheme = () => {
    try {
        return localStorage.getItem('theme') || 
            (prefersDarkScheme.matches ? 'dark' : 'light');
    } catch (e) {
        return 'dark'; // Fallback to dark theme if localStorage is not available
    }
};

const setTheme = (theme) => {
    try {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    } catch (e) {
        document.documentElement.setAttribute('data-theme', theme);
    }
};

setTheme(getTheme());

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

if (prefersDarkScheme) {
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Navigation scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav && window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else if (nav) {
        nav.classList.remove('scrolled');
    }
});

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('show');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('show');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('show');
            }
        });
    }
}); 