import { ImageIcon } from "./icons";

// Well-marked placeholder for real warehouse photography.
// TODO: replace with <Image src="/photos/..." /> - keep the same aspect ratio
// to avoid layout shift. Swap `ratio` to match the supplied asset.
export function ImagePlaceholder({
  ratio = "4 / 3",
  label = "Warehouse photo",
  className = "",
}: {
  ratio?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-[color:var(--hairline)] bg-[linear-gradient(135deg,#f1f3f4_0%,#e7eaec_100%)] ${className}`}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(34,38,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,38,42,0.04)_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <div className="relative flex flex-col items-center gap-2 text-secondary/45">
        <ImageIcon className="h-9 w-9" />
        <span className="text-base font-medium">{label}</span>
        <span className="text-base text-secondary/35">TODO: add real image · {ratio}</span>
      </div>
    </div>
  );
}
