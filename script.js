gsap.registerPlugin(ScrollTrigger);

// Плавное следование курсора (микроанимация)
document.addEventListener('mousemove', function(e) {
    gsap.to(".cursor-follower", {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Анимация при загрузке страницы (Timeline)
function setupIntroAnimation() {
    const tl = gsap.timeline({ defaults: { duration: 1.2, ease: "power3.out" } });

    tl.to(".hero-section", { backgroundColor: "#1c1c1c", duration: 1.5 })
      .fromTo(".scroll-down-indicator", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
      // Анимируем заголовок целиком (без SplitText)
      .fromTo(".main-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<") 
      .fromTo(".subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "-=0.6")
      .fromTo(".cta-button", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "-=0.4");
}

// Анимации при прокрутке (ScrollTrigger)
function setupScrollAnimations() {
    // 1. Анимация фона секций (меняем цвет по скроллу)
    document.querySelectorAll('section[data-bg-color]').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.to("body", { backgroundColor: section.dataset.bgColor, duration: 0.8 }),
            onLeaveBack: () => gsap.to("body", { backgroundColor: section.dataset.bgColor, duration: 0.8 }),
        });
    });

    // 2. Пиннинг секции и появление контента внутри нее
    ScrollTrigger.create({
        trigger: ".pinned-section",
        pin: true, 
        start: "top top", 
        end: "+=200%", 
    });

    // Появление заголовка и элементов сетки внутри пиннинговой секции
    gsap.from(".pinned-content", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".pinned-section",
            start: "top center",
            end: "top 20%",
            scrub: true,
        }
    });

    // Анимация появления элементов сетки
    gsap.from(".feature-item", {
        y: 50,
        opacity: 0,
        stagger: 0.3, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".feature-grid",
            start: "top 80%", 
            toggleActions: "play none none reverse", 
        }
    });


    // 3. Параллакс-эффект
    gsap.to(".parallax-section", {
        backgroundPositionY: "bottom", 
        ease: "none",
        scrollTrigger: {
            trigger: ".parallax-section",
            start: "top bottom", 
            end: "bottom top",   
            scrub: true,
        }
    });

    // Появление текста в параллакс-секции
    gsap.from(".parallax-title, .parallax-text", {
        y: 50,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".parallax-section",
            start: "top center",
            toggleActions: "play none none reverse",
        }
    });
}

// Запускаем все анимации
setupIntroAnimation();
setupScrollAnimations();
