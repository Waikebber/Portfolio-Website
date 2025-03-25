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