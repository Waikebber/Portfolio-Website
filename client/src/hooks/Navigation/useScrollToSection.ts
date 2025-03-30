const useScrollToSection = () => {
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
    return { scrollToSection }
}

  export default useScrollToSection