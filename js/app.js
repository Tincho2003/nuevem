/* ═══════════════════════════════════════════════
   M & M — App principal
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
console.log('[APP] DOMContentLoaded fired');

// ── Pétalos del hero ───────────────────────────
// (PETAL_COLORS y spawnPetal ya están definidos en overlay.js)
const petalsEl = document.getElementById('petals');
if (petalsEl) {
    for (let i = 0; i < 18; i++) spawnPetal(petalsEl);
    setInterval(() => spawnPetal(petalsEl), 550);
}

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
const contadorEl = document.getElementById('contador');
if (contadorEl) {
    const counterObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            const diasNovios = document.getElementById('dias-novios');
            const diasSalida = document.getElementById('dias-salida');
            const diasConocidos = document.getElementById('dias-conocidos');

            if (diasNovios) animCount(diasNovios, daysSince(FECHA_NOVIOS));
            if (diasSalida) animCount(diasSalida, daysSince(FECHA_PRIM_SALIDA));
            if (diasConocidos) animCount(diasConocidos, daysSince(FECHA_CONOCIDOS));
            counterObs.disconnect();
        }
    }, { threshold: .2 });
    counterObs.observe(contadorEl);
}

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
        console.log('[FADEOBS] Element becoming visible:', e.target.className);
        if (e.isIntersecting) {
            e.target.classList.add('on');
            fadeObs.unobserve(e.target);
        }
    });
}, { threshold: .12, rootMargin: '0px 0px -32px 0px' });

const fiElements = document.querySelectorAll('.fi');
console.log('[APP] Found', fiElements.length, '.fi elements');
fiElements.forEach(el => {
    console.log('[APP] Observing .fi element:', el.className, el.tagName);
    fadeObs.observe(el);
});

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

// ── Itinerario — fade in items al scroll ───────
const itinerarioObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const items = e.target.querySelectorAll('.itinerario-item');
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, i * 80);
            });
            itinerarioObs.unobserve(e.target);
        }
    });
}, { threshold: .1 });

document.querySelectorAll('.itinerario-fecha').forEach(fecha => {
    itinerarioObs.observe(fecha);
});

// ── Carousel functionality with secret unlock ──────────────────────
const carouselStates = {};

function initCarousel(carouselId) {
    const viewport = document.getElementById(carouselId);
    if (!viewport) {
        console.warn(`Carousel ${carouselId} not found`);
        return;
    }

    const track = viewport.querySelector('.carousel-track');
    if (!track) {
        console.warn(`Track for ${carouselId} not found`);
        return;
    }

    // Count visible items (only domingo items, not unlock or wednesday)
    const allItems = track.querySelectorAll('.carousel-item');
    let visibleCount = 0;
    allItems.forEach(item => {
        if (!item.classList.contains('carousel-item--unlock') &&
            !item.classList.contains('carousel-item--wednesday')) {
            visibleCount++;
        }
    });

    const dotsContainer = document.getElementById(`dots-${carouselId}`);

    const state = {
        current: 0,
        visibleTotal: visibleCount,
        unlocked: false,
        keyUsed: false,
        keyShown: false
    };

    carouselStates[carouselId] = state;

    // Create dots solo para las slides visibles
    if (dotsContainer) {
        for (let i = 0; i < state.visibleTotal; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(carouselId, i);
            dotsContainer.appendChild(dot);
        }
    }
}

function updateCarousel(carouselId) {
    const state = carouselStates[carouselId];
    const viewport = document.getElementById(carouselId);
    const track = viewport.querySelector('.carousel-track');

    track.style.transform = `translateX(-${state.current * 100}%)`;

    // Update dots (solo para slides visibles)
    const dots = document.querySelectorAll(`#dots-${carouselId} .carousel-dot`);
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === state.current);
    });

    // Update buttons
    const nextBtn = document.getElementById(`btn-next-${carouselId}`);
    const prevBtn = document.getElementById(`btn-prev-${carouselId}`);
    const keyBtn = document.getElementById(`btn-key-${carouselId}`);
    const lockOverlay = document.getElementById(`btn-lock-${carouselId}`);

    // Show lock UI and key when at last domingo slide and not unlocked
    if (state.current === state.visibleTotal - 1 && !state.unlocked && !state.keyShown) {
        if (lockOverlay && nextBtn) {
            lockOverlay.classList.remove('hidden');
            // Position lock relative to carousel-container, ONCE (for responsive behavior)
            const container = viewport.closest('.carousel-container');
            const btnRect = nextBtn.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Calculate position relative to container
            const topRelative = btnRect.top - containerRect.top + btnRect.height / 2 - 24;
            const leftRelative = btnRect.left - containerRect.left + btnRect.width + 15;

            lockOverlay.style.position = 'absolute';
            lockOverlay.style.top = topRelative + 'px';
            lockOverlay.style.left = leftRelative + 'px';
        }
        if (keyBtn) {
            keyBtn.classList.remove('hidden');
            // Llave siempre a la izquierda
            keyBtn.style.right = 'auto';
            keyBtn.style.left = '-110px';
            const randomTop = Math.random() * 30 + 55;
            keyBtn.style.top = randomTop + '%';
        }
        state.keyShown = true;
    } else if (state.unlocked || state.current !== state.visibleTotal - 1) {
        if (lockOverlay) lockOverlay.classList.add('hidden');
        if (keyBtn) keyBtn.classList.add('hidden');
    }

    // Disable prev on first slide
    if (state.current === 0) {
        if (prevBtn) prevBtn.classList.add('disabled');
    } else {
        if (prevBtn) prevBtn.classList.remove('disabled');
    }
}

function carouselNext(carouselId) {
    const state = carouselStates[carouselId];
    const track = document.getElementById(carouselId).querySelector('.carousel-track');
    const totalItems = track.querySelectorAll('.carousel-item').length;

    // If at last domingo slide and not unlocked, show message
    if (state.current === state.visibleTotal - 1 && !state.unlocked) {
        showLockedModal();
        return;
    }

    // Normal navigation - can go up to total items
    if (state.current < totalItems - 1) {
        state.current++;
    }

    updateCarousel(carouselId);
}

function showLockedModal() {
    // Remove if exists
    const existing = document.getElementById('locked-modal');
    if (existing) {
        existing.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'locked-modal';
    modal.className = 'locked-modal-indicator';
    modal.innerHTML = `
        <img src="./images/anne.png" alt="perrito" class="locked-modal-dog-char">
        <div class="locked-modal-bubble">
            <p class="locked-bubble-text">OH NO!</p>
            <p class="locked-bubble-main">Un candado no nos permite avanzar!</p>
            <p class="locked-bubble-hint">Tal vez una llave podría abrirlo!</p>
        </div>
    `;
    document.body.appendChild(modal);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (modal && modal.parentNode) modal.remove();
    }, 4000);

    // Animate in
    setTimeout(() => {
        if (modal) modal.classList.add('show');
    }, 10);

    console.log('[MODAL] Anne appeared');
}

// Make it globally accessible
window.showLockedModal = showLockedModal;

function carouselPrev(carouselId) {
    const state = carouselStates[carouselId];

    // Don't go past first slide
    if (state.current > 0) {
        state.current--;
    }

    updateCarousel(carouselId);
}

function goToSlide(carouselId, index) {
    const state = carouselStates[carouselId];
    if (index >= 0 && index < state.visibleTotal) {
        state.current = index;
        state.unlockAttempts = 0;
        updateCarousel(carouselId);
    }
}

// Make carousel functions globally accessible
window.carouselNext = carouselNext;
window.carouselPrev = carouselPrev;
window.goToSlide = goToSlide;
window.unlockKey = unlockKey;
window.unlockLock = unlockLock;

function unlockKey(carouselId) {
    const state = carouselStates[carouselId];
    const keyBtn = document.getElementById(`btn-key-${carouselId}`);

    // Mark key as used
    state.keyUsed = true;

    // Animate key turning
    if (keyBtn) {
        keyBtn.classList.add('opening');
    }
}

function unlockLock(carouselId) {
    const state = carouselStates[carouselId];

    // Can only unlock if key was used first
    if (!state.keyUsed) return;

    const lockOverlay = document.getElementById(`btn-lock-${carouselId}`);
    const keyBtn = document.getElementById(`btn-key-${carouselId}`);

    // Lock opening animation
    if (lockOverlay) {
        lockOverlay.classList.add('opening');
    }

    // After animation, unlock and allow navigation
    setTimeout(() => {
        state.unlocked = true;
        if (lockOverlay) lockOverlay.classList.add('hidden');
        if (keyBtn) keyBtn.classList.add('hidden');

        // Allow next button to work and go to first unlock slide
        carouselNext(carouselId);
    }, 600);
}

// Initialize all carousels
initCarousel('carousel-1');

}); // Cierre del DOMContentLoaded del principio
