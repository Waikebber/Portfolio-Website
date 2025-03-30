import { useEffect, useState } from 'react';

export interface ResumeLink {
  name: string;
  link: string;
}

const useResume = () => {
  const [resumeLinks, setResumeLinks] = useState<ResumeLink[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data/resumes.json');
      const data = await response.json();
      setResumeLinks(data);
    };

    fetchData();
  }, []);

  return resumeLinks;
};

export default useResume;
