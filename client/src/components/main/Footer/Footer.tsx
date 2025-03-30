'use client';
import { Box, Text } from '@chakra-ui/react';
import MediaButtonWrapper from '../../mediaButtonWrapper/MediaButtonWrapper';

const Footer = () => {
  return (
    <Box
      as="footer"
      bg="black"
      color="white"
      fontSize="2vh"
      py="1vh"
      height="13vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <MediaButtonWrapper showTooltip={false} />

      <Text
        id="copy-right"
        fontSize="1.5vh"
        textAlign="center"
        mt="1vh"
      >
        &copy; 2025 Kai Webber
      </Text>
    </Box>
  );
};

export default Footer;
