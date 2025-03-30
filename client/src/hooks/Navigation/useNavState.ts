import { useEffect, useState } from 'react'

const useNavState = (items: string[]) => {
  const [value, setValue] = useState(items[0])

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

  return { value, setValue }
}

export default useNavState;