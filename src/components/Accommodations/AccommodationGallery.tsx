import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccommodationGalleryProps {
  images: string[];
  name: string;
}

const AccommodationGallery = ({ images, name }: AccommodationGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent((index + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, next, prev]);

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

          {/* Expand icon */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Expand className="h-4 w-4 text-white" />
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
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div
              className="relative w-full h-full flex items-center justify-center px-16 py-12"
              onClick={(e) => e.stopPropagation()}
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
                  src={images[current]}
                  alt={`${name} - ${current + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {/* Nav */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-sans">
              {current + 1} / {images.length}
            </div>

            {/* Thumbnail strip in lightbox */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccommodationGallery;
