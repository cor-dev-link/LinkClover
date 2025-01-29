document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark');
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Mega menu functionality
    const megaMenuTriggers = document.querySelectorAll('.mega-menu-trigger');
    const megaMenus = document.querySelectorAll('.mega-menu');
    const header = document.querySelector('header');

    let currentOpenMenu = null;
    let menuTimeout = null;

    function openMegaMenu(menuId) {
        if (currentOpenMenu) {
            currentOpenMenu.classList.remove('active');
        }
        const menu = document.getElementById(menuId);
        menu.classList.add('active');
        currentOpenMenu = menu;
        clearTimeout(menuTimeout);
    }

    function closeMegaMenu() {
        menuTimeout = setTimeout(() => {
            if (currentOpenMenu) {
                currentOpenMenu.classList.remove('active');
                currentOpenMenu = null;
            }
        }, 300); // Small delay to prevent immediate closure
    }

    megaMenuTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            const menuId = trigger.getAttribute('data-menu');
            openMegaMenu(menuId);
        });

        trigger.addEventListener('mouseleave', closeMegaMenu);
    });

    megaMenus.forEach(menu => {
        menu.addEventListener('mouseenter', () => {
            clearTimeout(menuTimeout);
        });

        menu.addEventListener('mouseleave', closeMegaMenu);
    });

    header.addEventListener('mouseleave', closeMegaMenu);

    // Pricing tabs functionality
    const tabs = document.querySelectorAll('.tab');
    const prices = document.querySelectorAll('.price');
    const annualPrices = ['$990/año', '$1990/año', '$4990/año'];
    const monthlyPrices = ['$99/mes', '$199/mes', '$499/mes'];

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (index === 0) { //Monthly
                prices.forEach((price, i) => {
                    price.textContent = monthlyPrices[i];
                });
            } else { //Annual
                prices.forEach((price, i) => {
                    price.textContent = annualPrices[i];
                });
            }
        });
    });

    // Clients carousel functionality
    const carousel = document.querySelector('.clients-carousel');
    const carouselInner = document.querySelector('.clients-grid');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let position = 0;
    const step = 200; // Adjust this value based on your logo width + margin

    function moveCarousel(direction) {
        const maxPosition = -(carouselInner.scrollWidth - carousel.clientWidth);
        if (direction === 'next') {
            position = Math.max(position - step, maxPosition);
        } else {
            position = Math.min(position + step, 0);
        }
        carouselInner.style.transform = `translateX(${position}px)`;
    }

    prevButton.addEventListener('click', () => moveCarousel('prev'));
    nextButton.addEventListener('click', () => moveCarousel('next'));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const fadeElems = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });

    // Form submission handling
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            console.log('Form submitted');
            // You could show a success message or redirect the user
        });
    }

    // Lazy loading images
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: "0px 0px 300px 0px"
    };

    const imageObserver = new IntersectionObserver(function(entries, imageObserver) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                preloadImage(entry.target);
                imageObserver.unobserve(entry.target);
            }
        });
    }, imageOptions);

    function preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) {
            return;
        }
        img.src = src;
    }

    images.forEach(image => {
        imageObserver.observe(image);
    });
});
