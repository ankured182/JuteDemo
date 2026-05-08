# Project Context: Premium B2B Jute Showroom

## 1. Core Architectural Vision
This project is a high-end, "Apple-style" B2B digital showroom targeting environment-conscious corporate buyers in the US and Europe. The aesthetic is strictly "Dark Mode" minimalism. It must feel like a premium SaaS or tech hardware landing page, not a standard e-commerce site. 

## 2. The Tech Stack (Strict Constraints)
- **Frontend:** Vanilla JS, HTML5, CSS3.
- **Animation Engine:** GSAP (GreenSock) core + ScrollTrigger.
- **Prohibited:** No React, No Vue, No jQuery, No heavy frontend frameworks. Keep the DOM lightweight and the dependency tree flat.

## 3. UI/UX Guidelines
- **Color Palette:** Deep matte charcoal/black backgrounds (`#050505` to `#000000`). Text is high-contrast white/off-white (`#f5f5f7`). Accent colors should be subtle, sophisticated eco-greens.
- **Navigation:** Sticky top navigation with glassmorphism (`backdrop-filter: blur(20px); background: rgba(0,0,0,0.5);`).
- **Typography:** Clean, modern sans-serif (e.g., Inter, SF Pro, or Helvetica Neue). Font weights should be used deliberately to establish a clear information hierarchy.
- **Transitions:** All animations must use premium easing curves (e.g., `ease: "expo.out"` or `ease: "power3.out"` in GSAP). No linear or cheap-feeling bounces.

## 4. Key Interactive Mechanics
- **The Hero Section:** Features a seamless background video (generated via Google Flow) showing a cinematic transition from a pristine factory line to global shipping.
- **The Product Grid:** Features 3 distinct jute bags. 
- **The "Exploded View" Hover:** On `mouseenter`, the bag smoothly deconstructs into 3 transparent layers (Handles, Body, Side Panel) using GSAP to slide the `Y` and `X` axes. On `mouseleave`, it sharply reverses back to the base image. There must be zero lag during this interaction.

## 5. Asset Hierarchy Reference
When writing code that references assets, assume the following directory structure:
- Background Video: `/assets/video/hero_factory_flow.mp4`
- Product Base Images: `/assets/products/bag_[1-3]_clean.png`
- Product Exploded Layers: `/assets/products/bag_[1-3]_exploded.png`

## 6. Code Quality Standards
- Write modular, heavily commented Vanilla JS.
- Use CSS Custom Properties (variables) for theme management.
- Maintain a clean separation of concerns: HTML for structure, CSS for static styling, JS for logic and GSAP animation states.