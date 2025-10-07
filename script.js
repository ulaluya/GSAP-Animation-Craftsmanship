gsap.registerPlugin(ScrollTrigger);

function setupTimeline() {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

    tl.to(".hero-section", { backgroundColor: "#003366", duration: 1.5 })
      .to(".main-title", { y: 0, opacity: 1, duration: 1 }, "-=1.0") 
      .to(".subtitle", { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
      .to(".cta-button", { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");
}

function setupScrollAnimation() {
    gsap.to(".scroll-box", {
        rotation: 360, 
        scale: 2,      
        borderRadius: "50%", 
        duration: 3,

        scrollTrigger: {
            trigger: ".scroll-section", 
            start: "top center", 
            end: "bottom top",   
            scrub: true,         
            markers: false       
        }
    });
}

setupTimeline();
setupScrollAnimation();
