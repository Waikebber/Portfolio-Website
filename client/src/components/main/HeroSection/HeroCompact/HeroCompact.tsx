'use client';
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import MediaButtonWrapper from "@/components/mediaButtonWrapper/MediaButtonWrapper";
import { useHeroContent } from "@/hooks/useHeroContent";
import "@/styles/global.css";

const HeroCompact = () => {
  const content = useHeroContent();
  if (!content) return null;

  return (
    <Box id="home-section" bg="bkg-color" py={8}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="96vw"
        mx="auto"
        position="relative"
        minH="100vh"
      >
        {/* Background Color */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="var(--main-color)"
          borderRadius="8vh"
          zIndex={0}
        />

        {/* Image Box - Slightly smaller */}
        <Box
          position="relative"
          w="85%"           // <== Shrinks image width
          maxW="500px"      // <== Reduces the max image size
          zIndex={1}
          borderRadius="8vh"
          overflow="hidden"
          border="0.75vh solid var(--accent-color)"
        >
          <NextImage
            src="/assets/kai.webp"
            alt="Kai Webber"
            width={1000}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              borderRadius: '8vh',
            }}
          />
        </Box>

        {/* Text Box - Overlaps higher */}
        <Box
          position="relative"
          zIndex={2}
          bg="rgba(255, 255, 255, 0.8)"
          borderRadius="8vh"
          p={{ base: 4, sm: 6 }}
          boxShadow="0 0 10px rgba(0, 0, 0, 0.5)"
          w="95%"
          mt="-20vh"   // <== Increased overlap
        >
          <Box display="flex" flexDirection="column" gap={6}>
            <Heading
              as="h2"
              fontSize={{ base: "4vh", sm: "5vh" }}
              lineHeight={{ base: "4.5vh", sm: "5vh" }}
              textAlign="center"
            >
              {content.heading}
            </Heading>

            <Heading
              as="h3"
              fontSize={{ base: "2.5vh", sm: "3vh" }}
              lineHeight={{ base: "3vh", sm: "3.5vh" }}
              textAlign="center"
            >
              <i>{content.subheading}</i>
            </Heading>

            <Text
              fontSize={{ base: "1.8vh", sm: "2vh" }}
              lineHeight={{ base: "2.2vh", sm: "2.5vh" }}
              textAlign="center"
            >
              {content.description}
            </Text>

            <Box mx="auto">
              <MediaButtonWrapper />
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default HeroCompact;
