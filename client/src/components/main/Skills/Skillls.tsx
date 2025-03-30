import { Box, Heading, Flex } from "@chakra-ui/react";
import SkillBox from "./SkillBox/SkillBox";
import { useSkillsData } from "@/hooks/useSkillsData";

const Skills: React.FC = () => {
  const skillsData = useSkillsData();

  return (
    <Box as="section" id="skills-section" bg="var(--bkg-color)" p="2vh">
      <Heading as="h2" fontSize="5vh" textAlign="center" p="3vh">
        Skills
      </Heading>

      <Flex
         className="skills-container"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-around" }}
        alignItems="center"
        flexWrap="wrap"
        maxW="1200px"
        mx="auto"
      >
        {skillsData.map((skillCategory, idx) => (
          <SkillBox
            key={idx}
            category={skillCategory.category}
            skills={skillCategory.skills}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default Skills;
