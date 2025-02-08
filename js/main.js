
function adjustSizes() {
    const header = document.querySelector("header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");

    // add scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // toggle mobile menu
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });

    // close menu when clicking a link (mobile view)
    document.querySelectorAll("nav ul li a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Dynamically set animation delays for feature cards
    const features = document.querySelectorAll('.feature');
    const baseDelay = 200; // Base delay in milliseconds between cards

    features.forEach((feature, index) => {
        // Calculate delay based on card position
        const delay = index * baseDelay;
        // Set delay as data attribute
        feature.setAttribute('data-delay', delay);
    });

    // Existing intersection observer for features
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });

    features.forEach((feature) => {
        featureObserver.observe(feature);
    });


    // intersection observer for image cards slide in from sides
    const imageCards = document.querySelectorAll('.image-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    imageCards.forEach((card) => {
        cardObserver.observe(card);
    });

    // adjustSizes()
});