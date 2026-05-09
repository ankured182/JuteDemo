// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll Initialization
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.querySelector('#preloader');
    const video = document.querySelector('#hero-video');

    if (!preloader) return;

    const fadeOut = () => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                preloader.style.display = 'none';
                startHeroAnimation();
                initSectionReveals(); // Initialize reveals AFTER preloader is gone
            }
        });
    };

    if (video && video.readyState >= 3) {
        fadeOut();
    } else if (video) {
        video.addEventListener('canplay', fadeOut, { once: true });
    } else {
        fadeOut();
    }
});

function startHeroAnimation() {
    // Initial entrance for static elements
    const heroTl = gsap.timeline();
    heroTl.from('.logo-img', {
        opacity: 0,
        x: -20,
        duration: 1.2,
        ease: 'power3.out'
    })
    .from('.logo-text', {
        opacity: 0,
        x: -10,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.8")
    .from('.hero-overlay', {
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        duration: 2,
        ease: 'power3.out'
    }, "-=1");

    // Looping animation for the main heading
    const headingTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    
    // Animate In
    headingTl.fromTo('#hero h1', 
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: 'expo.out' }
    )
    // Hold for 2 seconds
    .to({}, { duration: 2 })
    // Animate Out
    .to('#hero h1', {
        y: -50, opacity: 0, filter: "blur(10px)", duration: 1, ease: 'power2.in'
    });
}

function initSectionReveals() {
    // Select ALL sections from products to catalogue, and now the FOOTER
    const animatedRegions = document.querySelectorAll('#products, #materials, #contact, .catalogue-section, footer');
    
    animatedRegions.forEach(region => {
        // Broaden the selector to catch everything inside the sections and footer
        const revealItems = region.querySelectorAll('.eyebrow, h2, p, .feature-list li, .image-side, .contact-item, .catalogue-display, .section-header, .footer-brand, .link-group, .footer-bottom');
        
        if (revealItems.length > 0) {
            gsap.fromTo(revealItems, 
                { 
                    opacity: 0, 
                    y: 120, 
                    scale: 0.85, 
                    filter: "blur(25px)" 
                },
                {
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1.8, 
                    stagger: 0.15,
                    ease: "expo.out", 
                    scrollTrigger: {
                        trigger: region,
                        start: "top 90%", // Trigger slightly later for the footer
                        end: "bottom 10%",
                        toggleActions: "play reverse play reverse",
                    }
                }
            );
        }
    });

    // 1.5x Stronger Parallax for the catalogue image
    const catImg = document.querySelector('.catalogue-img');
    if (catImg) {
        gsap.to(catImg, {
            scrollTrigger: {
                trigger: '.catalogue-display',
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            },
            y: "20%", // Increased parallax distance
            scale: 1.15, // Added scale swell
            ease: "none"
        });
    }

    // Final refresh to lock in triggers
    ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Jute B2B Showroom Initialized');

    // Select elements first to avoid ReferenceErrors
    const header = document.querySelector('header');
    const hamburger = document.querySelector('#hamburger');
    const navLinks = document.querySelector('#nav-links');
    const navItems = document.querySelectorAll('#nav-links li a');

    // Scroll-based Header Styling
    if (header) {
        lenis.on('scroll', (e) => {
            if (e.scroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Logo & Brand Text Scroll Animation
    gsap.to(['.logo-img', '.logo-text'], {
        scrollTrigger: {
            trigger: 'body',
            start: "top top",
            end: "100px",
            scrub: true
        },
        scale: 0.85,
        opacity: 0.9,
        filter: "brightness(1.1)",
        ease: "none"
    });

    // Nav Link Smooth Scroll
    if (navItems) {
        navItems.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    lenis.scrollTo(targetId, {
                        offset: 0,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            });
        });
    }

    // Mobile Menu Logic
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- INTERACTIVE MECHANICS (PINNING & PARALLAX) ---

    // Hero Scroll Parallax
    gsap.to('#hero h1', { 
        scrollTrigger: {
            trigger: '#hero',
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        },
        y: 200, 
        opacity: 0, 
        scale: 0.8, 
        filter: "blur(10px)",
        ease: "none" 
    });

    // JuteBag2 Scroll-Triggered Deconstruction
    const bagContainer = document.querySelector('#jutebag2-container');
    if (bagContainer) {
        const baseImg = bagContainer.querySelector('.product-base');
        const strap = bagContainer.querySelector('.part-strap');
        const flap = bagContainer.querySelector('.part-flap');
        const body = bagContainer.querySelector('.part-body');

        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 769px)",
            isMobile: "(max-width: 768px)"
        }, (context) => {
            let { isDesktop } = context.conditions;

            const strapY = isDesktop ? -30 : -15;
            const strapX = isDesktop ? 40 : 20;
            const flapY = isDesktop ? -20 : -10;
            const bodyY = isDesktop ? 20 : 10;
            const flapZ = isDesktop ? 50 : 25;

            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#products",
                    start: isDesktop ? "top top" : "top 40%", 
                    end: isDesktop ? "+=2500" : "+=1000", 
                    scrub: 1,
                    pin: isDesktop, 
                    pinSpacing: isDesktop,
                    anticipatePin: 1,
                    snap: isDesktop ? {
                        snapTo: "labels",
                        duration: { min: 0.2, max: 0.8 },
                        delay: 0.1,
                        ease: "power1.inOut"
                    } : null,
                }
            });

            scrollTl.addLabel("start", 0);
            scrollTl.addLabel("deconstructed", 0.35);
            scrollTl.addLabel("end", 1);

            scrollTl
                .to({}, { duration: 0.25 }) 
                .to(baseImg, { opacity: 0, scale: 0.98, duration: 0.05 }, 0.25)
                .to([strap, flap, body], { opacity: 1, duration: 0.05 }, 0.25)
                .to(strap, { x: strapX, y: strapY, rotationZ: 2, duration: 0.1 }, 0.25)
                .to(flap, { y: flapY, z: flapZ, rotationX: -5, duration: 0.1 }, 0.25)
                .to(body, { y: bodyY, rotationX: 3, duration: 0.1 }, 0.25)
                .to({}, { duration: 0.65 });

            return () => {
                if (scrollTl.scrollTrigger) scrollTl.scrollTrigger.kill();
                scrollTl.kill();
            };
        });
    }

    // --- UNIFIED SECTION REVEALS ---
    // (Removed from here, now in initSectionReveals() called after preloader)

    // Special parallax for catalogue image (keep separate)
    if (document.querySelector('.catalogue-img')) {
        gsap.to('.catalogue-img', {
            scrollTrigger: {
                trigger: '.catalogue-display',
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
            },
            y: "15%",
            ease: "none"
        });
    }

    // Final Refresh
    ScrollTrigger.refresh();
});
