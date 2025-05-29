// Function to load a component
async function loadComponent(componentName) {
    try {
        // Get the base path by going up to the root
        const pathParts = window.location.pathname.split('/');
        const appsIndex = pathParts.indexOf('apps');
        const changelogIndex = pathParts.indexOf('changelog');
        let basePath = '/';
        
        if (appsIndex !== -1) {
            basePath = '../'.repeat(pathParts.length - appsIndex - 1);
        } else if (changelogIndex !== -1) {
            basePath = '../'.repeat(pathParts.length - changelogIndex - 1);
        }
        
        const response = await fetch(`${basePath}src/components/${componentName}.html`);
        if (!response.ok) {
            if (response.status === 404) {
                // Load 404 page if the component doesn't exist
                const notFoundResponse = await fetch(`${basePath}src/components/404.html`);
                if (notFoundResponse.ok) {
                    return await notFoundResponse.text();
                }
            }
            throw new Error(`Failed to load ${componentName}`);
        }
        const html = await response.text();
        return html;
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
        return '';
    }
}

// Function to load all components
async function loadComponents() {
    // Load navigation
    const navHtml = await loadComponent('nav');
    if (navHtml) {
        const navContainer = document.querySelector('.nav-placeholder');
        if (navContainer) {
            navContainer.innerHTML = navHtml;
            initializeNavigation();
        }
    }

    // Load footer
    const footerHtml = await loadComponent('footer');
    if (footerHtml) {
        const footerContainer = document.querySelector('.footer-placeholder');
        if (footerContainer) {
            footerContainer.innerHTML = footerHtml;
        }
    }
}

// Initialize navigation functionality
function initializeNavigation() {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to get current theme
    const getTheme = () => {
        try {
            return localStorage.getItem('theme') || 
                (prefersDarkScheme.matches ? 'dark' : 'light');
        } catch (e) {
            return 'dark'; // Fallback to dark theme if localStorage is not available
        }
    };

    // Function to set theme
    const setTheme = (theme) => {
        try {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        } catch (e) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    };

    // Apply the initial theme
    setTheme(getTheme());
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = getTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // Listen for system theme changes
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
}

function loadCommonHeader() {
    const commonHeader = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/svg+xml" href="/img/favicon/favicon.svg">
        <link rel="icon" type="image/x-icon" href="/img/favicon/favicon.ico">
        <link rel="icon" type="image/png" sizes="96x96" href="/img/favicon/favicon-96x96.png">
        <link rel="manifest" href="/img/favicon/site.webmanifest">
        <meta name="theme-color" content="#6680d8">
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    `;

    // Find the head element and insert the common header content
    const head = document.querySelector('head');
    if (head) {
        head.insertAdjacentHTML('afterbegin', commonHeader);
    }
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadCommonHeader();
    loadComponents();
}); 