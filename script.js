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

    // Эффект "разделения" текста для заголовка
    const mainTitle = new SplitText(".main-title", { type: "chars" });

    tl.to(".hero-section", { backgroundColor: "#1c1c1c", duration: 1.5 })
      .fromTo(".scroll-down-indicator", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
      .from(mainTitle.chars, { opacity: 0, y: 50, stagger: 0.05, duration: 0.8 }, "<") // Анимация каждой буквы
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
            // markers: true // Для отладки
        });
    });

    // 2. Пиннинг секции и появление контента внутри нее
    ScrollTrigger.create({
        trigger: ".pinned-section",
        pin: true, // "Приклеивает" секцию к окну
        start: "top top", // Начинается, когда верх секции достигает верха экрана
        end: "+=200%", // "Прилипнет" на высоту в 200% окна
        // markers: true // Для отладки
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
            // markers: true
        }
    });

    // Анимация появления элементов сетки
    gsap.from(".feature-item", {
        y: 50,
        opacity: 0,
        stagger: 0.3, // Появляются по очереди
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".feature-grid",
            start: "top 80%", // Когда сетка появляется на 80% от верха
            toggleActions: "play none none reverse", // Играть при входе, обратная анимация при выходе
            // markers: true
        }
    });


    // 3. Параллакс-эффект
    gsap.to(".parallax-section", {
        backgroundPositionY: "bottom", // Движение фона медленнее
        ease: "none",
        scrollTrigger: {
            trigger: ".parallax-section",
            start: "top bottom", // Начинаем, когда секция появляется снизу
            end: "bottom top",   // Заканчиваем, когда секция уходит наверх
            scrub: true,
            // markers: true
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
            // markers: true
        }
    });
}

// Запускаем все анимации
setupIntroAnimation();
setupScrollAnimations();
