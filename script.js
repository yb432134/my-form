// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loading);
    
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
            document.body.removeChild(loading);
        }, 500);
    }, 1500);

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Add scroll reveal to elements
    const revealElements = document.querySelectorAll('.service-card, .testimonial-card, .about-text, .about-image, .contact-content');
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });

    // Animated counters for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.replace(/\d+/, target);
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                }
            }, 30);
        });
    }

    // Trigger counter animation when stats come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Form handling
    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.experience) {
            errors.push('Please select your Arabic level');
        }
        
        if (errors.length > 0) {
            showErrorMessage(errors.join('<br>'));
            return false;
        }
        
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showSuccessMessage() {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '✅ Thank you! Your enquiry has been submitted successfully. We\'ll contact you within 24 hours.';
        
        form.appendChild(successMessage);
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 300);
        }, 5000);
    }

    function showErrorMessage(message) {
        const existingMessage = document.querySelector('.error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.cssText = `
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-top: 1rem;
            text-align: center;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        errorMessage.innerHTML = message;
        
        form.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.style.opacity = '1';
            errorMessage.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            errorMessage.style.opacity = '0';
            errorMessage.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (errorMessage.parentNode) {
                    errorMessage.parentNode.removeChild(errorMessage);
                }
            }, 300);
        }, 4000);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElement = document.querySelector('.hero::before');
        if (parallaxElement) {
            const speed = scrolled * 0.5;
            parallaxElement.style.transform = `translateY(${speed}px)`;
        }
    });

    // Add floating animation to Arabic calligraphy
    const arabicCalligraphy = document.querySelector('.arabic-calligraphy');
    if (arabicCalligraphy) {
        arabicCalligraphy.classList.add('floating');
    }

    // Testimonial carousel functionality (if needed in future)
    function initTestimonialCarousel() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        
        // Add carousel functionality here if more testimonials are added
    }

    // Add gradient text effect to certain elements
    const gradientTextElements = document.querySelectorAll('.highlight, .nav-logo h2');
    gradientTextElements.forEach(el => {
        el.classList.add('gradient-text');
    });

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click tracking for analytics (placeholder)
    function trackEvent(eventName, eventData) {
        // Placeholder for analytics tracking
        console.log('Event tracked:', eventName, eventData);
        
        // Example: Google Analytics tracking
        // gtag('event', eventName, eventData);
    }

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                button_location: this.closest('section')?.id || 'unknown'
            });
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Add focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        document.addEventListener('keydown', function(e) {
            const isTabPressed = e.key === 'Tab';

            if (!isTabPressed) return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // Initialize performance monitoring
    function initPerformanceMonitoring() {
        // Monitor page load time
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Track page load time
            trackEvent('page_load_time', {
                load_time: loadTime,
                page: window.location.pathname
            });
        });
    }

    initPerformanceMonitoring();

    // Add copy to clipboard functionality for contact info
    function addCopyToClipboard() {
        const copyButtons = document.querySelectorAll('[data-copy]');
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const textToCopy = this.getAttribute('data-copy');
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Show copy feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1000);
                });
            });
        });
    }

    addCopyToClipboard();

    // Add search functionality (if needed)
    function initSearch() {
        const searchInput = document.querySelector('#search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                // Implement search logic here
            });
        }
    }

    // Initialize all components
    initSearch();

    console.log('Arabic Institute website loaded successfully! 🎉');
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-based animations and effects
    const scrollTop = window.pageYOffset;
    
    // Update navbar
    if (scrollTop > 100) {
        document.querySelector('.navbar').classList.add('scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
    }
    
    // Update scroll progress indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add resize handler for responsive adjustments
const optimizedResizeHandler = debounce(function() {
    // Handle responsive adjustments
    const width = window.innerWidth;
    
    if (width > 768) {
        // Reset mobile menu state on desktop
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}, 250);

window.addEventListener('resize', optimizedResizeHandler);