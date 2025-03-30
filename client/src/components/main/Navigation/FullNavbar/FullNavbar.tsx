'use client'
import { useEffect, useRef, useState } from 'react'
import { Box, HStack, RadioGroup, Text } from '@chakra-ui/react'
import useNavState from '@/hooks/Navigation/useNavState'
import useScrollToSection from '@/hooks/Navigation/useScrollToSection'
import { NavbarProps } from '@/types'

const FullNavbar: React.FC<NavbarProps> = ({ navItems }) => {
  const { value, setValue } = useNavState(navItems)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })
  const { scrollToSection } = useScrollToSection()

  const handleChange = (details: { value: string | null }) => {
    if (details.value) {
      setValue(details.value)
      scrollToSection(details.value)
    }
  }

  // Update slider position when selected tab changes
  useEffect(() => {
    const current = itemRefs.current[value]
    const container = containerRef.current
    if (current && container) {
      const { offsetLeft, offsetWidth } = current
      setSliderStyle({ left: offsetLeft, width: offsetWidth })
    }
  }, [value, navItems])

  return (
    <RadioGroup.Root
      value={value}
      onValueChange={handleChange}
      name="navbar"
      orientation="horizontal"
    >
      <Box
        position="relative"
        bg="var(--bkg-color)"
        borderRadius="10vh"
        boxShadow="0 0 0.3vh rgba(24,94,224,0.15), 0 1vh 1.5vh rgba(24,94,224,0.15)"
        p="1vh"
        overflowX="auto"
        ref={containerRef}
      >
        <HStack
          as={RadioGroup.Label}
          aria-label="Main navigation"
          fontWeight="500"
          position="relative"
          gap={0}
          height="5.5vh"
          minWidth="max-content"
        >
          {navItems.map((item) => (
            <RadioGroup.Item
              key={item}
              value={item}
              aria-label={`Go to ${item} section`}
              ref={(el) => {
                itemRefs.current[item] = el;
              }}
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              zIndex={2}
              px="2.5vh"
              _hover={{ color: 'var(--ob-blue)' }}
              _checked={{
                color: 'var(--blk-text)',
              }}
            >
              <RadioGroup.ItemHiddenInput />
              <Text
                textTransform="capitalize"
                whiteSpace="nowrap"
                fontSize="2.5vh"
                letterSpacing="0.05em"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </RadioGroup.Item>
          ))}

          {/* Slider */}
          <Box
            aria-hidden="true"
            position="absolute"
            height="5.5vh"
            borderRadius="10vh"
            bg="var(--accent-color)"
            zIndex={0}
            transition="all 0.25s ease"
            left={sliderStyle.left}
            width={sliderStyle.width}
          />
        </HStack>
      </Box>
    </RadioGroup.Root>
  )
}

export default FullNavbar
