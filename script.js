// Cookie Notice
document.addEventListener('DOMContentLoaded', function() {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    // Check initial scroll position
    handleScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hero Slideshow
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    if (heroSlides.length > 0) {
        function showSlide(index) {
            heroSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % heroSlides.length;
            showSlide(currentSlide);
        }
        
        // Initialize first slide
        showSlide(0);
        
        // Auto-advance slideshow every 5 seconds
        setInterval(nextSlide, 5000);
    }

    // Reviews Carousel
    const reviewsCarousel = document.getElementById('reviewsCarousel');
    const reviewsPrev = document.getElementById('reviewsPrev');
    const reviewsNext = document.getElementById('reviewsNext');
    const reviewsDots = document.getElementById('reviewsDots');
    let currentReviewIndex = 0;
    
    if (reviewsCarousel) {
        const reviewCards = reviewsCarousel.querySelectorAll('.review-card');
        const totalReviews = reviewCards.length;
        
        function getReviewsPerView() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 2;
            return 3;
        }
        
        let reviewsPerView = getReviewsPerView();
        let totalGroups = Math.ceil(totalReviews / reviewsPerView);
        
        function updateDots() {
            if (reviewsDots) {
                reviewsDots.innerHTML = '';
                for (let i = 0; i < totalGroups; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'review-dot';
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToReviewGroup(i));
                    reviewsDots.appendChild(dot);
                }
            }
        }
        
        updateDots();
        
        // Update on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                reviewsPerView = getReviewsPerView();
                totalGroups = Math.ceil(totalReviews / reviewsPerView);
                currentReviewIndex = Math.min(currentReviewIndex, totalGroups - 1);
                updateDots();
                updateCarousel();
            }, 250);
        });
        
        function updateCarousel() {
            const firstCard = reviewCards[0];
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 20; // Include margin
                const scrollPosition = currentReviewIndex * cardWidth * reviewsPerView;
                reviewsCarousel.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            }
            
            // Update dots
            const dots = reviewsDots.querySelectorAll('.review-dot');
            const currentGroup = Math.floor(currentReviewIndex);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentGroup);
            });
        }
        
        function goToReviewGroup(groupIndex) {
            if (groupIndex < 0) {
                currentReviewIndex = totalGroups - 1;
            } else if (groupIndex >= totalGroups) {
                currentReviewIndex = 0;
            } else {
                currentReviewIndex = groupIndex;
            }
            updateCarousel();
        }
        
        function nextReview() {
            currentReviewIndex = (currentReviewIndex + 1) % totalGroups;
            updateCarousel();
        }
        
        function prevReview() {
            currentReviewIndex = (currentReviewIndex - 1 + totalGroups) % totalGroups;
            updateCarousel();
        }
        
        // Button event listeners
        if (reviewsNext) {
            reviewsNext.addEventListener('click', nextReview);
        }
        
        if (reviewsPrev) {
            reviewsPrev.addEventListener('click', prevReview);
        }
        
        // Auto-advance carousel every 6 seconds
        let autoAdvanceInterval = setInterval(nextReview, 6000);
        
        // Pause auto-advance on hover
        reviewsCarousel.addEventListener('mouseenter', () => {
            clearInterval(autoAdvanceInterval);
        });
        
        reviewsCarousel.addEventListener('mouseleave', () => {
            autoAdvanceInterval = setInterval(nextReview, 6000);
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        reviewsCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        reviewsCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextReview();
            }
            if (touchEndX > touchStartX + 50) {
                prevReview();
            }
        }
    }

    // Check if cookies were already accepted
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const cookieNotice = document.getElementById('cookieNotice');
    
    if (!cookiesAccepted && cookieNotice) {
        setTimeout(() => {
            cookieNotice.classList.add('show');
        }, 1000);
    }

    // Accept cookies button
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.classList.remove('show');
        });
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        const navbar = document.querySelector('.navbar');
        
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle menu-open class on navbar
            if (navbar) {
                navbar.classList.toggle('menu-open');
            }
            
            // Animate hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            mobileMenuToggle.classList.toggle('active');
            
            if (mobileMenuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                if (navbar) {
                    navbar.classList.remove('menu-open');
                }
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                if (navbar) {
                    navbar.classList.remove('menu-open');
                }
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            const files = formData.getAll('file');
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Prepare email content
            const subject = encodeURIComponent('Contact Form Submission from ' + name);
            const body = encodeURIComponent(
                'Name: ' + name + '\n\n' +
                'Email: ' + email + '\n\n' +
                'Message:\n' + message +
                (files.length > 0 ? '\n\nNote: Attachments cannot be sent via mailto. Please ask customer to email directly if files are needed.' : '')
            );
            const recipient = 'apluscarwash.detailing@gmail.com';
            
            // Open mailto link to send email
            const mailtoLink = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
            window.location.href = mailtoLink;
            
            // Show confirmation message
            setTimeout(() => {
                alert('Thank you for your message! Your email client should open. If it doesn\'t, please email us directly at ' + recipient);
            }, 500);
            
            // Reset form
            contactForm.reset();
            
            // Update file attachment count
            const fileInfo = contactForm.querySelector('.file-info');
            if (fileInfo) {
                fileInfo.textContent = 'Attachments (0)';
            }
        });

        // File input handling
        const fileInput = contactForm.querySelector('input[type="file"]');
        const fileInfo = contactForm.querySelector('.file-info');
        
        if (fileInput && fileInfo) {
            fileInput.addEventListener('change', function() {
                const fileCount = this.files.length;
                fileInfo.textContent = `Attachments (${fileCount})`;
            });
        }
    }

    // Shop item "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.shop-item .btn-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const shopItem = this.closest('.shop-item');
            const itemName = shopItem.querySelector('h3').textContent;
            alert(`"${itemName}" has been added to cart! (This is a demo - please contact us to place an order.)`);
        });
    });

    // Active navigation link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage || (currentPage === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Intersection Observer for fade-in animations (optional enhancement)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .shop-item, .photo-item, .info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Image Modal/Carousel Functionality
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const imageCounter = document.getElementById('imageCounter');
    const modalDots = document.querySelector('.modal-dots');
    const photoItems = document.querySelectorAll('.photo-item');
    
    let currentImageIndex = 0;
    const images = [];
    
    // Collect all image sources
    photoItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            images.push({
                src: img.src,
                alt: img.alt || `Detailing Photo ${index + 1}`
            });
        }
    });

    // Generate dots for navigation
    if (modalDots && images.length > 0) {
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'modal-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showImage(index));
            modalDots.appendChild(dot);
        });
    }

    // Function to show image in modal
    function showImage(index) {
        if (index < 0 || index >= images.length) return;
        
        currentImageIndex = index;
        const image = images[index];
        
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        imageCounter.textContent = `${index + 1} / ${images.length}`;
        
        // Update active dot
        const dots = modalDots.querySelectorAll('.modal-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Show modal
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to hide modal
    function hideModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Function to show next image
    function showNext() {
        const nextIndex = (currentImageIndex + 1) % images.length;
        showImage(nextIndex);
    }

    // Function to show previous image
    function showPrev() {
        const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(prevIndex);
    }

    // Open modal when clicking on photo items
    photoItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImage(index);
        });
    });

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }

    // Navigate with buttons
    if (modalPrev) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
    }

    // Close modal when clicking outside the image
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            hideModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!imageModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            hideModal();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });

    // Location Card Background Images on Hover - Change section background with fade
    const locationsSection = document.querySelector('.locations-section');
    const locationCards = document.querySelectorAll('.location-card[data-location-image]');
    let hoverTimeout = null;
    
    if (locationsSection && locationCards.length > 0) {
        locationCards.forEach(card => {
            const imageUrl = card.getAttribute('data-location-image');
            if (imageUrl) {
                card.addEventListener('mouseenter', function() {
                    // Clear any pending timeout
                    if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        hoverTimeout = null;
                    }
                    // Set the background image first
                    locationsSection.style.setProperty('--section-bg-image', `url('${imageUrl}')`);
                    // Then fade it in by adding the class
                    setTimeout(() => {
                        locationsSection.classList.add('has-bg');
                    }, 10);
                });
                
                card.addEventListener('mouseleave', function() {
                    // Wait 0.1s before reverting
                    hoverTimeout = setTimeout(() => {
                        // Fade out by removing the class
                        locationsSection.classList.remove('has-bg');
                        // Remove the background image after transition completes
                        setTimeout(() => {
                            if (!locationsSection.classList.contains('has-bg')) {
                                locationsSection.style.setProperty('--section-bg-image', 'none');
                            }
                        }, 300);
                        hoverTimeout = null;
                    }, 200);
                });
            }
        });
        
        // Initialize locations section animations on all pages (not just home page)
        const locationsSectionTitle = locationsSection.querySelector('.section-title');
        const locationsEyebrow = locationsSection.querySelector('.eyebrow-text');
        const locationsCards = locationsSection.querySelectorAll('.location-card');
        
        // Add animation classes
        if (locationsSectionTitle) {
            locationsSectionTitle.classList.add('fade-in-left');
        }
        if (locationsEyebrow) {
            locationsEyebrow.classList.add('fade-in-left');
        }
        locationsCards.forEach(card => {
            card.classList.add('fade-in');
        });
        
        // Set up intersection observer for locations section on all pages
        const ioOptions = {
            threshold: 0.25,
            rootMargin: '0px 0px -10% 0px'
        };
        
        const locationsIO = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                
                const el = entry.target;
                el.classList.add('is-visible');
                
                // If it's the section title, also reveal eyebrow and underline
                if (el === locationsSectionTitle && locationsEyebrow) {
                    setTimeout(() => {
                        locationsEyebrow.classList.add('is-visible');
                    }, 200);
                }
                
                observer.unobserve(el);
            });
        }, ioOptions);
        
        // Observe locations section elements
        if (locationsSectionTitle) {
            locationsIO.observe(locationsSectionTitle);
        }
        if (locationsEyebrow) {
            locationsIO.observe(locationsEyebrow);
        }
        locationsCards.forEach(card => {
            locationsIO.observe(card);
        });
    }

    // Initial animations for headings and images on the home page (triggered when in view)
    const isHomePage = document.body && document.body.contains(document.querySelector('.hero'));
    if (isHomePage) {
        // Headings and key text elements
        // Slide UP + fade for most headings
        const slideUpHeadingSelectors = [
            '.hero h1',
            '.hero .hero-subtitle',
            '.hero .btn-primary',
            '#about .section-title',
            '#about .about-text h3',
            '.contact-section .section-title'
        ];

        // Slide LEFT + fade for photos + locations headings
        const slideLeftHeadingSelectors = [
            '#photos .section-title',
            '.locations-section .section-title'
        ];

        // Slide RIGHT + fade for reviews heading
        const slideRightHeadingSelectors = [
            '#reviews .section-title'
        ];

        const slideUpHeadings = slideUpHeadingSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        const slideLeftHeadings = slideLeftHeadingSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        const slideRightHeadings = slideRightHeadingSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        // Main headings (hero h1, section titles, Our Mission)
        const mainHeadings = [
            '.hero h1',
            '#photos .section-title',
            '#reviews .section-title',
            '#about .section-title',
            '#about .about-text h3',
            '.locations-section .section-title',
            '.contact-section .section-title'
        ].map(sel => Array.from(document.querySelectorAll(sel))).flat();

        // Eyebrows associated with headings
        const eyebrowSelectors = [
            '.hero .eyebrow-text',
            '#photos .eyebrow-text',
            '#reviews .eyebrow-text',
            '#about .eyebrow-text',
            '.locations-section .eyebrow-text',
            '.contact-section .eyebrow-text'
        ];

        const eyebrowElements = eyebrowSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        // Apply initial directional classes to headings
        slideUpHeadings.forEach(el => {
            el.classList.add('fade-in-up');
        });

        slideLeftHeadings.forEach(el => {
            el.classList.add('fade-in-left');
        });

        slideRightHeadings.forEach(el => {
            el.classList.add('fade-in-right');
        });

        const headingElements = [...slideUpHeadings, ...slideLeftHeadings, ...slideRightHeadings];

        // Eyebrows associated with headings (directional fade)
        const slideUpEyebrowSelectors = [
            '.hero .eyebrow-text',
            '#about .eyebrow-text',
            '.contact-section .eyebrow-text'
        ];

        const slideLeftEyebrowSelectors = [
            '#photos .eyebrow-text',
            '.locations-section .eyebrow-text'
        ];

        const slideRightEyebrowSelectors = [
            '#reviews .eyebrow-text'
        ];

        const slideUpEyebrows = slideUpEyebrowSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        const slideLeftEyebrows = slideLeftEyebrowSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        const slideRightEyebrows = slideRightEyebrowSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        slideUpEyebrows.forEach(el => {
            el.classList.add('fade-in-up');
        });

        slideLeftEyebrows.forEach(el => {
            el.classList.add('fade-in-left');
        });

        slideRightEyebrows.forEach(el => {
            el.classList.add('fade-in-right');
        });

        // Images and cards that fade in
        const fadeSelectors = [
            '.photos-section .photo-item img',
            '.reviews-section .review-card',
            '.locations-section .location-card',
            '.contact-section .info-card'
        ];

        const fadeElements = fadeSelectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        fadeElements.forEach(el => {
            el.classList.add('fade-in');
        });

        // Use Intersection Observer so elements fade in when they come into view
        const ioOptions = {
            threshold: 0.25,
            rootMargin: '0px 0px -10% 0px'
        };

        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;

                const revealWithEyebrowAndUnderline = () => {
                    el.classList.add('is-visible');

                    const section = el.closest('section');
                    if (section) {
                        const eyebrow = section.querySelector('.eyebrow-text');

                        setTimeout(() => {
                            if (eyebrow) {
                                eyebrow.classList.add('is-visible');
                            }
                            if (el.classList.contains('section-title')) {
                                el.classList.add('underline-visible');
                            }
                        }, 150);
                    }
                };

                // If this is a main heading, reveal it first, then eyebrow + underline after delay
                if (mainHeadings.includes(el)) {
                    revealWithEyebrowAndUnderline();
                } else {
                    // Regular fade-in for other observed elements
                    el.classList.add('is-visible');
                }

                observer.unobserve(el);
            });
        }, ioOptions);

        const allObserved = [...headingElements, ...fadeElements];

        allObserved.forEach(el => {
            io.observe(el);
        });
        
        // Also handle background image fade-in for photos section when title becomes visible
        const photosSectionTitle = document.querySelector('#photos .section-title');
        if (photosSectionTitle) {
            const photosSection = photosSectionTitle.closest('.photos-section');
            
            // Watch for when the title becomes visible and fade in the background
            const titleObserver = new MutationObserver(() => {
                if (photosSectionTitle.classList.contains('is-visible') && photosSection) {
                    photosSection.classList.add('bg-fade-in');
                    titleObserver.disconnect(); // Stop observing once triggered
                }
            });
            
            titleObserver.observe(photosSectionTitle, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            // Also check immediately in case it's already visible
            if (photosSectionTitle.classList.contains('is-visible') && photosSection) {
                photosSection.classList.add('bg-fade-in');
            }
        }

        // Immediately handle elements already in view on initial page load
        // Use requestAnimationFrame to ensure elements are painted in hidden state first
        requestAnimationFrame(() => {
            allObserved.forEach(el => {
                const rect = el.getBoundingClientRect();
                const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
                if (!inView) return;

                // Force a reflow to ensure the element is painted in its hidden state
                void el.offsetHeight;

                if (mainHeadings.includes(el)) {
                    const section = el.closest('section');
                    const eyebrow = section ? section.querySelector('.eyebrow-text') : null;

                    // Small delay so the heading starts hidden, then animates in
                    setTimeout(() => {
                        el.classList.add('is-visible');

                        setTimeout(() => {
                            if (eyebrow) {
                                eyebrow.classList.add('is-visible');
                            }
                            if (el.classList.contains('section-title')) {
                                el.classList.add('underline-visible');
                            }
                        }, 150);
                    }, 50);
                } else {
                    el.classList.add('is-visible');
                }

                io.unobserve(el);
            });
        });
    }
});

