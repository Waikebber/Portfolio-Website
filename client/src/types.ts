export interface MediaButtonProps {
    imagePath: string;
    circleSize?: string;
    linkName: string;
    linkUrl: string;
    showTooltip?: boolean;
    color: string;
    onClick?: (e: React.MouseEvent) => void;
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

export interface NavbarProps {
    navItems: string[];
}