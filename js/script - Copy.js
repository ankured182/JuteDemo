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
                initSectionReveals(); 
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

    const headingTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    headingTl.fromTo('#hero h1', 
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: 'expo.out' }
    )
    .to({}, { duration: 2 })
    .to('#hero h1', {
        y: -50, opacity: 0, filter: "blur(10px)", duration: 1, ease: 'power2.in'
    });
}

function initSectionReveals() {
    // EXCLUDE #products from the batch reveal to handle it manually in its timeline
    const animatedRegions = document.querySelectorAll('#materials, #contact, .catalogue-section, footer');
    
    animatedRegions.forEach(region => {
        const revealItems = region.querySelectorAll('.eyebrow, h2, p, .feature-list li, .image-side, .contact-item, .catalogue-display, .section-header, .footer-brand, .link-group, .footer-bottom');
        
        if (revealItems.length > 0) {
            gsap.fromTo(revealItems, 
                { opacity: 0, y: 120, scale: 0.85, filter: "blur(25px)" },
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
                        start: "top 90%",
                        end: "bottom 10%",
                        toggleActions: "play reverse play reverse",
                    }
                }
            );
        }
    });

    const catImg = document.querySelector('.catalogue-img');
    if (catImg) {
        gsap.to(catImg, {
            scrollTrigger: {
                trigger: '.catalogue-display',
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            },
            y: "20%",
            scale: 1.15,
            ease: "none"
        });
    }
    ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('#hamburger');
    const navLinks = document.querySelector('#nav-links');
    const navItems = document.querySelectorAll('#nav-links li a');

    if (header) {
        lenis.on('scroll', (e) => {
            if (e.scroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

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
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        onComplete: () => {
                            if (targetId === "#products") {
                                const bagContainer = document.querySelector('#jutebag2-container');
                                if (bagContainer) {
                                    const baseImg = bagContainer.querySelector('.product-base');
                                    const parts = bagContainer.querySelectorAll('.exploded-layers img');
                                    gsap.set(baseImg, { opacity: 1, visibility: "visible", scale: 1 });
                                    gsap.set(parts, { opacity: 0, visibility: "hidden" });
                                }
                                ScrollTrigger.refresh();
                            }
                        }
                    });
                }
            });
        });
    }

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

    // JuteBag2 Interaction: Decoupled Pinning and Animation
    const bagContainer = document.querySelector('#jutebag2-container');
    if (bagContainer) {
        const baseImg = bagContainer.querySelector('.product-base');
        const strap = bagContainer.querySelector('.part-strap');
        const flap = bagContainer.querySelector('.part-flap');
        const body = bagContainer.querySelector('.part-body');
        const productHeader = document.querySelector('#products .section-header');
        const parts = [strap, flap, body];

        // Reset state immediately
        gsap.set(parts, { opacity: 0, visibility: "hidden" });
        gsap.set(baseImg, { opacity: 1, visibility: "visible" });
        gsap.set(productHeader, { opacity: 0, y: 50 }); // Prepare header for its own reveal

        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 769px)",
            isMobile: "(max-width: 768px)"
        }, (context) => {
            let { isDesktop } = context.conditions;

            const strapY = isDesktop ? -50 : -40;
            const strapX = isDesktop ? 60 : 45;
            const flapY = isDesktop ? -40 : -30;
            const bodyY = isDesktop ? 40 : 30;
            const flapZ = isDesktop ? 80 : 60;

            const totalDuration = isDesktop ? 2500 : 3500;

            // 1. PINNING TRIGGER
            ScrollTrigger.create({
                trigger: "#products",
                pin: true,
                start: "top top",
                end: `+=${totalDuration}`,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            });

            // 2. ANIMATION TIMELINE
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#products",
                    start: "top top",
                    end: `+=${totalDuration}`,
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // FORCE WHOLE STATE for the first 15%
                        if (self.progress < 0.15) {
                            gsap.set(baseImg, { opacity: 1, visibility: "visible" });
                            gsap.set(parts, { opacity: 0, visibility: "hidden" });
                        }
                    }
                }
            });

            scrollTl
                // A. Reveal the Header at the very start
                .to(productHeader, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
                
                // B. Buffer: Header is visible, Bag is whole
                .to({}, { duration: 1 }) 
                
                // C. The Deconstruction
                .to(baseImg, { opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.inOut" })
                .to(parts, { autoAlpha: 1, duration: 0.1, ease: "none" }, "<")
                .to(strap, { x: strapX, y: strapY, rotationZ: 5, duration: 0.5, ease: "power3.out" })
                .to(flap, { y: flapY, z: flapZ, rotationX: -10, duration: 0.5, ease: "power3.out" }, "<")
                .to(body, { y: bodyY, rotationX: 5, duration: 0.5, ease: "power3.out" }, "<")
                
                // D. Hold State (Header and Deconstructed Bag stay visible)
                .to({}, { duration: 1 }) 
                
                // E. Exit Animation: EVERYTHING fades out only at the end
                .to([productHeader, ...parts], { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" });

            return () => {
                ScrollTrigger.getAll().forEach(st => {
                    if (st.trigger === "#products") st.kill();
                });
                scrollTl.kill();
            };
        });
    }

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

    ScrollTrigger.refresh();
});
