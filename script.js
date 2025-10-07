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

// !!! ВРЕМЕННЫЙ ТЕСТ: АНИМАЦИЯ ПРИ ЗАГРУЗКЕ !!!
function setupTestAnimation() {
    console.log("TEST: Запуск тестовой анимации сетки через 2 секунды...");
    
    // Скрываем элементы, чтобы GSAP мог их показать
    gsap.set(".feature-item", { opacity: 0, y: 50 });
    
    // Анимация должна начаться через 2 секунды после загрузки страницы
    gsap.to(".feature-item", { 
        y: 0, 
        opacity: 1, 
        duration: 1.5, 
        stagger: 0.2,
        ease: "power2.out",
        delay: 2 // Начнется через 2 секунды
    });
    
    // Также проверяем анимацию текста, чтобы убедиться, что .pinned-content реагирует
    gsap.to(".pinned-content", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        delay: 2
    });
}


setupIntroAnimation();
// setupScrollAnimations(); // ОТКЛЮЧЕНО
setupTestAnimation(); // ВКЛЮЧЕНА ТЕСТОВАЯ АНИМАЦИЯ
