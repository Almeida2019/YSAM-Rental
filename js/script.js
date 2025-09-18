/**
 * YSAM Rental - Luxury Car Rental Website
 * Interactive JavaScript Functionality
 * Features: Carousel, Language Switching, Dark/Light Mode, Form Handling
 */

class YSAMRental {
    constructor() {
        this.currentSlide = 0;
        this.slides = null;
        this.indicators = null;
        this.autoSlideInterval = null;
        this.currentLang = 'pt';
        this.currentTheme = 'light';
        this.contactSection = null;
        this.contactFormContainer = null;
        this.contactFormOriginalParent = null;
        this.contactFormNextSibling = null;
        this.contactModal = null;
        this.contactModalContent = null;
        
        this.init();

        // Initialize EmailJS (replace 'YOUR_PUBLIC_KEY' with actual EmailJS public key)
        if (window.emailjs) {
            emailjs.init('YOUR_PUBLIC_KEY');
        }
    }

    init() {
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.initializeCarousel();
        this.initializeThemeToggle();
        this.initializeLanguageToggle();
        this.initializeNavigation();
        this.initializeScrollEffects();
        this.initializeContactForm();
        this.initializeContactModal();
        this.initializeGallery();
        this.initializeResponsiveMedia();
        this.initializeBackToTop();
        this.initializeSmoothScrolling();
        this.initializeFAQ();
        
        // Load saved preferences
        this.loadUserPreferences();
        
        // Initialize animations
        this.initializeAnimations();
    }

    /**
     * CAROUSEL FUNCTIONALITY
     */
    initializeCarousel() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        
        if (!this.slides.length || !this.indicators.length) return;

        // Navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch/swipe support for mobile
        this.initializeTouchSupport();

