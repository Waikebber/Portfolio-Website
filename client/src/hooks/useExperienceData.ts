import { useEffect, useState } from 'react'
import { ExperienceItem } from '@/types'

export const useExperienceData = () => {
  const [experience, setExperience] = useState<ExperienceItem[]>([])

  useEffect(() => {
    import('../../public/data/experience.json')
      .then((data) => {
        setExperience(data.experience)
      })
      .catch((err) => {
        console.error('Failed to load experience data:', err)
      })
  }, [])

  return experience
}
