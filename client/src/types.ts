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
