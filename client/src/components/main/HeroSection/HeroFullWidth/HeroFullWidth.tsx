'use client';
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import MediaButtonWrapper from "@/components/mediaButtonWrapper/MediaButtonWrapper";
import useHeroContent from "@/hooks/useHeroContent";
import "@/styles/global.css";

const HeroFullWidth = () => {
  const content = useHeroContent();
  if (!content) return null;

  return (
    <Box id="home-section" bg="bkg-color" py={{ base: 8, md: 12 }}>
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        w="96vw"
        mx="auto"
        bg="var(--main-color)"
        borderRadius="8vh"
        p={{ base: 0, sm: 0.25, md: 0.5}}
        minH="80vh"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.5)"
      >
        {/* Main Text Section */}
        <Box
          flex={3}
          bg="var(--main-color)"
          borderRadius="8vh"
          p={{ base: "3vh", lg: "5vh" }}
          boxShadow="0 0 10px rgba(0, 0, 0, 0.5)"
          m={{ base: 0, md: "2vh 0 2vh 4vh" }} // top, right, bottom, left
        >
          <Box display="flex" flexDirection="column" gap={6}>
            <Heading
              as="h2"
              fontSize={{ base: "4vh", sm: "5vh", md: "6vh", lg: "8vh" }}
              mt="2.5vh"
            >
              {content.heading}
            </Heading>

            <Heading
              as="h3"
              fontSize={{ base: "2vh", sm: "2.5vh", md: "3vh", lg: "4vh" }}
              lineHeight={{ base: "2.5vh", sm: "3vh", md: "3.5vh", lg: "5vh" }}
            >
              <i>{content.subheading}</i>
            </Heading>

            <Text
              fontSize={{ base: "1vh", sm: "1.5vh", md: "2vh", lg: "2.3vh" }}
              lineHeight={{ base: "2.2vh", sm: "2.5vh", md: "2.8vh", lg: "3vh" }}
              mt={-2}
            >
              {content.description}
            </Text>

            <Box mx="auto">
              <MediaButtonWrapper />
            </Box>
          </Box>
        </Box>

        {/* Sidebar Image */}
        <Flex flex={2} p={8} align="center" justify="center">
          <NextImage
            src="/assets/kai.webp"
            alt="Kai Webber"
            width={400}
            height={400}
            style={{
              borderRadius: "8vh",
              border: "0.75vh solid var(--accent-color)",
              objectFit: "cover",
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default HeroFullWidth;
