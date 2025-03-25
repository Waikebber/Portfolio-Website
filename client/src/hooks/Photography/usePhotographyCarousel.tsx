import { useState, useCallback } from 'react';
import { PhotoData } from '@/types';

export const usePhotographyCarousel = (images: PhotoData[]) => {
  const [currentIndex, setCurrentIndex] = useState<number>(3); // Start at 4th image

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const selectSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
    currentIndex,
    prevSlide,
    nextSlide,
    selectSlide,
  };
};
