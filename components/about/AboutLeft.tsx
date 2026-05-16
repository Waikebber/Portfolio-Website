import Portrait from "./Portrait";

export default function AboutLeft({ portraitUrl }: { portraitUrl: string }) {
  return (
    <div className="w-[25rem] shrink-0 max-md:w-full max-md:shrink">
      <p className="text-teal text-[0.6875rem] font-medium tracking-[0.18em] uppercase mb-2 max-md:text-[0.625rem] max-md:tracking-[0.2em] max-md:mb-[0.75rem]">
        About
      </p>
      <h1 className="text-warm-white text-[3.25rem] font-bold leading-none mb-[2rem] max-md:text-[clamp(2.5rem,10vw,3.25rem)] max-md:mb-0">
        Hi, I&apos;m Kai.
      </h1>
      <div className="max-md:mt-[1.25rem]">
        <Portrait src={portraitUrl} />
      </div>
    </div>
  );
}
