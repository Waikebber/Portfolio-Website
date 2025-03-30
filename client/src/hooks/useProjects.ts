import { useEffect, useState } from 'react';
import { Project } from '@/types';

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/data/projects.json');
        if (!res.ok) throw new Error(`Failed to load: ${res.statusText}`);
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  const projectGridAreaMap: Record<string, string> = {
    'This Website': 'box-2',
    'Robotic Arm': 'box-3',
    'March Madness Predictor': 'box-4',
    'SEE': 'box-5',
    'NEU SEDS, Rover Team': 'box-6',
    'NU Electric Racing Club': 'box-7',
    'UNET Image Classifier': 'box-8',
  };

  const fitImageMap: Record<string, boolean> = {
    'SEE': false,
    'March Madness Predictor': false,
    'This Website': true,
    'Robotic Arm': false,
    'NU Electric Racing Club': false,
    'NEU SEDS, Rover Team': false,
    'UNET Image Classifier': false,
  };

  const imagePositionMap: Record<string, string> = {
    'SEE': 'center 20%',
    'March Madness Predictor': 'center 50%',
    'UNET Image Classifier': 'center 35%',
  };

  return { 
    projects, 
    projectGridAreaMap, 
    fitImageMap, 
    imagePositionMap,
    loading, 
    error 
  };
};

export default useProjects;
