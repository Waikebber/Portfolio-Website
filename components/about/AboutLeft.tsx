import Portrait from "./Portrait";

export default function AboutLeft({ portraitUrl }: { portraitUrl: string }) {
  return (
    <div className="w-[25rem] shrink-0">
      <p className="text-teal text-[0.6875rem] font-medium tracking-[0.18em] uppercase mb-2">
        About
      </p>
      <h1 className="text-warm-white text-[3.25rem] font-bold leading-none mb-[2rem]">
        Hi, I&apos;m Kai.
      </h1>
      <Portrait src={portraitUrl} />
    </div>
  );
}
