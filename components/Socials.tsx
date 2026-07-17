// Brand social icons (LinkedIn / X / Facebook) — the exact downloaded glyphs,
// kept black as in the source SVGs (currentColor → text-black) with a hover
// fade. Each keeps its own aspect ratio (Facebook is a narrow "f"). Shared so
// the footer (and anywhere else) can reuse a single source of truth.
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    viewBox: "0 0 23 22",
    d: "M0 2.54612C0 1.8081 0.259016 1.19925 0.777027 0.719557C1.29504 0.239845 1.96848 0 2.7973 0C3.61133 0 4.26994 0.236147 4.77317 0.708487C5.29118 1.19557 5.55019 1.83024 5.55019 2.61254C5.55019 3.32103 5.29859 3.91142 4.79537 4.38376C4.27736 4.87084 3.59653 5.11439 2.7529 5.11439H2.7307C1.91666 5.11439 1.25805 4.87084 0.754826 4.38376C0.251601 3.89668 0 3.28412 0 2.54612ZM0.28861 21.9188V7.12915H5.21718V21.9188H0.28861ZM7.94788 21.9188H12.8764V13.6605C12.8764 13.1439 12.9357 12.7454 13.0541 12.4649C13.2613 11.9631 13.5758 11.5387 13.9976 11.1919C14.4194 10.845 14.9485 10.6716 15.5849 10.6716C17.2426 10.6716 18.0714 11.786 18.0714 14.0147V21.9188H23V13.4391C23 11.2546 22.482 9.59778 21.4459 8.46863C20.4099 7.33948 19.0409 6.7749 17.3388 6.7749C15.4295 6.7749 13.9421 7.59409 12.8764 9.23247V9.27675H12.8542L12.8764 9.23247V7.12915H7.94788C7.97747 7.60146 7.99228 9.07009 7.99228 11.535C7.99228 14 7.97747 17.4612 7.94788 21.9188Z",
  },
  {
    label: "X",
    href: "#",
    viewBox: "0 0 24 22",
    d: "M18.9014 0H22.5815L14.5415 9.18927L24 21.6938H16.5941L10.7935 14.1099L4.1563 21.6938H0.473924L9.07358 11.8648L0 0H7.59393L12.8372 6.93202L18.9014 0ZM17.6098 19.4911H19.649L6.48589 2.08705H4.29759L17.6098 19.4911Z",
  },
  {
    label: "Facebook",
    href: "#",
    viewBox: "0 0 11 22",
    d: "M7.13988 21.1807V11.5191H10.383L10.8686 7.75385H7.13988V5.34983C7.13988 4.25972 7.44264 3.51674 9.00606 3.51674L11 3.51582V0.148206C10.655 0.102486 9.47146 0 8.0945 0C5.21969 0 3.25153 1.75464 3.25153 4.97712V7.75396H0V11.5192H3.25143V21.1808L7.13988 21.1807Z",
  },
];

export function Socials({ className = "" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center gap-[40px] ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          className="text-black transition-colors hover:text-sfs-red"
        >
          <svg viewBox={s.viewBox} fill="currentColor" aria-hidden className="h-5 w-auto">
            <path d={s.d} />
          </svg>
        </a>
      ))}
    </div>
  );
}
