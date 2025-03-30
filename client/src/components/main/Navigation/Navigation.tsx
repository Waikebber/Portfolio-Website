'use client'
import { Box, useBreakpointValue } from '@chakra-ui/react'
import FullNavbar from './FullNavbar/FullNavbar'
// import HamburgerMenu from './HamburgerMenu/HamburgerMenu'

const NAV_ITEMS = Array.from(
  [
    'home', 
    'experience', 
    'projects', 
    'skills', 
    'resume', 
    'photography', 
    'contact'
  ] as const)

const Navigation = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box
      as="header"
      id="bar-section"
      position="sticky"
      top="2vh"
      zIndex="sticky"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="10vh"
      paddingBottom="2.5vh"
    >
      {isMobile ? 
        <FullNavbar navItems={NAV_ITEMS} /> : 
        <FullNavbar navItems={NAV_ITEMS} />
      }
    </Box>
  )
}

export default Navigation