/* ═══════════════════════════════════════════════
   M & M — Overlay
   ═══════════════════════════════════════════════ */

const PETAL_COLORS = ['#f0c8d4', '#fad4d8', '#f8e0e8', '#fcc8b8', '#fce4d4'];

function spawnPetal(container) {
    const p = document.createElement('div');
    p.classList.add('petal');
    const s = Math.random() * 12 + 6;
    p.style.cssText = [
        `width:${s}px`,
        `height:${s}px`,
        `background:${PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]}`,
        `left:${Math.random() * 100}%`,
        `animation-duration:${Math.random() * 7 + 5}s`,
        `animation-delay:${Math.random() * 3}s`,
        `border-radius:${Math.random() > .5 ? '50% 0 50% 0' : '50%'}`
    ].join(';');
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
}

// Elementos
const overlayEl  = document.getElementById('overlay');
const ovIntroEl  = document.getElementById('ov-intro');
const ovHeartBig = document.getElementById('ov-heart-big');
const ovBoxEl    = document.getElementById('ov-box');
const btnSi      = document.getElementById('btn-si');
const btnNo      = document.getElementById('btn-no');

// ── Fase 1 → Fase 2: click en el corazón ──────
ovHeartBig.addEventListener('click', () => {
    ovHeartBig.classList.add('boom');
    setTimeout(() => {
        ovIntroEl.style.display = 'none';
        ovBoxEl.classList.add('visible');
    }, 600);
});

// ── Hover en NO → spotlight en SÍ ─────────────
btnNo.addEventListener('mouseenter', () => {
    btnSi.classList.add('spotlight');
    btnNo.classList.add('dimmed');
    spawnSparkles();
});
btnNo.addEventListener('mouseleave', () => {
    btnSi.classList.remove('spotlight');
    btnNo.classList.remove('dimmed');
});

// ── Click en NO → escapa ──────────────────────
btnNo.addEventListener('click', () => {
    const bw = btnNo.offsetWidth, bh = btnNo.offsetHeight, pad = 24;
    const x  = pad + Math.random() * (window.innerWidth  - bw - pad * 2);
    const y  = pad + Math.random() * (window.innerHeight - bh - pad * 2);
    btnNo.style.position = 'fixed';
    btnNo.style.margin   = '0';
    btnNo.style.left     = x + 'px';
    btnNo.style.top      = y + 'px';
});

// ── Chispitas sobre SÍ ────────────────────────
function spawnSparkles() {
    const rect = btnSi.getBoundingClientRect();
    ['✦', '✦', '✦'].forEach((ch, i) => {
        setTimeout(() => {
            const sp = document.createElement('div');
            sp.textContent = ch;
            const x = rect.left + 16 + Math.random() * (rect.width - 32);
            sp.style.cssText = [
                'position:fixed',
                `left:${x}px`,
                `top:${rect.top - 4}px`,
                'font-size:.75rem',
                'color:var(--gold)',
                'pointer-events:none',
                'z-index:10002',
                'animation:sparkleUp .75s ease forwards'
            ].join(';');
            overlayEl.appendChild(sp);
            sp.addEventListener('animationend', () => sp.remove());
        }, i * 130);
    });
}

// ── Transición de flores ───────────────────────
function launchFlowers() {
    const burst = document.createElement('div');
    burst.classList.add('flower-burst');
    document.body.appendChild(burst);

    const W       = window.innerWidth;
    const H       = window.innerHeight;
    const cx      = W / 2;
    const cy      = H / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    const chars  = ['✿', '❀', '✽', '❁', '✾'];
    const colors = [
        '#ffffff', '#ffffff', '#ffffff',
        '#f0c8d4', '#fad4d8', '#f8e0e8',
        '#c9748a', '#e8a0b4', '#fce4d4', '#f0c8d4'
    ];

    let maxBloomTime = 0; // cuándo estará la última flor completamente abierta
    let maxEndTime   = 0; // cuándo termina la última flor

    function addFlower(x, y, extraJitter = 0) {
        const jx = x + (Math.random() - .5) * extraJitter;
        const jy = y + (Math.random() - .5) * extraJitter;

        // Delay centro → afuera (ripple), con algo de azar
        const dist  = Math.sqrt((jx - cx) ** 2 + (jy - cy) ** 2);
        const delay = (dist / maxDist) * 0.7 + Math.random() * 0.18;

        // Tamaños grandes, con sesgo hacia lo grande
        const size = 90 + Math.pow(Math.random(), 0.45) * 140; // 90–230 px

        // Duración total: bloom + hold + exit
        const dur = 2.4 + Math.random() * 1.4; // 2.4–3.8 s

        const fl = document.createElement('span');
        fl.classList.add('fl');
        fl.textContent             = chars[Math.floor(Math.random() * chars.length)];
        fl.style.left              = jx + 'px';
        fl.style.top               = jy + 'px';
        fl.style.fontSize          = size + 'px';
        fl.style.color             = colors[Math.floor(Math.random() * colors.length)];
        fl.style.animationDuration = dur + 's';
        fl.style.animationDelay    = delay + 's';
        burst.appendChild(fl);

        // 18% del ciclo es el bloom (ver keyframes)
        maxBloomTime = Math.max(maxBloomTime, delay + dur * 0.18);
        maxEndTime   = Math.max(maxEndTime,   delay + dur);
    }

    // ① Capa base: zonas superpuestas con mucho jitter → aspecto desordenado
    const zoneSize = 130;
    const cols = Math.ceil(W / zoneSize) + 2;
    const rows = Math.ceil(H / zoneSize) + 2;
    const offX = (W - (cols - 1) * zoneSize) / 2;
    const offY = (H - (rows - 1) * zoneSize) / 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            addFlower(offX + c * zoneSize, offY + r * zoneSize, zoneSize * 0.85);
        }
    }

    // ② Flores extra completamente aleatorias para romper la simetría
    for (let i = 0; i < 80; i++) {
        addFlower(Math.random() * W, Math.random() * H, 0);
    }

    // Una vez que TODAS están abiertas → quitar el fondo crema
    // → la página se va revelando a medida que cada flor desaparece
    setTimeout(() => {
        burst.style.backgroundColor = 'transparent';
    }, maxBloomTime * 1000 + 100);

    // Cuando la última flor terminó → limpiar el contenedor
    setTimeout(() => burst.remove(), maxEndTime * 1000 + 200);
}

// ── Aceptar → flores cubren pantalla ──────────
function acceptInvite() {
    console.log('[OVERLAY] acceptInvite called');
    launchFlowers();
    setTimeout(() => {
        console.log('[OVERLAY] Hiding overlay and restoring scroll');
        overlayEl.style.display  = 'none';
        document.body.style.overflow = '';
    }, 350);
}

// Bloquear scroll mientras el overlay está visible
console.log('[OVERLAY] Script loaded, blocking scroll');
document.body.style.overflow = 'hidden';

// Show hint after 10 seconds if user hasn't interacted
let hintTimer = setTimeout(() => {
    console.log('[OVERLAY] Showing hint');
    const hint = document.createElement('div');
    hint.className = 'overlay-hint';
    hint.textContent = 'hace click en el corazon ♥';
    ovIntroEl.appendChild(hint);
}, 10000);

// Clear hint timer if user clicks the heart
ovHeartBig.addEventListener('click', () => {
    clearTimeout(hintTimer);
});

// Clear hint timer if user clicks Sí or No
btnSi.addEventListener('click', () => {
    clearTimeout(hintTimer);
});
btnNo.addEventListener('click', () => {
    clearTimeout(hintTimer);
});
