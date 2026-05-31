# Invitación MM — Proyecto Romántico

## Resumen
**Usuario:** Martín | **Proyecto:** Invitación web interactiva para Maiten (novia)  
**Estado:** 80% funcionalidad. Overlay + hero funcionando. Contenido futuro protegido en comentarios HTML.  
**Stack:** HTML5, CSS3, Vanilla JS. Sin frameworks. Google Fonts (Great Vibes, Playfair Display, Lato).

---

## Flujo Principal (Funcionando)

1. **Overlay Fase 1**: Corazón pulsante ♥ en el centro. Click → corazón explota (scale 9, opacity 0)
2. **Overlay Fase 2**: Pregunta "Estás siendo cordialmente invitada a una salida romántica con tu novio ¿Aceptás esta invitación?" + botones Sí/No
   - Sí: Aceptar → flores brotan (180+ flores, ripple desde centro, tamaños 90–230px, duración 2.4–3.8s) → página visible
   - No: Botón escapa a posición random, hover activa spotlight en Sí + chispitas ✦
3. **Hero**: "Maiten", "Martín & Maiten", "9 meses de novios" (toggle → "12 meses de nuestra primera salida")
4. **Información**: Actualmente "Todavía es un secreto 🤫🤫" + placeholder
5. **Itinerario (NUEVO)**: Acordeón interactivo con dos fechas
   - Domingo 14 de Junio: 5 actividades (mediodía pickup, tarde comida, tarde minigolf, atardecer café, noche Netflix)
   - Miércoles 17 de Junio: 1 actividad (cena en Croque Madame)
   - Cada item: header con tiempo/título/toggle, content expandible con GIF + descripción
   - Timeline visual con dots y líneas conectoras
   - Scroll fade-in stagger con 80ms delay entre items
   - Todo el contenido futuro (contador, countdown, carta, galería, footer) está en comentarios HTML, preservado para trabajo futuro

---

## Detalles Técnicos

### Archivos Críticos
- `index.html` — estructura principal. Overlay (Fase 1+2) + Hero + Placeholder secreto + Contenido comentado
- `css/styles.css` — todos los estilos (animaciones, responsive, colores)
- `js/overlay.js` — lógica del overlay, flores (launchFlowers), No button escape, sparkles
- `js/app.js` — contador (scroll-triggered), hero toggle, countdown, scroll fade-in

### Color Palette
```
--rose: #c9748a        (rosa medio)
--rose-light: #f0c8d4  (rosa claro)
--gold: #c9a96e        (oro)
--cream: #fdf6f0       (crema base)
--dark: #3d2b2b        (oscuro)
--text: #5a3e3e        (texto)
```

### Animaciones Clave
- **Flores**: `@keyframes flLife` (bloom 0-18% → hold 18-52% → exit 52-100%). Ripple delay basado en distancia desde centro.
- **Hero**: Container fade-in on page-ready. Subtitle toggle usa slide-left/slide-right (200ms out, 250ms in).
- **Scroll fade-in**: `.fi` elements aparecen con `translateY(26px)` → `translateY(0)` al entrar en viewport.
- **Countdown**: Números animan al cargar (o al scroll si está comentado), tick animation en cada segundo.
- **Itinerario Acordeón**: 
  - Items inician `opacity: 0`, `translateY(20px)` y fade in on scroll (IntersectionObserver)
  - Stagger de 80ms entre items para efecto cascada
  - `.item-content` expande con `max-height: 0` → `max-height: 800px` (.4s cubic-bezier easing)
  - `.item-toggle` rota 45° cuando item está `.open`

### Petals (Pétalos)
- 18 iniciales en hero, spawn cada 550ms
- Colores: ['#f0c8d4', '#fad4d8', '#f8e0e8', '#fcc8b8', '#fce4d4']
- Duración: 5–12s, delays 0–3s

### GitHub Pages
- URL: `https://tincho2003.github.io/nuevem/`
- Estructura: `nuevem/` carpeta con `index.html`, `css/`, `js/`
- Problema conocido: A veces no se ve el placeholder secreto — requiere hard refresh (Ctrl+Shift+R) o esperar rebuild

---

## Preferencias del Usuario

- **Estética:** Romántico, elegante, rose/gold/cream. Tipografía serif (Playfair Display) para títulos, cursiva (Great Vibes) para nombres.
- **Animaciones:** Adora las flores, los efectos dramáticos (como el boom del corazón). Prefiere que todo sea SUAVE y SIN SALTOS.
- **Código:** Le importa que NO se BORRE nada. Usar comentarios HTML para "guardar" contenido futuro. Prefiere que le muestre dónde está todo organizado.
- **Testing:** Verifica en navegador local primero, luego GitHub Pages. Siempre con hard refresh.
- **Iteración:** Rápida. Cambios menores pedidos en el momento (ej: "cambia el besito por 🤫🤫").

---

## Contenido Futuro (Protegido en HTML)

Dentro de comentarios HTML (línea ~60 en adelante en `index.html`):
- **Contador**: 3 cards (días de novios, primera salida, cuando se conocieron). Dates: 2025-09-09, 2025-06-07, 2025-03-09.
- **Countdown**: Al 9 de Junio 2026 (días:horas:minutos:segundos).
- **Carta**: Mensaje handwritten (Great Vibes) desde Martín.
- **Galería**: Placeholder 6 fotos (primero es 2x2).
- **Footer**: "Martín & Maiten — Mayo 2026"

## Estado del Itinerario (IMPLEMENTADO)
- ✅ HTML estructura: 2 fechas con timeline visual y 6 actividades total
- ✅ CSS acordeón: expand/collapse suave con max-height animation
- ✅ Toggle visual: + rota a 45° (simula X)
- ✅ Scroll animations: fade-in stagger con IntersectionObserver
- ✅ GIFs incrustados: 6 GIFs de giphy.com para cada actividad
- ✅ Responsive: adaptado para mobile (padding, fuente, altura de dots)

---

## Estado de GitHub Pages

- Última actualización: 30 May 2024
- Los archivos se subieron correctamente
- Si no se ve contenido, verificar: consola (F12), rutas CSS/JS, caché del navegador

---

## Próximos Pasos (No Empezados)

- Descomenta + estiliza el contador dinámico
- Descomenta + estiliza la agenda con stagger animations
- Descomenta + estiliza countdown
- Descomenta + estiliza carta
- Descomenta + estiliza galería
- Responsive checks en móviles
- Pulir detalles de animación según feedback
