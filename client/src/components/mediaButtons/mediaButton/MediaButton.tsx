'use client';
import React from "react";
import { Box, Link as ChakraLink } from "@chakra-ui/react";
import NextImage from "next/image";
import { MediaButtonProps } from "@/types";

const MediaButton = ({
  imagePath,
  circleSize = "6.058vh",
  linkName,
  linkUrl,
  showTooltip = true,
  color,
}: MediaButtonProps) => {
  const buttonContent = (
    <Box
      position="relative"
      bg="var(--bkg-color)"
      borderRadius="50%"
      p="1vh"
      margin="1.212vh"
      w={circleSize}
      h={circleSize}
      display="flex"
      justifyContent="center"
      alignItems="center"
      boxShadow="0 1.212vh 1.212vh rgba(0, 0, 0, 0.1)"
      cursor="pointer"
      transition="all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      _hover={{
        bg: color,
        color: "white",
        "& img": {
          filter: linkName === "github" || linkName === "email" || linkName === "linkedin" ? "invert(100%)" : "none",
        },
      }}
    >
      <NextImage
        src={imagePath}
        alt={`${linkName} Icon`}
        width={30}
        height={30}
        style={{ objectFit: "contain" }}
      />
      {showTooltip && (
        <Box
          position="absolute"
          top="-5.452vh"
          fontSize="1.696vh"
          bg="var(--bkg-color)"
          color="var(--bkg-color)"
          padding="0.606vh 0.969vh"
          borderRadius="0.606vh"
          boxShadow="0 1.212vh 1.212vh rgba(0, 0, 0, 0.1)"
          opacity={0}
          pointerEvents="none"
          transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
          _groupHover={{
            opacity: 1,
            visibility: "visible",
            pointerEvents: "auto",
          }}
          _before={{
            content: '""',
            position: "absolute",
            height: "0.969vh",
            width: "0.969vh",
            bg: "var(--bkg-color)",
            bottom: "-0.363vh",
            left: "50%",
            transform: "translate(-50%) rotate(45deg)",
            transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          }}
        >
          {linkName}
        </Box>
      )}
    </Box>
  );

  return (
    <ChakraLink href={linkUrl}>
      <Box as="li" listStyleType="none">
        {buttonContent}
      </Box>
    </ChakraLink>
  );
};

export default MediaButton;