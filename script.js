gsap.registerPlugin(ScrollTrigger);

// ------------------------------------
// PIXI.JS: DYNAMIC PARTICLE BACKGROUND (СЛЕД КУРСОРА)
// ------------------------------------
const app = new PIXI.Application({
    // Получаем DOM-элемент по ID - теперь он точно существует!
    view: document.getElementById('pixi-canvas'), 
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0F0F0F, // Очень темный фон
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

const particles = [];
let mouse = { x: 0, y: 0 };
const particleCount = 1;

// Настройка системы частиц
function createParticle(x, y) {
    const particle = new PIXI.Graphics();
    const size = Math.random() * 5 + 3; 
    
    // Используем акцентные цвета (голубой или оранжевый/красный)
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
    
    // GSAP управляет исчезновением частицы
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

// Обновление частиц на каждый кадр
app.ticker.add(() => {
    // Генерируем частицы в позиции курсора
    for (let i = 0; i < particleCount; i++) {
        createParticle(mouse.x, mouse.y);
    }
    
    // Анимируем существующие частицы (смещение)
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.scale.x *= p.mass;
        p.scale.y *= p.mass;
    });
});

// Отслеживание позиции курсора
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Адаптивность Pixi.js
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});


// ------------------------------------
// GSAP: CONTENT ANIMATIONS
// ------------------------------------

function setupIntroAnimation() {
    const tl = gsap.timeline({ defaults: { duration: 1.2, ease: "power3.out" } });

    // Убираем смену фона, так как фон теперь Pixi.js
    tl.fromTo(".scroll-down-indicator", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
      .fromTo(".main-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<") 
      .fromTo(".subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "-=0.6")
      .fromTo(".cta-button", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "-=0.4");
}

function setupScrollAnimations() {
    
    // Меняем фон <body> на черный для лучшего эффекта
    gsap.to("body", { backgroundColor: '#0F0F0F', duration: 0.8 }); 

    // Пиннинг секции и появление контента внутри нее
    ScrollTrigger.create({
        trigger: ".pinned-section",
        pin: true, 
        start: "top top", 
        end: "+=200%", 
    });

    // Появление заголовка и элементов сетки 
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
}

// Запускаем все (т.к. скрипт в конце <body>, он сработает корректно)
setupIntroAnimation();
setupScrollAnimations();
