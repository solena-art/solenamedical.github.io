/**
 * SOLENA Website JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    initNavbar();
    initAccessibility();
    detectLanguage();
    initLanguageDropdown();
    fixNavigationDisplay();
    initPDFViewer();
    
    // Wait for all resources to load before initializing Swiper
    window.addEventListener('load', function() {
        console.log('All resources loaded, initializing Swiper...');
        setTimeout(initReportSwiper, 500); // Give extra time for Swiper to be fully loaded
    });
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
    console.log('Attempting to initialize Report Swiper...');
    
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
        console.error('Swiper is not defined');
        setTimeout(initReportSwiper, 100); // Retry after 100ms
        return;
    }

    const swiperContainer = document.querySelector('.report-swiper');
    const swiperWrapper = document.querySelector('.report-swiper .swiper-wrapper');

    if (!swiperContainer) {
        console.error('Swiper container (.report-swiper) not found!');
        return;
    }

    if (!swiperWrapper) {
        console.error('Swiper wrapper (.report-swiper .swiper-wrapper) not found!');
        return;
    }

    // Make sure the container is visible
    swiperContainer.style.display = 'block';
    swiperContainer.style.visibility = 'visible';
    swiperContainer.style.opacity = '1';

    // Check if Swiper is already initialized
    if (swiperContainer.swiper) {
        console.log('Swiper already initialized, destroying previous instance');
        swiperContainer.swiper.destroy(true, true);
    }

    // Generate slides if wrapper is empty
    if (swiperWrapper.children.length === 0) {
        console.log('Generating Swiper slides...');
        let slidesHTML = '';
        for (let i = 1; i <= 53; i++) {
            slidesHTML += `
                <div class="swiper-slide">
                    <div class="report-slide-content">
                        <img class="swiper-lazy" 
                             data-src="assets/report/report-page-${String(i).padStart(2, '0')}.png" 
                             alt="Report Page ${i}"
                             loading="lazy">
                        <div class="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
                    </div>
                </div>
            `;
        }
        swiperWrapper.innerHTML = slidesHTML;
        console.log('Swiper slides generated');
    }

    try {
        // Initialize Swiper with required modules
        const reportSwiper = new Swiper(swiperContainer, {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            loop: false,
            preloadImages: false,
            lazy: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true
            },
            watchSlidesProgress: true,
            observer: true,
            observeParents: true,
            on: {
                init: function (swiper) {
                    console.log('Swiper initialized successfully');
                    calculateHeight(swiper.el);
                    updateNavigationVisibility(swiper);
                    swiper.update();
                },
                slideChange: function (swiper) {
                    console.log('Slide changed to:', swiper.activeIndex);
                },
                lazyImageLoad: function (swiper, slideEl, imageEl) {
                    console.log('Loading image:', imageEl.getAttribute('data-src'));
                },
                lazyImageReady: function (swiper, slideEl, imageEl) {
                    console.log('Image loaded:', imageEl.src);
                    imageEl.style.opacity = 1;
                }
            }
        });

        // Set initial height
        calculateHeight(swiperContainer);
        
        // Add resize handler
        window.addEventListener('resize', function() {
            calculateHeight(swiperContainer);
            if (reportSwiper && !reportSwiper.destroyed) {
                reportSwiper.update();
            }
        });

    } catch (error) {
        console.error('Error initializing Swiper:', error);
    }
}

function calculateHeight(swiperElement) {
    if (!swiperElement) return;
    
    const isMobile = window.innerWidth <= 768;
    const isSmallScreen = window.innerWidth <= 480;
    const offset = isSmallScreen ? 50 : isMobile ? 60 : 100;
    const minHeight = isSmallScreen ? 400 : isMobile ? 500 : 800;
    const maxHeight = isSmallScreen ? 700 : isMobile ? 800 : 1200;
    
    const height = Math.min(
        Math.max(window.innerHeight - offset, minHeight),
        maxHeight
    );
    
    swiperElement.style.height = `${height}px`;
    swiperElement.style.marginTop = `${offset}px`;
    console.log(`Swiper height set to: ${height}px`);
}

function updateNavigationVisibility(swiperInstance) {
    if (!swiperInstance || swiperInstance.destroyed) return;
    
    const isMobile = window.innerWidth <= 768;
    const nextBtn = swiperInstance.navigation.nextEl;
    const prevBtn = swiperInstance.navigation.prevEl;

    [nextBtn, prevBtn].forEach(button => {
        if (button) {
            button.style.display = 'flex';
            button.style.opacity = isMobile ? '0.7' : '1';
            button.style.width = isMobile ? '36px' : '40px';
            button.style.height = isMobile ? '36px' : '40px';
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

// PDF Viewer Controls
function initPDFViewer() {
    const pdfContainer = document.querySelector('.pdf-viewer-container');
    const pdfPagesWrapper = document.getElementById('pdfPagesWrapper');
    const pagePreviewWrapper = document.getElementById('pagePreviewWrapper');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const zoomLevel = document.querySelector('.zoom-level');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const currentPage = document.getElementById('currentPage');
    const totalPages = document.getElementById('totalPages');
    const fullscreen = document.getElementById('fullscreen');
    const download = document.getElementById('download');
    const mobilePrevPage = document.getElementById('mobilePrevPage');
    const mobileNextPage = document.getElementById('mobileNextPage');
    const mobileZoom = document.getElementById('mobileZoom');

    let currentZoom = 100;
    let isFullscreen = false;

    // Create PDF viewer iframe
    const pdfViewer = document.createElement('iframe');
    pdfViewer.src = 'images/Sample.pdf';
    pdfViewer.className = 'pdf-viewer';
    pdfViewer.title = 'Sample Report';
    pdfViewer.allowFullscreen = true;
    pdfViewer.loading = 'lazy';
    pdfViewer.setAttribute('aria-label', 'Sample market intelligence report');
    pdfViewer.setAttribute('role', 'document');
    
    // Replace the pages wrapper with the iframe
    pdfPagesWrapper.parentNode.replaceChild(pdfViewer, pdfPagesWrapper);

    // Zoom controls
    function updateZoom(zoom) {
        currentZoom = Math.max(50, Math.min(200, zoom));
        zoomLevel.textContent = `${currentZoom}%`;
        pdfViewer.style.transform = `scale(${currentZoom / 100})`;
        pdfViewer.style.transformOrigin = 'center top';
    }

    // Event listeners
    zoomIn?.addEventListener('click', () => updateZoom(currentZoom + 10));
    zoomOut?.addEventListener('click', () => updateZoom(currentZoom - 10));
    prevPage?.addEventListener('click', () => {
        const current = parseInt(currentPage.textContent);
        if (current > 1) {
            currentPage.textContent = current - 1;
            pdfViewer.contentWindow.postMessage({ type: 'page', page: current - 1 }, '*');
        }
    });
    nextPage?.addEventListener('click', () => {
        const current = parseInt(currentPage.textContent);
        const total = parseInt(totalPages.textContent);
        if (current < total) {
            currentPage.textContent = current + 1;
            pdfViewer.contentWindow.postMessage({ type: 'page', page: current + 1 }, '*');
        }
    });

    // Fullscreen toggle
    fullscreen?.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        pdfContainer.classList.toggle('fullscreen');
        fullscreen.querySelector('i').classList.toggle('fa-expand');
        fullscreen.querySelector('i').classList.toggle('fa-compress');
    });

    // Download PDF
    download?.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = 'images/Sample.pdf';
        link.download = 'Sample-Report.pdf';
        link.click();
    });

    // Mobile controls
    mobilePrevPage?.addEventListener('click', () => prevPage.click());
    mobileNextPage?.addEventListener('click', () => nextPage.click());
    mobileZoom?.addEventListener('click', () => {
        if (currentZoom === 100) {
            updateZoom(150);
        } else if (currentZoom === 150) {
            updateZoom(200);
        } else {
            updateZoom(100);
        }
    });

    // Handle PDF load
    pdfViewer.addEventListener('load', () => {
        // Get total pages from PDF
        pdfViewer.contentWindow.postMessage({ type: 'getTotalPages' }, '*');
    });

    // Listen for messages from PDF viewer
    window.addEventListener('message', (event) => {
        if (event.data.type === 'totalPages') {
            totalPages.textContent = event.data.total;
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevPage.click();
        } else if (e.key === 'ArrowRight') {
            nextPage.click();
        } else if (e.key === '+') {
            updateZoom(currentZoom + 10);
        } else if (e.key === '-') {
            updateZoom(currentZoom - 10);
        }
    });
} 