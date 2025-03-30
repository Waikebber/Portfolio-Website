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

  return { projects, loading, error };
};

export default useProjects;
