import { Box, Heading, List } from "@chakra-ui/react";
import { useState } from "react";
import { SkillBoxProps } from "@/types";

const SkillBox: React.FC<SkillBoxProps> = ({ category, skills }) => {
  const [active, setActive] = useState(false);

  return (
    <Box
      className="skills-box"
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent={active ? "flex-start" : "center"}
      alignItems="center"
      height={active ? "auto" : "43vh"}
      minHeight="43vh"
      width={{ base: "90%", md: active ? "30%" : "25%" }}
      m="1vh"
      p="2vh"
      textAlign="center"
      overflow="hidden"
      transition="all 0.3s ease-in-out"
      border="1vh solid var(--border-color)"
      borderRadius="5vh"
      boxShadow="0 0 2vh rgba(0, 0, 0, 0.1)"
      boxSizing="border-box"
      bg="var(--border-color)"
      cursor="pointer"
      onClick={() => setActive(!active)}
      _hover={{
        width: { md: "30%" },
        height: "auto",
        justifyContent: "flex-start",
      }}
    >
      <Heading
        as="h3"
        fontSize="3vh"
        lineHeight="4vh"
        px="2vh"
        m="0"
        transition="transform 0.5s ease-in-out, top 0.5s ease-in-out"
        position="absolute"
        top={active ? "2vh" : "50%"}
        left="50%"
        transform={active ? "translate(-50%, 0%)" : "translate(-50%, -50%)"}
        w="100%"
      >
        {category}
      </Heading>

      <List.Root
        className="skills-list"
        textAlign="center"
        listStyleType="none"
        p="1vh"
        mt="4vh"
        w="100%"
        fontSize="2vh"
        lineHeight="3vh"
      >
        {skills.map((skill, index) => (
          <List.Item
            key={index}
            m="0.5vh 0"
            opacity={active ? 1 : 0}
            transform={active ? "translateY(0)" : "translateY(2.29vh)"}
            transition="opacity 0.5s ease-in-out, transform 0.5s ease-in-out"
            transitionDelay={active ? "0.25s" : "0s"}
          >
            {skill}
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
};

export default SkillBox;
