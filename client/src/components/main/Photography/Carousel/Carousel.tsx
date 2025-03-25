'use client';
import React, { useState } from 'react';
import { Flex, Image, Text, IconButton, Box } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { usePhotographyCarousel } from '@/hooks/Photography/usePhotographyCarousel';
import { EnhancedPhotoData } from '@/types';
import { useDrag } from '@use-gesture/react';

const Carousel = ({ images }: { images: EnhancedPhotoData[] }) => {
  const { currentIndex, prevSlide, nextSlide, selectSlide } = usePhotographyCarousel(images);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    if (index === currentIndex) {
      setShowOverlay((prev) => !prev);
    } else {
      selectSlide(index);
      setShowOverlay(false);
    }
  };

  const bind = useDrag(({ down, direction: [xDir], velocity: [vx] }) => {
    if (!down && Math.abs(vx) > 0.1) {
      if (xDir > 0) {
        prevSlide();  // drag right -> previous
      } else {
        nextSlide();  // drag left -> next
      }
    }
  });

  return (
    <Flex
      {...bind()}
      position="relative"
      w="100%"
      h="100%"
      overflow="visible"
      align="center"
      justify="center"
      cursor="grab"
      userSelect="none"
    >
      {images.map((image, index) => {
        let styleProps = {
          width: '0',
          zIndex: 0,
          opacity: 0,
          transform: 'translateX(0)',
          display: 'none',
          filter: 'none',
          scale: '1',
        };

        if (index === currentIndex) {
          styleProps = {
            width: '40%',
            zIndex: 3,
            opacity: 1,
            transform: 'translateX(0)',
            display: 'flex',
            filter: 'none',
            scale: '1',
          };
        } else if (index === (currentIndex - 1 + images.length) % images.length) {
          styleProps = {
            width: '30%',
            zIndex: 1,
            opacity: 0.5,
            transform: 'translateX(-120%)',
            display: 'flex',
            filter: 'brightness(0.8)',
            scale: '0.9',
          };
        } else if (index === (currentIndex + 1) % images.length) {
          styleProps = {
            width: '30%',
            zIndex: 1,
            opacity: 0.5,
            transform: 'translateX(120%)',
            display: 'flex',
            filter: 'brightness(0.8)',
            scale: '0.9',
          };
        }

        return (
            <Flex
            key={index}
            position="absolute"
            transition="all 0.5s ease"
            {...styleProps}
            cursor="pointer"
            onClick={() => handleImageClick(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            justify="center"
            align="center"
          >
            <Box
              position="relative"
              borderRadius="24px"
              overflow="hidden"
              maxW="800px"
              mx="auto"
            >
              <Image
                src={image.src}
                alt={image.location}
                borderRadius="24px"
                maxH="80vh"
                maxW="100%"
                objectFit="contain"
                draggable={false}
              />
          
              {index === currentIndex && hoveredIndex === index && showOverlay && (
                <Text
                  position="absolute"
                  bottom="0"
                  w="100%"
                  bg="rgba(0,0,0,0.5)"
                  color="white"
                  textAlign="center"
                  p="2"
                  fontSize={{ base: '1.5vh' }}
                  lineHeight="1.2"
                  borderBottomRadius="24px"
                >
                  {image.title} <br />
                  <Text as="span" fontSize={{ base: '1.2vh' }}>
                    {image.subtitle}
                  </Text>
                </Text>
              )}
            </Box>
          </Flex>
        );
      })}

      {/* Prev/Next Controls */}
      <IconButton
        aria-label="Previous"
        onClick={prevSlide}
        position="absolute"
        left="2"
        top="50%"
        transform="translateY(-50%)"
        bg="rgba(0,0,0,0.5)"
        color="white"
        borderRadius="50%"
        size="lg"
      >
        <LuChevronLeft />
      </IconButton>

      <IconButton
        aria-label="Next"
        onClick={nextSlide}
        position="absolute"
        right="2"
        top="50%"
        transform="translateY(-50%)"
        bg="rgba(0,0,0,0.5)"
        color="white"
        borderRadius="50%"
        size="lg"
      >
        <LuChevronRight />
      </IconButton>
    </Flex>
  );
};

export default Carousel;
