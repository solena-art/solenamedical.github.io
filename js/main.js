/**
 * SOLENA Website JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavbar();
    initAccessibility();
    detectLanguage();
    initLanguageDropdown();
    fixNavigationDisplay();
    initReportSwiper();
});

/**
 * Navbar functionality
 */
function initNavbar() {
    // Add active class to current page nav item
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

/**
 * Accessibility enhancements
 */
function initAccessibility() {
    // Add focus outlines for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-user');
    });

    // Add aria-current to active navigation items
    const activeLinks = document.querySelectorAll('.nav-link.active');
    activeLinks.forEach(link => {
        link.setAttribute('aria-current', 'page');
    });
}

/**
 * Language detection and suggestion
 */
function detectLanguage() {
    // Get browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const currentLang = document.documentElement.lang;
    
    // Check if we should suggest a different language
    if (browserLang.startsWith('ko') && currentLang !== 'ko') {
        suggestLanguage('ko');
    } else if (browserLang.startsWith('ja') && currentLang !== 'ja') {
        suggestLanguage('ja');
    } else if (browserLang.startsWith('de') && currentLang !== 'de') {
        suggestLanguage('de');
    }
}

/**
 * Suggest a language switch to the user
 */
function suggestLanguage(lang) {
    const langMap = {
        'ko': { name: 'Korean', url: 'ko/index.html' },
        'ja': { name: 'Japanese', url: 'ja/index.html' },
        'de': { name: 'German', url: 'de/index.html' }
    };

    // Check if we've already shown this suggestion
    if (sessionStorage.getItem('lang_suggested')) {
        return;
    }

    // Create language suggestion element
    const suggestion = document.createElement('div');
    suggestion.className = 'lang-suggestion';
    suggestion.innerHTML = `
        <div class="lang-suggestion-content">
            <p>Would you prefer to view this site in ${langMap[lang].name}?</p>
            <div class="lang-suggestion-buttons">
                <a href="${langMap[lang].url}" class="btn btn-sm btn-primary">Yes, switch language</a>
                <button class="btn btn-sm btn-outline-secondary dismiss-suggestion">No, continue in English</button>
            </div>
        </div>
    `;

    // Add to document
    document.body.appendChild(suggestion);
    
    // Show with animation
    setTimeout(() => {
        suggestion.classList.add('show');
    }, 1500);

    // Dismiss button functionality
    suggestion.querySelector('.dismiss-suggestion').addEventListener('click', function() {
        suggestion.classList.remove('show');
        setTimeout(() => {
            suggestion.remove();
        }, 300);
        sessionStorage.setItem('lang_suggested', 'true');
    });
}

/**
 * Form validation enhancement
 */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            markInvalid(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            markInvalid(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            markValid(input);
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

function markInvalid(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    // Add or update feedback message
    let feedback = input.nextElementSibling;
    if (!feedback || !feedback.classList.contains('form-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback invalid';
        input.parentNode.insertBefore(feedback, input.nextSibling);
    }
    feedback.textContent = message;
    feedback.className = 'form-feedback invalid';
}

function markValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    
    // Remove or update feedback
    let feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('form-feedback')) {
        feedback.className = 'form-feedback valid';
        feedback.textContent = 'Looks good!';
    }
}

// Add CSS for language suggestion
const style = document.createElement('style');
style.textContent = `
.lang-suggestion {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.15);
    padding: 15px 20px;
    z-index: 1060;
    transition: bottom 0.3s ease;
    width: 90%;
    max-width: 400px;
}

.lang-suggestion.show {
    bottom: 20px;
}

.lang-suggestion-content {
    text-align: center;
}

.lang-suggestion-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.keyboard-user a:focus, 
.keyboard-user button:focus, 
.keyboard-user input:focus, 
.keyboard-user select:focus, 
.keyboard-user textarea:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.navbar-scrolled {
    padding: 0.5rem 0 !important;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1) !important;
}
`;
document.head.appendChild(style);

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll to top functionality
const scrollToTopButton = document.querySelector('.scroll-to-top');

if (scrollToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add animation to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Adjust animation threshold for mobile
        const isMobile = window.innerWidth <= 768;
        const threshold = isMobile ? 50 : 150;

        if (elementTop < window.innerHeight - threshold && elementBottom > 0) {
            element.classList.add('active');
        }
    });
}

