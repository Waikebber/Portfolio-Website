"use client";

import {
  Accordion,
  Box,
  Heading,
  Image,
  Flex,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useExperienceData } from "@/hooks/useExperienceData";

export default function ExperienceSection() {
  const experience = useExperienceData();

  return (
    <Box id="experience" py={16} px={{ base: 4, md: 8 }} bg="var(--main-color)">
      <Box
        border="0.25vh solid"
        borderColor="var(--secondary-color)"
        borderRadius="2vh"
        p={{ base: 5, md: 8 }}
        bg="var(--bkg-color)"
        maxW={{ base: "100%", xl: "1500px" }}
        mx="auto"
      >
        <Heading
          as="h2"
          fontSize={{ base: "3xl", md: "5xl" }}
          textAlign="center"
          mb={12}
          color="var(--blk-txt)"
        >
          Experience
        </Heading>
        <Accordion.Root variant="subtle" collapsible defaultValue={["exp-0"]}>
          <Stack gap={4}>
            {experience.map((item, index) => (
              <Accordion.Item
                key={index}
                value={`exp-${index}`}
                bg={"var(--bkg-color)"}
              >
                <Accordion.ItemTrigger
                  px={4}
                  py={3}
                  borderRadius="lg"
                  boxShadow="md"
                  _expanded={{
                    boxShadow:
                      "3px 0 5px rgba(0, 0, 0, 0.2), -3px 0 5px rgba(0, 0, 0, 0.2)",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                >
                  <Box flex="1" w="100%" textAlign="center">
                    <Stack gap={1}>
                      <Span
                        fontWeight="semibold"
                        fontSize="2.75vh"
                        lineHeight="3.3vh"
                        textAlign="center"
                      >
                        {item.title}
                      </Span>
                      <Text
                        fontSize="2vh"
                        color="gray.500"
                        textAlign="center"
                        lineHeight="2.5vh"
                      >
                        {item.type}
                      </Text>
                    </Stack>
                  </Box>

                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent
                  p={6}
                  bg={"var(--bkg-color)"}
                  boxShadow={
                    "3px 3px 5px rgba(0, 0, 0, 0.2), -3px 3px 5px rgba(0, 0, 0, 0.2)"
                  }
                  borderRadius="lg"
                  borderTopLeftRadius="0px"
                  borderTopRightRadius="0px"
                  mt={-0.25}
                >
                  <Accordion.ItemBody>
                    <Flex
                      direction={{
                        base: "column",
                        md: index % 2 === 0 ? "row" : "row-reverse",
                      }}
                      gap={6}
                      align="center"
                    >
                      {item.images?.length > 0 && (
                        <Box flex="1" maxW={{ base: "100%", md: "50%" }}>
                          <Image
                            src={item.images[0]}
                            alt={`${item.title} image`}
                            borderRadius="md"
                            objectFit="cover"
                            maxH="300px"
                            w="100%"
                          />
                        </Box>
                      )}
                      <Box flex="1">
                        {item.description && (
                          <Text fontSize="md">{item.description}</Text>
                        )}
                      </Box>
                    </Flex>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Stack>
        </Accordion.Root>
      </Box>
    </Box>
  );
}
