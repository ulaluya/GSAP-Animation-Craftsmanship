gsap.registerPlugin(ScrollTrigger);

// ------------------------------------
// PIXI.JS: DYNAMIC PARTICLE BACKGROUND (СЛЕД КУРСОРА)
// ------------------------------------

// Получаем DOM-элемент контейнера
const pixiCanvasContainer = document.getElementById('pixi-canvas');

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0F0F0F, // Очень темный фон
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

// Добавляем созданный PIXI.js canvas в ваш div-контейнер
if (pixiCanvasContainer) {
    pixiCanvasContainer.appendChild(app.view);
} else {
    console.error("PIXI.js: Контейнер #pixi-canvas не найден.");
}


const particles = [];
let mouse = { x: 0, y: 0 };
const particleCount = 1;

// Настройка системы частиц
function createParticle(x, y) {
    const particle = new PIXI.Graphics();
    const size = Math.random() * 5 + 3; 
    
    const color = Math.random() > 0.5 ? 0x00bcd4 : 0xff5722; 
    
    particle.beginFill(color); 
    particle.drawCircle(0, 0, size);
    particle.endFill();

    particle.x = x;
    particle.y = y;
    particle.vx = (Math.random() - 0.5) * 0.5;
    particle.vy = (Math.random() - 0.5) * 0.5;
    particle.alpha = 0.8;
    particle.mass = 0.98;
    
    gsap.to(particle, {
        alpha: 0,
        duration: Math.random() * 2 + 1, 
        ease: "power1.out",
        onComplete: () => {
            app.stage.removeChild(particle);
            particles.splice(particles.indexOf(particle), 1);
            particle.destroy();
        }
    });

    app.stage.addChild(particle);
    particles.push(particle);
}

// Цикл рендера
app.ticker.add(() => {
    for (let i = 0; i < particleCount; i++) {
        createParticle(mouse.x, mouse.y);
    }
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.scale.x *= p.mass;
        p.scale.y *= p.mass;
    });
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    // Также обновляем ScrollTrigger при изменении размера окна
    ScrollTrigger.refresh();
});


// ------------------------------------
// GSAP: CONTENT ANIMATIONS
// ------------------------------------

function setupIntroAnimation() {
    const tl = gsap.timeline({ defaults: { duration: 1.2, ease: "power3.out" } });

    tl.fromTo(".scroll-down-indicator", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
      .fromTo(".main-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<") 
      .fromTo(".subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "-=0.6")
      .fromTo(".cta-button", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "-=0.4");
}

function setupScrollAnimations() {
    
    // 1. Анимация ПИННИНГА (Секция Искусство) - ВАША ОРИГИНАЛЬНАЯ ЛОГИКА
    ScrollTrigger.create({
        trigger: ".pinned-section",
        pin: true, 
        start: "top top", 
        end: "+=200%", 
        markers: true // Оставляем маркеры для отладки
    });
    
    // 2. Анимация появления контента внутри пиннинга
    gsap.from(".pinned-content", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".pinned-section",
            start: "top center", // Начинаем, когда секция доходит до центра экрана
            end: "top 20%",
            scrub: true,
        }
    });

    // 3. Анимация появления элементов сетки (stagger)
    gsap.fromTo(".feature-item", 
        { y: 50, opacity: 0 }, // Начальное состояние
        {
            y: 0,           // Конечное состояние
            opacity: 1,     // Конечное состояние
            stagger: 0.3, 
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".feature-grid", // Триггером является feature-grid
                start: "top 80%",          // Когда верх feature-grid дойдет до 80% снизу экрана
                toggleActions: "play none none reverse", 
                markers: true         
            }
        }
    );

    // --- ДОБАВЛЕННЫЕ УЛУЧШЕНИЯ И ИСПРАВЛЕНИЯ КОНФЛИКТОВ ---

    // 4. ПАРАЛЛАКС ФОНА PIXI.js (Для более надежной работы скролла)
    gsap.to("#pixi-canvas", {
        y: () => -document.body.offsetHeight * 0.1, // Смещаем на 10% от высоты тела
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });

    // 5. СМЕНА ЦВЕТА ФОНА BODY (с темного на светлый и обратно)
    ScrollTrigger.create({
        trigger: ".pinned-section",
        start: "top center",
        onEnter: () => gsap.to("body", { backgroundColor: "#F2F2F2", duration: 0.5 }),
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#0F0F0F", duration: 0.5 }),
    });

    ScrollTrigger.create({
        trigger: ".footer-section",
        start: "top bottom", // Когда футер появляется
        onEnter: () => gsap.to("body", { backgroundColor: "#0F0F0F", duration: 0.5 }),
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#F2F2F2", duration: 0.5 }),
    });
}

// Запускаем все анимации после полной загрузки (это было исправлением)
window.addEventListener('load', () => {
    setupIntroAnimation();
    setupScrollAnimations();

    // После загрузки всего контента пересчитываем позиции
    ScrollTrigger.refresh();
});
