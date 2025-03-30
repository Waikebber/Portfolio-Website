export interface MediaButtonProps {
    imagePath: string;
    circleSize?: string;
    linkName: string;
    linkUrl: string;
    showTooltip?: boolean;
    color: string;
}

export interface SkillBoxProps {
    category: string;
    skills: string[];
}

export interface PhotoData {
    src: string;
    location: string;
}

export interface EnhancedPhotoData extends PhotoData {
    title: string;
    subtitle: string;
}

export type ExperienceItem = {
    title: string
    type: string
    description: string
    images: string[]
}

export interface Project {
    title: string;
    type: string;
    description: string;
    image: string;
    link: string;
    linkImage: string;
    displayImage: string;
}

export const projectGridAreaMap: Record<string, string> = {
    'This Website': 'box-2',
    'Robotic Arm': 'box-3',
    'March Madness Predictor': 'box-4',
    'SEE': 'box-5',
    'NEU SEDS, Rover Team': 'box-6',
    'NU Electric Racing Club': 'box-7',
    'UNET Image Classifier': 'box-8',
};
  
export const fitImageMap: Record<string, boolean> = {
    'SEE': false,
    'March Madness Predictor': false,
    'This Website': true,
    'Robotic Arm': false,
    'NU Electric Racing Club': false,
    'NEU SEDS, Rover Team': false,
    'UNET Image Classifier': false,
  };
  