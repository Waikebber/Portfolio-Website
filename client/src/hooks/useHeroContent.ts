import { useEffect, useState } from "react";

export const useHeroContent = () => {
  const [data, setData] = useState<{ heading: string; subheading: string; description: string } | null>(null);

  useEffect(() => {
    fetch('/data/hero.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return data;
};

export default useHeroContent;