        // Auto-advance carousel
        this.startAutoSlide();

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    initializeTouchSupport() {
        const carousel = document.querySelector('.carousel-slides');
        if (!carousel) return;

        let startX = 0;
        let startY = 0;
        let deltaX = 0;
        let deltaY = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            deltaX = e.touches[0].clientX - startX;
            deltaY = e.touches[0].clientY - startY;
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
            
            startX = 0;
            startY = 0;
            deltaX = 0;
            deltaY = 0;
        }, { passive: true });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Update content for current language
        this.updateCarouselContent();
    }

    updateCarouselContent() {
        const activeSlide = this.slides[this.currentSlide];
        if (!activeSlide) return;

        // Trigger slide animation
        const slideContent = activeSlide.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.animation = 'none';
            slideContent.offsetHeight; // Trigger reflow
            slideContent.style.animation = 'slideUp 1s ease-out';
        }
    }

    startAutoSlide() {
        this.pauseAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    /**
     * THEME TOGGLE FUNCTIONALITY
     */
    initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        const logoImg = document.getElementById('logo-img');
        const footerLogoImg = document.getElementById('footer-logo-img');

        if (body.classList.contains('light-mode')) {
            // Switch to dark mode
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            
            // Update logo for dark mode
            if (logoImg) {
                logoImg.src = 'https://raw.githubusercontent.com/Almeida2019/images/main/YSAM%20Rental/YSAM%20Rental%20-%20For%20Dark%20Mode.webp';
            }
            if (footerLogoImg) {
                footerLogoImg.src = 'https://raw.githubusercontent.com/Almeida2019/images/main/YSAM%20Rental/YSAM%20Rental%20-%20For%20Dark%20Mode.webp';
            }
            
            this.currentTheme = 'dark';
        } else {
            // Switch to light mode
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            
            // Update logo for light mode
            if (logoImg) {
                logoImg.src = 'https://raw.githubusercontent.com/Almeida2019/images/main/YSAM%20Rental/YSAM%20Rental%20-%20For%20light%20Mode.webp';
            }
            if (footerLogoImg) {
                footerLogoImg.src = 'https://raw.githubusercontent.com/Almeida2019/images/main/YSAM%20Rental/YSAM%20Rental%20-%20For%20light%20Mode.webp';
            }
            
            this.currentTheme = 'light';
        }

        // Save theme preference
        localStorage.setItem('ysam-theme', this.currentTheme);
    }

    /**
     * LANGUAGE TOGGLE FUNCTIONALITY
     */
    initializeLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        if (!langToggle) return;

        langToggle.addEventListener('click', () => this.toggleLanguage());
    }

    toggleLanguage() {
        const body = document.body;
        const langText = document.querySelector('.lang-text');

        if (this.currentLang === 'pt') {
            // Switch to English
            this.currentLang = 'en';
            body.setAttribute('data-lang', 'en');
            if (langText) langText.textContent = 'PT';
        } else {
            // Switch to Portuguese
            this.currentLang = 'pt';
            body.setAttribute('data-lang', 'pt');
            if (langText) langText.textContent = 'EN';
        }

        // Update all text content
        this.updateLanguageContent();
        
        // Save language preference
        localStorage.setItem('ysam-language', this.currentLang);
    }

    updateLanguageContent() {
        const elementsWithLang = document.querySelectorAll('[data-pt][data-en]');
        
        elementsWithLang.forEach(element => {
            const ptText = element.getAttribute('data-pt');
            const enText = element.getAttribute('data-en');
            
            if (ptText && enText) {
                element.textContent = this.currentLang === 'pt' ? ptText : enText;
            }
        });

        // Update form placeholders and labels
        this.updateFormLanguage();
        
        // Update select options
        this.updateSelectOptions();

        // Update FAQ questions
        this.updateFAQLanguage();
    }

    updateFormLanguage() {
        const selectElements = document.querySelectorAll('select option[data-pt][data-en]');
        selectElements.forEach(option => {
            const ptText = option.getAttribute('data-pt');
            const enText = option.getAttribute('data-en');
            
            if (ptText && enText) {
                option.textContent = this.currentLang === 'pt' ? ptText : enText;
            }
        });
    }

    updateSelectOptions() {
        const locationSelect = document.getElementById('location');
        if (locationSelect) {
            const options = locationSelect.querySelectorAll('option[data-pt][data-en]');
            options.forEach(option => {
                const ptText = option.getAttribute('data-pt');
                const enText = option.getAttribute('data-en');
                
                if (ptText && enText) {
                    option.textContent = this.currentLang === 'pt' ? ptText : enText;
                }
            });
        }
    }

    updateFAQLanguage() {
        const faqQuestions = document.querySelectorAll('.faq-question span[data-pt][data-en]');
        faqQuestions.forEach(span => {
            const ptText = span.getAttribute('data-pt');
            const enText = span.getAttribute('data-en');
            if (ptText && enText) {
                span.textContent = this.currentLang === 'pt' ? ptText : enText;
            }
        });

        const faqAnswers = document.querySelectorAll('.faq-answer p[data-pt][data-en]');
        faqAnswers.forEach(p => {
            const ptText = p.getAttribute('data-pt');
            const enText = p.getAttribute('data-en');
            if (ptText && enText) {
                p.textContent = this.currentLang === 'pt' ? ptText : enText;
            }
        });
    }

    /**
     * FAQ FUNCTIONALITY
     */
    initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const faqAnswer = faqItem.querySelector('.faq-answer');
                const icon = question.querySelector('i');
                
                // Toggle active class
                faqItem.classList.toggle('active');
                faqAnswer.classList.toggle('active');
                question.classList.toggle('active');
                
                // Rotate icon
                if (icon) {
                    icon.style.transform = faqItem.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        });
    }

    /**
     * NAVIGATION FUNCTIONALITY
     */
    initializeNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            });
        });

        // Handle navbar scroll effect
        this.initializeNavbarScroll();
        
        // Active navigation highlighting
        this.initializeActiveNavigation();
    }

    initializeNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    initializeActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    /**
     * SCROLL EFFECTS AND ANIMATIONS
     */
    initializeScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatableElements = document.querySelectorAll(
            '.service-card, .pricing-card, .vehicle-showcase, .about-feature, .contact-item'
        );
        
        animatableElements.forEach(element => observer.observe(element));
    }

    animateElement(element) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated');
        
        if (element.classList.contains('service-card')) {
            element.classList.add('fade-in-up');
        } else if (element.classList.contains('vehicle-showcase')) {
            const isReverse = element.classList.contains('reverse');
            element.classList.add(isReverse ? 'fade-in-right' : 'fade-in-left');
        } else {
            element.classList.add('fade-in-up');
        }
    }

    initializeAnimations() {
        // Add CSS classes for animation
        const style = document.createElement('style');
        style.textContent = `
            .animated {
                animation-fill-mode: both;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * CONTACT FORM FUNCTIONALITY
     */
    initializeContactForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Form validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    initializeContactModal() {
        const contactSection = document.getElementById('contact');
        const contactFormContainer = contactSection ? contactSection.querySelector('.contact-form') : null;
        const modal = document.getElementById('contact-modal');
        const modalContent = modal ? modal.querySelector('#contact-modal-content') : null;

        if (!contactSection || !contactFormContainer || !modal || !modalContent) {
            return;
        }

        this.contactSection = contactSection;
        this.contactFormContainer = contactFormContainer;
        this.contactFormOriginalParent = contactFormContainer.parentNode;
        this.contactFormNextSibling = contactFormContainer.nextElementSibling;
        this.contactModal = modal;
        this.contactModalContent = modalContent;

        const contactTriggers = document.querySelectorAll(".cta-button[href='#contact'], .cta-float[href='#contact'], .pricing-btn[href='#contact']");
        contactTriggers.forEach(trigger => {
            trigger.addEventListener('click', (event) => this.handleContactTrigger(event), true);
        });

        const closeTriggers = modal.querySelectorAll('[data-modal-close]');
        closeTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => this.closeContactModal());
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.contactModal && this.contactModal.classList.contains('is-open')) {
                this.closeContactModal();
            }
        });
    }

    handleContactTrigger(event) {
        if (!this.contactSection) return;

        const shouldOpenModal = !this.isContactSectionVisible();

        if (shouldOpenModal) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.openContactModal();
        } else if (this.contactModal && this.contactModal.classList.contains('is-open')) {
            this.closeContactModal();
        }
    }

    isContactSectionVisible() {
        if (!this.contactSection) return false;

        const rect = this.contactSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        const verticallyVisible = rect.top < viewportHeight && rect.bottom > 0;
        const horizontallyVisible = rect.left < viewportWidth && rect.right > 0;

        return verticallyVisible && horizontallyVisible;
    }

    openContactModal() {
        if (!this.contactModal || !this.contactFormContainer || !this.contactModalContent) return;

        if (this.contactFormContainer.parentNode !== this.contactModalContent) {
            if (this.contactFormContainer.parentNode === this.contactFormOriginalParent) {
                this.contactFormNextSibling = this.contactFormContainer.nextElementSibling;
            }

            this.contactFormContainer.classList.add('contact-form--modal');
            this.contactModalContent.appendChild(this.contactFormContainer);
        }

        if (!this.contactModal.classList.contains('is-open')) {
            this.contactModal.classList.add('is-open');
            this.contactModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');

            const focusTarget = this.contactModal.querySelector('.contact-modal__close') || this.contactModal.querySelector('input, select, textarea, button');
            if (focusTarget) {
                focusTarget.focus();
            }
        }
    }

    closeContactModal() {
        if (!this.contactModal || !this.contactModal.classList.contains('is-open')) return;

        this.contactModal.classList.remove('is-open');
        this.contactModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        if (this.contactFormContainer && this.contactFormContainer.parentNode === this.contactModalContent) {
            this.contactFormContainer.classList.remove('contact-form--modal');
            if (this.contactFormOriginalParent) {
                this.contactFormOriginalParent.insertBefore(this.contactFormContainer, this.contactFormNextSibling || null);
            }
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (this.validateForm(form)) {
            this.submitForm(data);
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Additional date validation for pickup date
        const pickupDate = document.getElementById('pickup-date');
        if (pickupDate && pickupDate.value) {
            const pickupDateValue = new Date(pickupDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (pickupDateValue <= today) {
                this.showFieldError(pickupDate, this.currentLang === 'pt' ? 'A data de recolha deve ser futura.' : 'Pickup date must be in the future.');
                isValid = false;
            } else if (pickupDateValue > today) {
                this.clearFieldError(pickupDate);
            }
        }

        // Ensure return date is after pickup date
        const returnDate = document.getElementById('return-date');
        const pickupDateValue = pickupDate ? new Date(pickupDate.value) : null;
        if (returnDate && returnDate.value && pickupDateValue) {
            const returnDateValue = new Date(returnDate.value);

            if (returnDateValue <= pickupDateValue) {
                this.showFieldError(returnDate, this.currentLang === 'pt' ? 'A data de devolução deve ser após a data de recolha.' : 'Return date must be after pickup date.');
                isValid = false;
            } else {
                this.clearFieldError(returnDate);
            }
        }
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous errors
        this.clearFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            errorMessage = this.currentLang === 'pt' ? 'Este campo é obrigatório' : 'This field is required';
            isValid = false;
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = this.currentLang === 'pt' ? 'Email inválido' : 'Invalid email';
                isValid = false;
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(value)) {
                errorMessage = this.currentLang === 'pt' ? 'Telefone inválido' : 'Invalid phone number';
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async submitForm(data) {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        const form = document.getElementById('booking-form');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = this.currentLang === 'pt' ? 'Enviando...' : 'Sending...';
        
        try {
            // Send form data using EmailJS (replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual IDs from EmailJS dashboard)
            const result = await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form, 'YOUR_PUBLIC_KEY');
            
            // Show success message
            this.showNotification(
                this.currentLang === 'pt' 
                    ? 'Pedido enviado com sucesso! Entraremos em contacto em breve.'
                    : 'Request sent successfully! We will contact you soon.',
                'success'
            );
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('EmailJS error:', error);
            // Show error message
            this.showNotification(
                this.currentLang === 'pt' 
                    ? 'Erro ao enviar pedido. Tente novamente ou contacte-nos directamente.'
                    : 'Error sending request. Please try again or contact us directly.',
                'error'
            );
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));
        
        // Auto close after 5 seconds
        setTimeout(() => this.closeNotification(notification), 5000);
    }

    closeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    /**
     * GALLERY FUNCTIONALITY
     */
    initializeGallery() {
        // Add gallery functionality if needed
        const galleryThumbs = document.querySelectorAll('.thumb');
        
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active class from siblings
                const siblings = thumb.parentNode.querySelectorAll('.thumb');
                siblings.forEach(sibling => sibling.classList.remove('active'));
                
                // Add active class to clicked thumb
                thumb.classList.add('active');
            });
        });
    }

    /**
     * RESPONSIVE MEDIA LOADING
     */
    initializeResponsiveMedia() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const responsiveImages = document.querySelectorAll('[data-mobile-src]');
        const responsiveBackgrounds = document.querySelectorAll('[data-mobile-bg]');

        const sanitizeUrl = (value) => {
            if (!value) return '';
            const trimmed = value.trim();
            if (!trimmed) return '';
            return trimmed.replace(/^url\(['" ]?/, '').replace(/['" ]?\)$/, '');
        };

        const applySources = () => {
            const useMobile = mediaQuery.matches;

            responsiveImages.forEach(img => {
                const desktopSrc = img.dataset.desktopSrc || img.getAttribute('src');
                const mobileSrc = img.dataset.mobileSrc || desktopSrc;

                if (!img.dataset.desktopSrc && desktopSrc) {
                    img.dataset.desktopSrc = desktopSrc;
                }

                const targetSrc = useMobile ? mobileSrc : img.dataset.desktopSrc;

                if (targetSrc && img.getAttribute('src') !== targetSrc) {
                    img.setAttribute('src', targetSrc);
                }
            });

            responsiveBackgrounds.forEach(element => {
                const desktopBg = element.dataset.desktopBg || sanitizeUrl(element.style.backgroundImage);
                const mobileBg = element.dataset.mobileBg || desktopBg;

                if (!element.dataset.desktopBg && desktopBg) {
                    element.dataset.desktopBg = desktopBg;
                }

                const targetBg = useMobile ? mobileBg : element.dataset.desktopBg;

                if (targetBg) {
                    element.style.backgroundImage = `url("${targetBg}")`;
                }
            });
        };

        applySources();

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', applySources);
        } else if (typeof mediaQuery.addListener === 'function') {
            mediaQuery.addListener(applySources);
        }

        window.addEventListener('orientationchange', applySources);
        window.addEventListener('resize', this.debounce(applySources, 150));
        window.addEventListener('load', applySources);
    }

    /**
     * BACK TO TOP FUNCTIONALITY
     */
    initializeBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * SMOOTH SCROLLING
     */
    initializeSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"], button[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        const headerOffset = 80;
                        const elementPosition = targetElement.offsetTop;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * USER PREFERENCES
     */
    loadUserPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('ysam-theme');
        if (savedTheme && savedTheme !== this.currentTheme) {
            this.toggleTheme();
        }

        // Load language preference
        const savedLanguage = localStorage.getItem('ysam-language');
        if (savedLanguage && savedLanguage !== this.currentLang) {
            this.toggleLanguage();
        }
    }

    /**
     * UTILITY METHODS
     */
    debounce(func, wait) {
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
}

/**
 * GALLERY HELPER FUNCTIONS
 */
function changeMainImage(mainImageId, thumbElement) {
    const mainImg = document.getElementById(mainImageId);
    if (!mainImg || !thumbElement) return;

    const desktopSrc = thumbElement.dataset.desktopSrc || thumbElement.getAttribute('src');
    const mobileSrc = thumbElement.dataset.mobileSrc || desktopSrc;

    if (desktopSrc) {
        mainImg.dataset.desktopSrc = desktopSrc;
    }

    if (mobileSrc) {
        mainImg.dataset.mobileSrc = mobileSrc;
    }

    const useMobile = window.matchMedia('(max-width: 768px)').matches;
    const targetSrc = useMobile ? mobileSrc : desktopSrc;

    if (targetSrc && mainImg.getAttribute('src') !== targetSrc) {
        mainImg.setAttribute('src', targetSrc);
    }
}

/**
 * INITIALIZE APPLICATION
 */
// Initialize the application when DOM is ready
const ysam = new YSAMRental();

// Add error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
});

// Add performance monitoring
window.addEventListener('load', () => {
    // Log performance metrics
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
