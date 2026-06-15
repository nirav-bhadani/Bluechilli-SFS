import { ShieldIcon } from "@/components/icons";

export function ConsentLine({ className = "" }: { className?: string }) {
  return (
    <p className={`text-base leading-relaxed text-body/70 ${className}`}>
      <ShieldIcon aria-hidden className="mr-1.5 inline-block h-4 w-4 -translate-y-0.5 text-primary/70" />
      By messaging you accept our{" "}
      <a
        href="/privacy"
        className="font-medium text-secondary underline underline-offset-2 hover:text-primary"
      >
        Privacy Policy
      </a>
      . AI can make mistakes - please don&apos;t share sensitive or payment details.
    </p>
  );
}
