import { Box, Heading, Button, HStack } from '@chakra-ui/react';
import useResumeLinks from '@/hooks/useResume';

const Resume = () => {
  const resumeLinks = useResumeLinks();

  return (
    <Box
      as="section"
      id="resume-section"
      height="25vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="2vh"
      textAlign="center"
    >
      <Box>
        <Heading
          as="h2"
          mb="2.29vh"
          fontSize="3vh"
          lineHeight="4vh"
        >
          Find My Resume Here
        </Heading>
        <HStack gap="2.29vh" justify="center" fontSize="2vh" lineHeight="3vh">
          {resumeLinks.map(({ name, link }) => (
            <Button
              key={name}
              asChild
              bg="var(--main-color)"
              color="white"
              padding="1.145vh 2.29vh"
              borderRadius="0.573vh"
              _hover={{ bg: 'var(--accent-color)' }}
            >
              <a href={link} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </Button>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default Resume;
