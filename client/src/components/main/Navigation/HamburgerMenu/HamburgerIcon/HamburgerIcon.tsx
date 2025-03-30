'use client'
import { Box, CloseButton } from '@chakra-ui/react'

interface HamburgerIconProps {
  isOpen: boolean
  onClick: () => void
}

const HamburgerIcon = ({ isOpen, onClick }: HamburgerIconProps) => {
  return (
    <Box
      position="fixed"
      top="2vh"
      left="2vh"
      zIndex="modal"
      bg="rgba(255,255,255,0.9)"
      borderRadius="full"
      width="7vh"
      height="7vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="0.5vh"
      cursor="pointer"
    >
      {isOpen ? (
        <CloseButton
          onClick={onClick}
          size="2xl"
          color="var(--main-color)"
          _hover={{ bg: 'none' }}
        />
      ) : (
        <Box onClick={onClick}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              height="0.4vh"
              width="3.2vh"
              bg="var(--main-color)"
              my="0.4vh"
              borderRadius="0.2vh"
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default HamburgerIcon