"use client";

import Image from "next/image";
import type { Attachment } from "@/lib/types";
import { CloseIcon, AttachIcon } from "@/components/icons";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentPreview({
  attachments,
  onRemove,
}: {
  attachments: Attachment[];
  onRemove?: (id: string) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2.5" aria-label="Attachments">
      {attachments.map((att) => (
        <li key={att.id}>
          {att.kind === "image" && att.url ? (
            <div className="group relative h-20 w-20 overflow-hidden rounded-xl border border-[color:var(--hairline)]">
              <Image
                src={att.url}
                alt={att.name}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
              {onRemove && (
                <RemoveButton onClick={() => onRemove(att.id)} label={`Remove ${att.name}`} />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-xl border border-[color:var(--hairline)] bg-secondary/[0.03] px-3.5 py-2.5">
              <AttachIcon className="h-5 w-5 shrink-0 text-body" />
              <span
                className="max-w-[180px] truncate text-base text-secondary"
                title={att.name}
              >
                {att.name}
              </span>
              <span className="text-base text-body/80">{formatSize(att.size)}</span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(att.id)}
                  className="text-body transition-colors hover:text-primary"
                  aria-label={`Remove ${att.name}`}
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/85 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    >
      <CloseIcon className="h-3.5 w-3.5" />
    </button>
  );
}
