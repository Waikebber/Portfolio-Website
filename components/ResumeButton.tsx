interface Props {
  url: string | null;
  variant?: "filled" | "outline";
}

const base =
  "inline-flex items-center justify-center h-[2.75rem] px-8 text-[0.8125rem] rounded-[0.25rem] transition-opacity";

const variants = {
  filled:  "bg-teal text-bg font-medium hover:opacity-90",
  outline: "bg-bg text-warm-white border border-white hover:opacity-80",
};

export default function ResumeButton({ url, variant = "filled" }: Props) {
  return (
    <a
      href={url ?? "#"}
      target={url ? "_blank" : undefined}
      rel={url ? "noopener noreferrer" : undefined}
      className={`${base} ${variants[variant]}`}
    >
      View resume
    </a>
  );
}