// Optimize scroll animations for mobile
function optimizeForMobile() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Get all animation elements
    const animatedElements = document.querySelectorAll('.reveal, .fade-in');
    
    if (isMobile) {
        // Reduce animation distance on mobile
        document.documentElement.style.setProperty('--animation-distance', '15px');
        
        // Disable some animations on very small screens for performance
        if (window.innerWidth <= 480) {
            const lessImportantAnimations = document.querySelectorAll('.card:not(:first-child) .reveal');
            lessImportantAnimations.forEach(el => {
                el.classList.add('active');
            });
        }
    } else {
        document.documentElement.style.setProperty('--animation-distance', '30px');
    }
}

// Run optimization on load and resize
window.addEventListener('load', optimizeForMobile);
window.addEventListener('resize', optimizeForMobile);

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm('contactForm')) {
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success mt-3';
                successMessage.textContent = 'Thank you for your message. We will get back to you soon!';
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger mt-3';
            errorMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
            contactForm.appendChild(errorMessage);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

/**
 * Initialize report swiper
 */
function initReportSwiper() {
    const reportSwiper = document.querySelector('.report-swiper');
    if (!reportSwiper) return;

    const isMobile = window.innerWidth <= 768;
    
    const calculateHeight = () => {
        const viewportHeight = window.innerHeight;
        const offset = isMobile ? 250 : 400;
        const height = Math.min(
            Math.max(viewportHeight - offset, isMobile ? 350 : 500),
            isMobile ? 500 : 800
        );
        reportSwiper.style.height = `${height}px`;
    };

    // Initial height calculation
    calculateHeight();

    const swiper = new Swiper(reportSwiper, {
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        loop: false,
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2,
            loadOnTransitionStart: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: isMobile
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        touchRatio: 1,
        touchAngle: 45,
        resistance: true,
        resistanceRatio: 0.85,
        watchSlidesProgress: true,
        preventInteractionOnTransition: true,
        on: {
            init: function() {
                calculateHeight();
                this.slides.forEach(slide => {
                    const img = slide.querySelector('img');
                    if (img) {
                        img.style.opacity = '1';
                    }
                });
            },
            slideChange: function() {
                this.slides.forEach(slide => {
                    const img = slide.querySelector('img');
                    if (img) {
                        img.style.opacity = '1';
                    }
                });
            },
            touchStart: function() {
                this.slides.forEach(slide => {
                    const img = slide.querySelector('img');
                    if (img) {
                        img.style.transition = 'none';
                    }
                });
            },
            touchEnd: function() {
                this.slides.forEach(slide => {
                    const img = slide.querySelector('img');
                    if (img) {
                        img.style.transition = 'opacity 0.3s ease';
                    }
                });
            }
        }
    });

    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateHeight();
            swiper.update();
        }, 250);
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (swiper) {
            swiper.destroy(true, true);
        }
    });
}

/**
 * Language dropdown functionality
 */
function initLanguageDropdown() {
    const languageToggle = document.querySelector('.language-toggle');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageContent = document.querySelector('.language-dropdown-content');

    if (languageToggle && languageDropdown && languageContent) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
            languageContent.style.display = languageDropdown.classList.contains('show') ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('show');
                languageContent.style.display = 'none';
            }
        });
    }
}

/**
 * Fix navigation display issues
 */
function fixNavigationDisplay() {
    // Force navbar display
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        navbarCollapse.style.display = 'flex';
    }
    
    // Force nav items to display properly
    const navbarItems = document.querySelectorAll('.navbar-nav');
    navbarItems.forEach(nav => {
        nav.style.display = 'flex';
    });
    
    // Ensure nav items are styled correctly
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.style.display = 'block';
    });
} 