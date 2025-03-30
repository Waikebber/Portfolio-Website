import { useEffect, useState } from 'react'

const useNavState = (items: string[]) => {
  const [value, setValue] = useState(items[0])

  const scrollToSection = (id: string, duration = 500) => {
    const element = document.getElementById(`${id}-section`)
    if (!element) return
  
    const startY = window.scrollY
    const endY = element.getBoundingClientRect().top + startY - 55
    const distance = endY - startY
    let startTime: number | null = null
  
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
  
    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOutCubic(progress)
      window.scrollTo(0, startY + distance * eased)
  
      if (elapsed < duration) {
        requestAnimationFrame(animateScroll)
      }
    }
  
    requestAnimationFrame(animateScroll)
  }
  
  

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map(item => document.getElementById(`${item}-section`))
      const scrollPosition = window.scrollY + (document.getElementById('bar-section')?.clientHeight || 0) + 10

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && scrollPosition >= sections[i]!.offsetTop) {
          setValue(items[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  return { value, setValue, scrollToSection }
}

export default useNavState;