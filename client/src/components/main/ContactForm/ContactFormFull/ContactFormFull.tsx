// components/ContactFormFull.tsx
"use client";
import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  Fieldset,
  FieldsetContent,
  FieldLabel,
  FieldRoot,
  FieldsetErrorText,
  FieldsetLegend,
  chakra,
  HStack,
} from '@chakra-ui/react';
import useContactForm from '@/hooks/ContactForm/useContactForm';

const Form = chakra('form');

export default function ContactFormFull() {
  const {
    formRef,
    handleSubmit,
    isInvalid,
    errorMsg,
    successMsg,
  } = useContactForm();

  return (
    <Box
      id="contact-section"
      bg="var(--bkg-color)"
      color="var(--blk-text)"
      fontFamily="Karla, Merriweather, serif"
      fontSize="16px"
      lineHeight="1.6em"
      display="flex"
      justifyContent="center"
      p={{ base: '2vh', md: '7vh' }}
      overflow="hidden"
      zIndex={1}
    >
      <Box
        id="contact-partition"
        bg="rgb(245, 245, 244)"
        borderRadius="3vh"
        minH={{ base: '65vh', md: '75vh' }}
        maxH="90vh"
        minW="60%"
        p={{ base: '3vh', md: '7.5vh' }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        gap="6vh"
      >
        {/* Header */}
        <Box textAlign="center" lineHeight={{ base: '5vh', md: '7.5vh' }}>
          <Heading fontSize={{ base: '4vh', md: '5vh' }}>
            Contact Me
          </Heading>
          <Text fontSize={{ base: '2.25vh', md: '2.5vh' }}>
            Feel free to reach out!
          </Text>
        </Box>

        {/* Content: Form and Image side by side */}
        <Box
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          w="100%"
          gap="4vh"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* Form */}
          <Form
            id="contact-form"
            ref={formRef}
            onSubmit={handleSubmit}
            w={{ base: '100%', md: '60%' }}
          >
            <Fieldset.Root size="lg" invalid={isInvalid}>
              <FieldsetLegend display="none">Full Contact Form</FieldsetLegend>
              <FieldsetContent>
                <VStack gap="2vh" align="stretch">
                  <HStack gap="2vh" align="stretch">
                    <FieldRoot flex={1}>
                      <FieldLabel fontSize="1.75vh">First Name</FieldLabel>
                      <Input name="first_name" placeholder="Your Name..." p="10px" fontSize="1.5vh" required />
                    </FieldRoot>
                    <FieldRoot flex={1}>
                      <FieldLabel fontSize="1.75vh">Last Name</FieldLabel>
                      <Input name="last_name" placeholder="Your Last Name..." p="10px" fontSize="1.5vh" required />
                    </FieldRoot>
                  </HStack>
                  <HStack gap="2vh" align="stretch">
                    <FieldRoot flex={1}>
                      <FieldLabel fontSize="1.75vh">Subject</FieldLabel>
                      <Input name="subject" placeholder="Subject..." p="10px" fontSize="1.5vh" required />
                    </FieldRoot>
                    <FieldRoot flex={1}>
                      <FieldLabel fontSize="1.75vh">Email</FieldLabel>
                      <Input name="email" type="email" placeholder="Your Email..." p="10px" fontSize="1.5vh" required />
                    </FieldRoot>
                  </HStack>
                  <FieldRoot>
                    <FieldLabel fontSize="1.75vh">Message</FieldLabel>
                    <Textarea
                      name="message"
                      placeholder="Your Message..."
                      h="15vh"
                      resize="none"
                      p="10px"
                      fontSize="1.5vh"
                      required
                    />
                  </FieldRoot>
                </VStack>
              </FieldsetContent>

              {errorMsg && <FieldsetErrorText>{errorMsg}</FieldsetErrorText>}
              {successMsg && <Box color="green.500" mt={2}>{successMsg}</Box>}

              <Button
                id="submit"
                type="submit"
                mt="3vh"
                w="100%"
                bg="var(--main-color)"
                color="white"
                borderRadius="3vh"
                fontSize="2.5vh"
                _hover={{ bg: 'var(--secondary-color)' }}
              >
                Send
              </Button>
            </Fieldset.Root>
          </Form>

          {/* Image */}
          <Box w={{ base: '100%', md: '35%' }} display="flex" justifyContent="center">
            <Image
              src="/assets/cute-monk.webp"
              alt="Contact"
              borderRadius="3vh"
              boxShadow="0 0 1vh 0 rgb(0 0 0 / 50%)"
              h={{ base: '25vh', md: '45vh' }}
              w="auto"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}