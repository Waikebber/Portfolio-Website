export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="rounded-full border-2 animate-spin"
        style={{
          width: size,
          height: size,
          borderColor: "rgba(97,193,216,0.2)",
          borderTopColor: "#61c1d8",
        }}
      />
    </div>
  );
}
