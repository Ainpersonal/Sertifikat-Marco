/* ============================================================
   CERTIFICATE PAGE - BRUTAL ANIMATION JS
   ============================================================ */

// ── 1. PARTICLE SYSTEM ────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = -Math.random() * 0.8 - 0.2;
        this.alpha = Math.random() * 0.6 + 0.1;
        this.color = ['#00ffe1', '#ff2d78', '#ffe600', '#ffffff'][Math.floor(Math.random() * 4)];
        this.life = 1;
        this.decay = Math.random() * 0.004 + 0.001;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha * this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Init particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ── 2. SCORE COUNTER ANIMATION ────────────────────────────────
function animateScore() {
    const items = document.querySelectorAll('.score-num');

    // Animate 0 → 100
    const numEl = items[0];
    let count = 0;
    const target = 100;
    const step = () => {
        count += 3;
        if (count >= target) {
            numEl.textContent = target;
        } else {
            numEl.textContent = count;
            requestAnimationFrame(step);
        }
    };
    setTimeout(step, 400);

    // Animate grade F → A+
    const gradeEl = items[1];
    const grades = ['F', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+'];
    let gi = 0;
    const gradeStep = setInterval(() => {
        gradeEl.textContent = grades[gi];
        gi++;
        if (gi >= grades.length) clearInterval(gradeStep);
    }, 80);

    // Animate stars ☆ → ★★★
    const starEl = items[2];
    setTimeout(() => { starEl.textContent = '★☆☆'; }, 300);
    setTimeout(() => { starEl.textContent = '★★☆'; }, 600);
    setTimeout(() => { starEl.textContent = '★★★'; }, 900);
}

window.addEventListener('load', () => {
    setTimeout(animateScore, 800);
});

// ── 3. DOWNLOAD BUTTON CLICK ──────────────────────────────────
const btn = document.getElementById('downloadBtn');
const leftCard = document.getElementById('leftCard');
const rightCard = document.getElementById('rightCard');
const boomOverlay = document.getElementById('boomOverlay');
const confettiContainer = document.getElementById('confettiContainer');

btn.addEventListener('click', function (e) {
    // Don't prevent default - let download happen

    // 1. Card pull animation
    leftCard.classList.remove('pulled');
    rightCard.classList.remove('pulled');
    void leftCard.offsetWidth; // reflow
    leftCard.classList.add('pulled');
    rightCard.classList.add('pulled');

    // Remove after animation
    setTimeout(() => {
        leftCard.classList.remove('pulled');
        rightCard.classList.remove('pulled');
    }, 1300);

    // 2. BOOM overlay
    boomOverlay.classList.add('active');
    setTimeout(() => {
        boomOverlay.classList.remove('active');
    }, 1600);

    // 3. Screen shake
    document.body.style.animation = 'none';
    document.body.style.transform = 'translate(0)';
    screenShake();

    // 4. Confetti burst
    launchConfetti(80);

    // 5. Button extra effect
    btn.style.transform = 'scale(0.92)';
    setTimeout(() => { btn.style.transform = ''; }, 150);

    // 6. Re-run score animation
    animateScore();
});

// ── 4. SCREEN SHAKE ───────────────────────────────────────────
function screenShake() {
    const scene = document.querySelector('.main-scene');
    const shakes = [
        [4, -2], [-4, 2], [3, -3], [-3, 3],
        [2, -1], [-2, 1], [1, 0], [0, 0]
    ];
    shakes.forEach(([x, y], i) => {
        setTimeout(() => {
            scene.style.transform = `translate(${x}px, ${y}px)`;
        }, i * 30);
    });
    setTimeout(() => { scene.style.transform = ''; }, 250);
}

// ── 5. CONFETTI ───────────────────────────────────────────────
function launchConfetti(count) {
    const colors = [
        '#00ffe1', '#ff2d78', '#ffe600', '#ff6b35',
        '#7c3aed', '#10b981', '#f59e0b', '#ef4444',
        '#ffffff', '#00d4ff'
    ];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.random() * 100;
            const duration = Math.random() * 2 + 1.5;
            const drift = (Math.random() - 0.5) * 300;
            const size = Math.random() * 12 + 6;
            const shape = Math.random() > 0.5 ? '50%' : '2px';

            piece.style.cssText = `
                left: ${x}%;
                background: ${color};
                width: ${size}px;
                height: ${size * (Math.random() * 0.6 + 0.4)}px;
                border-radius: ${shape};
                box-shadow: 0 0 6px ${color};
                animation-duration: ${duration}s;
                animation-delay: ${Math.random() * 0.5}s;
                --drift: ${drift}px;
            `;

            // Custom keyframe with drift
            piece.style.animation = `confettiFall ${duration}s ${Math.random() * 0.4}s linear forwards`;
            piece.style.transform = `translateX(0)`;

            confettiContainer.appendChild(piece);

            // Drift via separate update
            let startTime = null;
            function driftAnimate(ts) {
                if (!startTime) startTime = ts;
                const prog = (ts - startTime) / (duration * 1000);
                piece.style.marginLeft = (drift * prog) + 'px';
                if (prog < 1) requestAnimationFrame(driftAnimate);
            }
            requestAnimationFrame(driftAnimate);

            setTimeout(() => piece.remove(), (duration + 1) * 1000);
        }, i * 18);
    }
}

