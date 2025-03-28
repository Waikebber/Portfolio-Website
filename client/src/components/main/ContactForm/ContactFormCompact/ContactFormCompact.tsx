"use client";
import {
  Box,
  Button,
  Heading,
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
} from '@chakra-ui/react';
import useContactForm from '@/hooks/ContactForm/useContactForm';

const Form = chakra('form');

export default function ContactFormCompact() {
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
      p={{ base: '2vh', md: '3vh' }}
      overflow="hidden"
      h="100vh"
      zIndex={1}
    >
      <Box
        id="contact-partition"
        bg="rgb(245, 245, 244)"
        borderRadius="3vh"
        minH={{ base: '75vh', md: '80vh' }}
        maxH="90vh"
        minW="90%"
        p={{ base: '3vh', md: '3vh' }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3vh"
      >
        <Box id="header-group" textAlign="center" lineHeight={{ base: '4.5vh', md: '7vh' }}>
          <Heading id="contact-me" fontSize={{ base: '4vh', md: '5vh' }}>
            Contact Me
          </Heading>
          <Text id="contact-sub" fontSize={{ base: '2.25vh', md: '2.5vh' }}>
            Feel free to reach out!
          </Text>
        </Box>

        <Form
          id="contact-form"
          ref={formRef}
          onSubmit={handleSubmit}
          w="100%"
          maxW="700px"
        >
          <Fieldset.Root size="lg" invalid={isInvalid}>
            <FieldsetLegend display="none">Compact Contact Form</FieldsetLegend>
            <FieldsetContent>
              <VStack gap="2vh" align="stretch">
                <FieldRoot>
                  <FieldLabel fontSize="1.75vh">First Name</FieldLabel>
                  <Input name="first_name" placeholder="Your Name..." p='10px' fontSize="1.5vh" required />
                </FieldRoot>
                <FieldRoot>
                  <FieldLabel fontSize="1.75vh">Last Name</FieldLabel>
                  <Input name="last_name" placeholder="Your Last Name..." p='10px' fontSize="1.5vh" required />
                </FieldRoot>
                <FieldRoot>
                  <FieldLabel fontSize="1.75vh">Email</FieldLabel>
                  <Input name="email" type="email" placeholder="Your Email..." p='10px' fontSize="1.5vh"  required />
                </FieldRoot>
                <FieldRoot>
                  <FieldLabel fontSize="1.75vh">Subject</FieldLabel>
                  <Input name="subject" placeholder="Subject..." p='10px' fontSize="1.5vh" required />
                </FieldRoot>
                <FieldRoot>
                  <FieldLabel fontSize="1.75vh">Message</FieldLabel>
                  <Textarea
                    name="message"
                    placeholder="Your Message..."
                    h="15vh"
                    resize="none"
                    p='10px'
                    fontSize="1.25vh"
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
      </Box>
    </Box>
  );
}
