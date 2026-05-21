/* ═══════════════════════════════════════════════
   M & M — App principal
   ═══════════════════════════════════════════════ */

// ── Pétalos del hero ───────────────────────────
// (PETAL_COLORS y spawnPetal ya están definidos en overlay.js)
const petalsEl = document.getElementById('petals');
for (let i = 0; i < 18; i++) spawnPetal(petalsEl);
setInterval(() => spawnPetal(petalsEl), 550);

// ── Toggle subtítulo del hero ──────────────────
const heroToggleEl = document.getElementById('hero-toggle');
const HERO_TEXTS   = ['9 meses de novios', '12 meses de nuestra primera salida'];
let heroTextIdx    = 0;

if (heroToggleEl) {
    heroToggleEl.addEventListener('click', () => {
        heroToggleEl.classList.add('slide-out');
        setTimeout(() => {
            heroTextIdx = (heroTextIdx + 1) % HERO_TEXTS.length;
            heroToggleEl.textContent = HERO_TEXTS[heroTextIdx];
            heroToggleEl.classList.remove('slide-out');
            heroToggleEl.classList.add('slide-in');
            heroToggleEl.addEventListener('animationend',
                () => heroToggleEl.classList.remove('slide-in'),
                { once: true }
            );
        }, 200);
    });
}

// ── Contador de días ───────────────────────────
const FECHA_NOVIOS      = new Date('2025-09-09'); // 9/9/2025
const FECHA_PRIM_SALIDA = new Date('2025-06-07'); // 7/6/2025
const FECHA_CONOCIDOS   = new Date('2025-03-09'); // 9/3/2025

function daysSince(date) {
    return Math.floor((Date.now() - date) / 86_400_000);
}

function animCount(el, target) {
    let n = 0;
    const step = Math.max(1, Math.floor(target / 55));
    const iv = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n;
        if (n >= target) clearInterval(iv);
    }, 18);
}

// Disparar los contadores cuando la sección entra en vista
const counterObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        animCount(document.getElementById('dias-novios'),    daysSince(FECHA_NOVIOS));
        animCount(document.getElementById('dias-salida'),    daysSince(FECHA_PRIM_SALIDA));
        animCount(document.getElementById('dias-conocidos'), daysSince(FECHA_CONOCIDOS));
        counterObs.disconnect();
    }
}, { threshold: .2 });
counterObs.observe(document.getElementById('contador'));

// ── Countdown al 9 de Junio 2026 ──────────────
const FECHA_EVENTO = new Date('2026-06-09T00:00:00');

function updateCountdown() {
    const diff = FECHA_EVENTO - Date.now();

    if (diff <= 0) {
        document.getElementById('cd-days').textContent  = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-mins').textContent  = '00';
        document.getElementById('cd-secs').textContent  = '00';
        return;
    }

    const days  = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const mins  = Math.floor((diff % 3_600_000)  / 60_000);
    const secs  = Math.floor((diff % 60_000)      / 1_000);

    const pad = n => String(n).padStart(2, '0');

    const setAndTick = (id, val) => {
        const el = document.getElementById(id);
        if (el.textContent !== val) {
            el.classList.remove('tick');
            void el.offsetWidth; // reflow
            el.classList.add('tick');
            el.textContent = val;
            setTimeout(() => el.classList.remove('tick'), 150);
        }
    };

    setAndTick('cd-days',  pad(days));
    setAndTick('cd-hours', pad(hours));
    setAndTick('cd-mins',  pad(mins));
    setAndTick('cd-secs',  pad(secs));
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── Fade-in al scroll ──────────────────────────
const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('on');
            fadeObs.unobserve(e.target);
        }
    });
}, { threshold: .12, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.fi').forEach(el => fadeObs.observe(el));

// ── Agenda — stagger desde la izquierda ────────
const agendaProgram = document.querySelector('.agenda-program');
if (agendaProgram) {
    new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.ap-item').forEach((item, i) => {
                setTimeout(() => item.classList.add('on'), i * 110);
            });
        }
    }, { threshold: .1 }).observe(agendaProgram);
}