// ── 6. MOUSE PARALLAX ON CARDS ────────────────────────────────
document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    leftCard.style.transform = `
        perspective(800px)
        rotateY(${dx * 6}deg)
        rotateX(${-dy * 4}deg)
        translateY(${-dy * 5}px)
    `;

    rightCard.style.transform = `
        perspective(800px)
        rotateY(${dx * 6}deg)
        rotateX(${-dy * 4}deg)
        translateY(${-dy * 5}px)
    `;
});

document.addEventListener('mouseleave', () => {
    leftCard.style.transform = '';
    rightCard.style.transform = '';
});

// ── 7. GLITCH PERIODIC TRIGGER ────────────────────────────────
function triggerRandomGlitch() {
    const glitch = document.querySelector('.glitch');
    glitch.style.animation = 'none';
    void glitch.offsetWidth;
    glitch.style.animation = '';

    // Random color flash
    const colors = ['#00ffe1', '#ff2d78', '#ffe600', '#ffffff'];
    const col = colors[Math.floor(Math.random() * colors.length)];
    glitch.style.color = col;
    setTimeout(() => { glitch.style.color = ''; }, 100);
}

setInterval(triggerRandomGlitch, 3500 + Math.random() * 2000);

// ── 8. CUSTOM CURSOR TRAIL ────────────────────────────────────
const trailDots = [];
for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
        position: fixed;
        width: ${8 - i}px;
        height: ${8 - i}px;
        border-radius: 50%;
        background: rgba(0,255,225,${0.6 - i * 0.07});
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.05s, left ${0.03 + i * 0.02}s, top ${0.03 + i * 0.02}s;
        left: -20px;
        top: -20px;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(dot);
    trailDots.push(dot);
}

let mouseX = -100, mouseY = -100;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

let prevPositions = Array(trailDots.length).fill({ x: -100, y: -100 });

function updateTrail() {
    prevPositions[0] = { x: mouseX, y: mouseY };
    trailDots.forEach((dot, i) => {
        const pos = prevPositions[Math.max(0, i - 1)] || prevPositions[0];
        dot.style.left = pos.x + 'px';
        dot.style.top = pos.y + 'px';
        if (i < trailDots.length - 1) {
            prevPositions[i + 1] = {
                x: (prevPositions[i + 1]?.x || pos.x) * 0.7 + pos.x * 0.3,
                y: (prevPositions[i + 1]?.y || pos.y) * 0.7 + pos.y * 0.3
            };
        }
    });
    requestAnimationFrame(updateTrail);
}
updateTrail();

// ── 9. BUTTON HOVER SPARK ────────────────────────────────────
btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (Math.random() > 0.7) {
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 4px;
            height: 4px;
            background: #00ffe1;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            box-shadow: 0 0 6px #00ffe1;
        `;
        document.body.appendChild(spark);

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 60 + 20;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        let sx = 0, sy = 0, life = 1;

        function sparkUpdate() {
            sx += vx * 0.05;
            sy += vy * 0.05 + 1;
            life -= 0.08;
            spark.style.transform = `translate(${sx}px, ${sy}px) scale(${life})`;
            spark.style.opacity = life;
            if (life > 0) requestAnimationFrame(sparkUpdate);
            else spark.remove();
        }
        requestAnimationFrame(sparkUpdate);
    }
});

// ── 10. ENTRANCE ANIMATION SEQUENCE ───────────────────────────
window.addEventListener('load', () => {
    document.querySelector('.header-section').style.animation =
        'slideInLeft 0.7s cubic-bezier(0.23,1,0.32,1) both';

    document.querySelector('.button-section').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.button-section').style.transition = 'opacity 0.6s ease';
        document.querySelector('.button-section').style.opacity = '1';
    }, 400);
});