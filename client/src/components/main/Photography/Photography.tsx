'use client';
import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import usePhotographyData from '@/hooks/Photography/usePhotographyData';
import Carousel from './Carousel/Carousel';
// import CompactCarousel from './Carousel/CompactCarousel';

const Photography = () => {
  const { photos, loading, error } = usePhotographyData();
  const isCompact = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      id="photography-section"
      w="100%"
      h="100vh"
      bg="var(--white-color)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex direction="column" align="center" justify="center" w="80%" h="90%">
        <Heading mb={6} fontSize={{ base: '3vh', md: '4vh' }}>Photography</Heading>

        {loading ? (
          <Text fontSize="lg" color="gray.500">Loading photos...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : isCompact ? (
          <Carousel images={photos} />
        ) : (
          <Carousel images={photos} />
        )}
      </Flex>
    </Box>
  );
};

export default Photography;
