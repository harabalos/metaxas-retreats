import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface AccommodationGalleryProps {
  images: string[];
  name: string;
}

const HINTS: Record<string, { tap: string; reset: string }> = {
  en: { tap: 'Tap to zoom', reset: 'Reset' },
  el: { tap: 'Πατήστε για zoom', reset: 'Επαναφορά' },
  it: { tap: 'Tocca per ingrandire', reset: 'Reimposta' },
  de: { tap: 'Zum Zoomen tippen', reset: 'Zurücksetzen' },
  ro: { tap: 'Atinge pentru zoom', reset: 'Resetează' },
};

const MAX_ZOOM = 4;
const MIN_ZOOM = 1;
const DOUBLE_TAP_ZOOM = 2.5;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const AccommodationGallery = ({ images, name }: AccommodationGalleryProps) => {
  const { language } = useLanguage();
  const hint = HINTS[language] || HINTS.en;
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  // Zoom / pan state (lightbox only)
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  // Mutable gesture tracking (avoids stale closures inside native listeners)
  const g = useRef({
    mode: 'none' as 'none' | 'pinch' | 'pan' | 'swipe',
    startDist: 0,
    startScale: 1,
    panStartX: 0,
    panStartY: 0,
    swipeStartX: 0,
    swipeStartY: 0,
    lastTap: 0,
    didPan: false,
    zoom: 1,
    offset: { x: 0, y: 0 },
  });

  // Keep refs in sync with state for use inside native listeners
  useEffect(() => { g.current.zoom = zoom; }, [zoom]);
  useEffect(() => { g.current.offset = offset; }, [offset]);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent((index + images.length) % images.length);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images.length]);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(false);
    resetZoom();
  }, [resetZoom]);

  // Clamp pan so the image can't be dragged completely off-screen
  const clampOffset = useCallback((x: number, y: number, scale: number) => {
    const el = viewportRef.current;
    if (!el) return { x, y };
    const w = el.clientWidth;
    const h = el.clientHeight;
    const maxX = (w * (scale - 1)) / 2;
    const maxY = (h * (scale - 1)) / 2;
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }, []);

  // Toggle zoom (double-tap / double-click)
  const toggleZoom = useCallback(() => {
    setZoom((z) => {
      if (z > 1) {
        setOffset({ x: 0, y: 0 });
        return 1;
      }
      return DOUBLE_TAP_ZOOM;
    });
  }, []);

  // Keyboard nav
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, next, prev, closeLightbox]);

  // Lock body scroll while lightbox open
  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [lightbox]);

  // Native touch listeners (non-passive so we can preventDefault and stop browser pinch/scroll)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !lightbox) return;

    const dist = (touches: TouchList) => {
      const a = touches[0];
      const b = touches[1];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        g.current.mode = 'pinch';
        g.current.startDist = dist(e.touches);
        g.current.startScale = g.current.zoom;
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        // Double-tap detection
        const now = Date.now();
        if (now - g.current.lastTap < 300) {
          toggleZoom();
          g.current.lastTap = 0;
          g.current.mode = 'none';
          return;
        }
        g.current.lastTap = now;

        if (g.current.zoom > 1) {
          g.current.mode = 'pan';
          g.current.panStartX = t.clientX - g.current.offset.x;
          g.current.panStartY = t.clientY - g.current.offset.y;
        } else {
          g.current.mode = 'swipe';
          g.current.swipeStartX = t.clientX;
          g.current.swipeStartY = t.clientY;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (g.current.mode === 'pinch' && e.touches.length === 2) {
        e.preventDefault();
        const newDist = dist(e.touches);
        const scale = clamp(
          g.current.startScale * (newDist / g.current.startDist),
          MIN_ZOOM,
          MAX_ZOOM,
        );
        setZoom(scale);
        if (scale <= 1) setOffset({ x: 0, y: 0 });
      } else if (g.current.mode === 'pan' && e.touches.length === 1) {
        e.preventDefault();
        const t = e.touches[0];
        const nx = t.clientX - g.current.panStartX;
        const ny = t.clientY - g.current.panStartY;
        setOffset(clampOffset(nx, ny, g.current.zoom));
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (g.current.mode === 'swipe') {
        const t = e.changedTouches[0];
        const dx = t.clientX - g.current.swipeStartX;
        const dy = t.clientY - g.current.swipeStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && g.current.zoom === 1) {
          if (dx < 0) next();
          else prev();
        }
      }
      if (g.current.zoom <= 1) setOffset({ x: 0, y: 0 });
      if (e.touches.length === 0) g.current.mode = 'none';
    };

    // ── Mouse drag-to-pan (desktop, only when zoomed) ──
    let mouseDown = false;
    const onMouseDown = (e: MouseEvent) => {
      if (g.current.zoom <= 1) return;
      mouseDown = true;
      g.current.didPan = false;
      g.current.panStartX = e.clientX - g.current.offset.x;
      g.current.panStartY = e.clientY - g.current.offset.y;
      g.current.mode = 'pan';
      e.preventDefault();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown || g.current.zoom <= 1) return;
      g.current.didPan = true;
      const nx = e.clientX - g.current.panStartX;
      const ny = e.clientY - g.current.panStartY;
      setOffset(clampOffset(nx, ny, g.current.zoom));
    };
    const onMouseUp = () => {
      mouseDown = false;
      if (g.current.mode === 'pan') g.current.mode = 'none';
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [lightbox, next, prev, toggleZoom, clampOffset]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] };

  return (
    <>
      {/* Main gallery */}
      <div className="space-y-3">
        {/* Hero image slot */}
        <div
          className="relative rounded-2xl overflow-hidden cursor-zoom-in group"
          style={{ aspectRatio: '16/9' }}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.img
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              src={images[current] || '/images/placeholder.svg'}
              alt={`${name} - ${current + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

          {/* Tap-to-zoom hint (always visible on mobile, hover on desktop) */}
          <div className="absolute top-4 right-4 bg-black/45 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-sans opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>{hint.tap}</span>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-sans">
            {current + 1} / {images.length}
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-forest-dark hover:bg-white transition-all shadow-md opacity-0 group-hover:opacity-100"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-forest-dark hover:bg-white transition-all shadow-md opacity-0 group-hover:opacity-100"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                  i === current
                    ? 'ring-2 ring-wood ring-offset-1 opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={img}
                  alt={`${name} ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading={i < 6 ? 'eager' : 'lazy'}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center select-none"
            onClick={() => {
              // Ignore the click synthesized at the end of a drag-pan
              if (g.current.didPan) { g.current.didPan = false; return; }
              closeLightbox();
            }}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image viewport — minimal padding on mobile so the photo fills the screen */}
            <div
              ref={viewportRef}
              className="relative w-full h-full flex items-center justify-center overflow-hidden px-2 py-16 sm:px-16 sm:py-12 touch-none"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => { e.stopPropagation(); toggleZoom(); }}
              style={{ cursor: zoom > 1 ? 'grab' : 'zoom-in' }}
            >
              {/* Zoom/pan wrapper — plain div so framer-motion can't override transform.
                  Must FILL the viewport (w/h-full) so the image's object-contain
                  constrains against the screen, not against a shrink-wrapped box. */}
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: g.current.mode === 'none' ? 'transform 0.2s ease-out' : 'none',
                  willChange: 'transform',
                  transformOrigin: 'center center',
                }}
              >
                <AnimatePresence custom={direction} initial={false} mode="wait">
                  <motion.img
                    key={current}
                    custom={direction}
                    variants={zoom === 1 ? slideVariants : undefined}
                    initial={zoom === 1 ? 'enter' : false}
                    animate={zoom === 1 ? 'center' : { opacity: 1 }}
                    exit={zoom === 1 ? 'exit' : { opacity: 0 }}
                    transition={transition}
                    src={images[current]}
                    alt={`${name} - ${current + 1}`}
                    draggable={false}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Nav (hidden while zoomed to avoid accidental taps) */}
            {images.length > 1 && zoom === 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute top-4 left-4 text-white/80 text-sm font-sans bg-black/30 px-3 py-1.5 rounded-full z-10">
              {current + 1} / {images.length}
            </div>

            {/* Zoom reset chip (only when zoomed) */}
            {zoom > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/90 text-xs font-sans bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full z-10 transition-colors"
              >
                {Math.round(zoom * 100)}% · {hint.reset}
              </button>
            )}

            {/* Dot indicators (only when not zoomed) */}
            {images.length > 1 && zoom === 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goTo(i, i > current ? 1 : -1); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      i === current ? 'bg-wood scale-125' : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccommodationGallery;
