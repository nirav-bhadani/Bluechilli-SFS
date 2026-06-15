import type { StorageResult } from "@/lib/types";
import { PinIcon } from "@/components/icons";

export function StorageResultCard({ result }: { result: StorageResult }) {
  const rows: Array<[string, string | undefined]> = [
    ["Distance", result.distance],
    ["Sq ft", result.squareFeet],
    ["Storage type", result.storageType],
    ["Availability", result.availabilityDate],
  ];

  return (
    <article className="group rounded-2xl border border-[color:var(--hairline)] bg-white p-5 shadow-soft transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <PinIcon className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h4 className="font-heading text-base font-semibold leading-snug text-secondary">
            {result.title}
          </h4>
          <p className="text-base text-body">{result.location}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {rows
          .filter(([, v]) => Boolean(v))
          .map(([label, value]) => (
            <div key={label}>
              <dt className="text-base font-medium uppercase tracking-wide text-body/70">
                {label}
              </dt>
              <dd className="text-base text-secondary">{value}</dd>
            </div>
          ))}
      </dl>

      {result.facilities && result.facilities.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {result.facilities.map((f) => (
            <li
              key={f}
              className="rounded-full bg-secondary/[0.06] px-3 py-1.5 text-base text-secondary"
            >
              {f}
            </li>
          ))}
        </ul>
      )}

      {result.ctaLabel && (
        <a
          href={result.ctaHref ?? "#contact"}
          className="mt-4 inline-flex items-center gap-1 text-base font-semibold text-primary transition-transform duration-200 group-hover:gap-2"
        >
          {result.ctaLabel} <span aria-hidden>→</span>
        </a>
      )}
    </article>
  );
}
