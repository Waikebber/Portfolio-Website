import { useEffect, useState } from 'react';
import { EnhancedPhotoData } from '@/types';

const usePhotographyData = () => {
  const [photos, setPhotos] = useState<EnhancedPhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch('/data/images.csv');
        const text = await response.text();
        const lines = text.trim().split('\n');

        const parsed: EnhancedPhotoData[] = lines.map((line) => {
          const [file, ...locationRaw] = line.split(',');
          const location = locationRaw.join(',').replace(/(^"|"$)/g, '').trim().slice(0, -1);
        
          const title = locationRaw[0].replace(/(^"|"$)/g, '').trim();
          const subtitle = locationRaw.slice(1).join(',').replace(/(^"|"$)/g, '').trim().slice(0, -1);
        
          return {
            src: `/assets/photography/${file.trim()}`,
            location,
            subtitle,
            title,
          };
        });

        setPhotos(parsed);
      } catch (err) {
        setError(`Failed to load images: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCSV();
  }, []);

  return { photos, loading, error };
};

export default usePhotographyData;
