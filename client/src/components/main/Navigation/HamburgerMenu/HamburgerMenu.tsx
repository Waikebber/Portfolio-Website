'use client'
import { Box } from '@chakra-ui/react'
import { NavbarProps } from '@/types'
import { useState } from 'react'
import useScrollToSection from '@/hooks/Navigation/useScrollToSection'
import HamburgerIcon from './HamburgerIcon/HamburgerIcon'

const HamburgerMenu: React.FC<NavbarProps> = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollToSection } = useScrollToSection()

  const handleClick = (item: string) => {
    scrollToSection(item)
    setIsOpen(false)
  }

  return (
    <>
      <HamburgerIcon 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
      />

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0,0,0,0.7)"
          zIndex="overlay"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            bg="var(--bkg-color)"
            borderRadius="2vh"
            p="4vh"
            width="80vw"
            maxWidth="400px"
            maxHeight="80vh"
            overflowY="auto"
            boxShadow="0 0 2vh rgba(0,0,0,0.2)"
          >
            {navItems.map((item) => (
              <Box
                key={item}
                as="button"
                display="block"
                width="100%"
                py="2vh"
                textAlign="center"
                fontSize="3vh"
                color="var(--text-color)"
                _hover={{
                  color: 'var(--accent-color)',
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s ease"
                onClick={() => handleClick(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}

export default HamburgerMenu