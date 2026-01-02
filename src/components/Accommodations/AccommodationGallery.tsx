
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';

interface AccommodationGalleryProps {
  images: string[];
  name: string;
}

const AccommodationGallery = ({ images, name }: AccommodationGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({0: true});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = useCallback(() => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setLoadedImages(prev => ({...prev, [nextIndex]: true}));
  }, [currentImageIndex, images.length]);

  const prevImage = useCallback(() => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setLoadedImages(prev => ({...prev, [prevIndex]: true}));
  }, [currentImageIndex, images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setLoadedImages(prev => ({...prev, [index]: true}));
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Main image with AspectRatio for consistent dimensions */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-gray-100">
          <img
            src={images[currentImageIndex] || '/images/placeholder.svg'}
            alt={`${name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain cursor-pointer transition-transform hover:scale-[1.02]"
            style={{ maxHeight: '80vh' }}
            loading="eager"
            onClick={openLightbox}
          />
        </AspectRatio>
        
        {/* Zoom indicator */}
        <button
          onClick={openLightbox}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-2 rounded-full shadow-md transition-all"
          aria-label="Zoom image"
        >
          <ZoomIn className="h-5 w-5 text-white" />
        </button>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-sea" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-sea" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnails with lazy loading */}
      {images.length > 1 && (
        <div className="flex mt-4 space-x-2 overflow-x-auto pb-2 max-h-24">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden transition-all ${
                index === currentImageIndex ? 'ring-2 ring-forest' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {(loadedImages[index] || index === currentImageIndex - 1 || index === currentImageIndex + 1) ? (
                <img
                  src={image}
                  alt={`${name} thumbnail ${index + 1}`}
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Loading...</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none">
          {/* Close button */}
          <DialogClose className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Main lightbox image */}
          <div className="flex items-center justify-center w-full h-full relative">
            <img
              src={images[currentImageIndex] || '/images/placeholder.svg'}
              alt={`${name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccommodationGallery;
