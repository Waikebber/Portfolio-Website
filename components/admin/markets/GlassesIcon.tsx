export default function GlassesIcon({ active, size = 20 }: { active: boolean; size?: number }) {
  const color = active ? "#61c1d8" : "currentColor";
  return (
    <svg width={size} height={size * 9 / 22} viewBox="0 0 22 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.6" y="0.6" width="8.4" height="7.8" rx="2.6" stroke={color} strokeWidth="1.2" />
      <line x1="9" y1="4.5" x2="13" y2="4.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="13" y="0.6" width="8.4" height="7.8" rx="2.6" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}
