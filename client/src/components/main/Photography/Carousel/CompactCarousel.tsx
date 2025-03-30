'use client';
import React, { useState } from 'react';
import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { usePhotographyCarousel } from '@/hooks/Photography/usePhotographyCarousel';
import { EnhancedPhotoData } from '@/types';
import { useDrag } from '@use-gesture/react';

const CompactCarousel = ({ images }: { images: EnhancedPhotoData[] }) => {
  const { currentIndex, prevSlide, nextSlide } = usePhotographyCarousel(images);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleToggleOverlay = () => {
    setShowOverlay((prev) => !prev);
  };

  const bind = useDrag(({ down, direction: [xDir], velocity: [vx] }) => {
    if (!down && Math.abs(vx) > 0.1) {
      if (xDir > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  });

  const currentImage = images[currentIndex];

  return (
    <Flex
      {...bind()}
      position="relative"
      w="100%"
      h="100%"
      align="center"
      justify="center"
      cursor="grab"
      userSelect="none"
      style={{ touchAction: 'none' }}
      onClick={handleToggleOverlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        position="relative"
        borderRadius="24px"
        overflow="hidden"
        maxW="90vw"
        maxH="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >
        <Image
            src={currentImage.src}
            alt={currentImage.location}
            borderRadius="24px"
            maxH="80vh"
            maxW="100%"
            objectFit="contain"
            draggable={false}
        />

        {(hovered || showOverlay) && (
            <Box
            position="absolute"
            bottom="0"
            w="100%"
            maxW="100%"
            >
            <Text
                bg="rgba(0,0,0,0.5)"
                color="white"
                textAlign="center"
                p="2"
                fontSize={{ base: '1.5vh' }}
                lineHeight="1.2"
                borderBottomRadius="24px"
            >
                {currentImage.title} <br />
                <Text as="span" fontSize={{ base: '1.2vh' }}>
                {currentImage.subtitle}
                </Text>
            </Text>
            </Box>
        )}
        </Box>

      {/* Prev/Next Arrows */}
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
        zIndex={2}
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
        zIndex={2}
      >
        <LuChevronRight />
      </IconButton>
    </Flex>
  );
};

export default CompactCarousel;
