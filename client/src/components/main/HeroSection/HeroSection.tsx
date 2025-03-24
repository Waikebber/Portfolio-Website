'use client';
import { Box, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import NextImage from "next/image";
import MediaButtonWrapper from "@/components/mediaButtonWrapper/MediaButtonWrapper";
import "@/styles/global.css";

const HeroSection = () => {
  const isPortrait = useBreakpointValue({ base: true, md: false });

  return (
    <Box id="home-section" bg="bkg-color" py={{ base: 8, md: 12 }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="96vw"
        mx="auto"
      >
        <Flex
          bg="var(--main-color)"
          borderRadius={{ base: "5vh", md: "8vh" }}
          p={{ base: 4, md: 8 }}
          w="full"
          minH={{ base: "auto", md: "80vh" }}
          boxShadow="0 0 10px rgba(0, 0, 0, 0.5)"
          direction={isPortrait ? "column" : "row"}
          align="center"
          justify="space-between"
        >

          {/* Main Text Section */}
          <Box
            flex={3}
            bg="var(--main-color)"
            borderRadius={{ base: "5vh", md: "8vh" }}
            p={{ base: 6, md: 10 }}
            boxShadow="0 0 10px rgba(0, 0, 0, 0.5)"
            m={{ base: 0, md: "2vh 0 2vh 3vh" }}
          >
            <Box display="flex" flexDirection="column" gap={6}>
              <Heading
                as="h2"
                fontSize={{ base: "5vh", md: "9vh" }}
                mt={{ base: 0, md: "2.5vh" }}
              >
                I&apos;m Kai,
              </Heading>

              <Heading
                as="h3"
                fontSize={{ base: "3vh", md: "4vh" }}
                lineHeight={{ base: "3vh", md: "5vh" }}
              >
                <i>Computer Science and<br />Computer Engineering Student</i>
              </Heading>

              <Text
                fontSize={{ base: "2vh", md: "2.5vh" }}
                lineHeight={{ base: "2vh", md: "3vh" }}
                mt={-2}
              >
                I am a passionate tech enthusiast with a love for innovation and
                problem-solving, currently studying at Northeastern University. I
                thrive on tackling complex challenges and creating impactful
                solutions. Whether it&apos;s coding new projects, exploring the latest
                tech trends, or collaborating on cutting-edge research, I am always
                eager to push boundaries and make a difference.
              </Text>
              <Box mx="auto">
                <MediaButtonWrapper />
              </Box>
            </Box>
          </Box>

          {/* Sidebar Image */}
          <Flex
            flex={2}
            p={8}
            mt={{ base: 8, md: 0 }}
            align="center"
            justify="center"
            order={{ base: -1, md: 0 }}
          >
            <NextImage
              src="/assets/kai.jpg"
              alt="Kai Webber"
              width={400}
              height={400}
              style={{ borderRadius: "8vh", border: "0.75vh solid var(--accent-color)", objectFit: "cover" }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default HeroSection;
