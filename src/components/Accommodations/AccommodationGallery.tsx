
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface AccommodationGalleryProps {
  images: string[];
  name: string;
}

const AccommodationGallery = ({ images, name }: AccommodationGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({0: true}); // Track loaded images

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    // Preload next image
    setLoadedImages(prev => ({...prev, [nextIndex]: true}));
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    // Preload previous image
    setLoadedImages(prev => ({...prev, [prevIndex]: true}));
  };

  // Thumbnail click handler preloads the selected image
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setLoadedImages(prev => ({...prev, [index]: true}));
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Main image with AspectRatio for consistent dimensions */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-gray-100">
          <img
            src={images[currentImageIndex] || '/images/placeholder.svg'}
            alt={`${name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
            style={{ maxHeight: '80vh' }}
            loading="eager" // Load current image eagerly
          />
        </AspectRatio>
        
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
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
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
              {/* Only render images that are in view or the current index */}
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
    </div>
  );
};

export default AccommodationGallery;
