// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

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

document.addEventListener('DOMContentLoaded', () => {
    console.log('Jute B2B Showroom Initialized');

    // Mobile Menu Logic
    const hamburger = document.querySelector('#hamburger');
    const navLinks = document.querySelector('#nav-links');
    const navItems = document.querySelectorAll('#nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Enhanced Hero Animation
    const heroTl = gsap.timeline();
    heroTl.from('.hero-overlay', {
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        duration: 2,
        ease: 'power3.out'
    })
    .from('#hero h1', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out'
    }, "-=1.5");

    // Refined Hero Scroll Parallax
    const scrollHeroTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        }
    });

    scrollHeroTl
        .to('#hero h1', { 
            y: 200, 
            opacity: 0, 
            scale: 0.8, 
            filter: "blur(10px)",
            ease: "none" 
        }, 0);

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

            // Define displacement based on screen size
            const strapY = isDesktop ? -30 : -15;
            const strapX = isDesktop ? 40 : 20;
            const flapY = isDesktop ? -20 : -10;
            const bodyY = isDesktop ? 20 : 10;
            const flapZ = isDesktop ? 50 : 25;

            // Create Scroll-Triggered Timeline
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#products",
                    start: isDesktop ? "top top" : "top 40%", // Trigger earlier on mobile
                    end: isDesktop ? "+=2500" : "+=1000", // Provide more scroll room on mobile for the animation to play
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
                    markers: false
                }
            });

            // Add labels for snapping
            scrollTl.addLabel("start", 0);
            scrollTl.addLabel("deconstructed", 0.35);
            scrollTl.addLabel("end", 1);

            scrollTl
                // 1. Initial Delay: Show full bag (same absolute duration as before, roughly 25% of 2500)
                .to({}, { duration: 0.25 }) 
                
                // 2. Perform the snappy deconstruction (starts at 25%, ends at 35%)
                .to(baseImg, { opacity: 0, scale: 0.98, duration: 0.05 }, 0.25)
                .to([strap, flap, body], { opacity: 1, duration: 0.05 }, 0.25)
                .to(strap, { x: strapX, y: strapY, rotationZ: 2, duration: 0.1 }, 0.25)
                .to(flap, { y: flapY, z: flapZ, rotationX: -5, duration: 0.1 }, 0.25)
                .to(body, { y: bodyY, rotationX: 3, duration: 0.1 }, 0.25)
                
                // 3. Ultra-Extended Hold: Keep the deconstructed bag for the remaining 65%
                .to({}, { duration: 0.65 });

            return () => {
                if (scrollTl.scrollTrigger) scrollTl.scrollTrigger.kill();
                scrollTl.kill();
            };
        });
    }

    // Catalogue Parallax Effect
    gsap.to('.catalogue-img', {
        scrollTrigger: {
            trigger: '.catalogue-section',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: "20%",
        ease: "none"
    });
});
