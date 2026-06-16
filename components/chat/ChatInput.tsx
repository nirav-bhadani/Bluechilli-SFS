"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { Attachment } from "@/lib/types";
import { AttachIcon, ImageIcon, PlusIcon, SendIcon, SparkIcon, StopIcon } from "@/components/icons";
import { AttachmentPreview } from "./AttachmentPreview";

let attachmentSeq = 0;

function toAttachment(file: File, kind: "file" | "image"): Attachment {
  attachmentSeq += 1;
  return {
    id: `att_${attachmentSeq}_${Date.now()}`,
    name: file.name,
    mimeType: file.type,
    size: file.size,
    kind,
    url: kind === "image" ? URL.createObjectURL(file) : undefined,
  };
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  placeholder = "Type a message…",
  large = false,
  flat = false,
  stacked = false,
  autoFocus = false,
}: {
  onSend: (text: string, attachments: Attachment[]) => void;
  onStop: () => void;
  isStreaming: boolean;
  placeholder?: string;
  large?: boolean;
  flat?: boolean;
  stacked?: boolean;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the attach menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Auto-grow: start at one line, grow up to ~6 lines, then scroll. Keep the
  // inner scrollbar hidden until content actually exceeds the cap so no spinner
  // arrows / premature scrollbar ever show at rest.
  const maxHeight = large ? 188 : 152;
  const grow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  // Set the resting one-line height on mount (and when switching sizes).
  useEffect(grow, [large]);

  const submit = () => {
    if (isStreaming) return;
    if (!value.trim() && attachments.length === 0) return;
    onSend(value, attachments);
    setValue("");
    setAttachments([]);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.overflowY = "hidden";
      }
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const addFiles = (e: ChangeEvent<HTMLInputElement>, kind: "file" | "image") => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) {
      setAttachments((prev) => [...prev, ...files.map((f) => toAttachment(f, kind))]);
    }
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const canSend = value.trim().length > 0 || attachments.length > 0;

  const shell = flat
    ? "rounded-2xl bg-white"
    : "rounded-2xl border border-[color:var(--hairline)] bg-white shadow-soft transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-focus";

  const attachMenu = (
    <div
      role="menu"
      className="animate-scale-in absolute bottom-full left-0 z-30 mb-2 w-60 origin-bottom-left rounded-2xl border border-[color:var(--hairline)] bg-white p-1.5 shadow-lift"
    >
      <MenuItem
        onClick={() => {
          imageInputRef.current?.click();
          setMenuOpen(false);
        }}
        icon={<ImageIcon className="h-5 w-5" />}
        label="Add photos"
      />
      <MenuItem
        onClick={() => {
          fileInputRef.current?.click();
          setMenuOpen(false);
        }}
        icon={<AttachIcon className="h-5 w-5" />}
        label="Add files"
      />
    </div>
  );

  return (
    <div className={`${shell} ${stacked ? "p-3" : large ? "p-1.5" : "p-2.5"}`}>
      {attachments.length > 0 && (
        <div className="px-1 pb-3 pt-1">
          <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />
        </div>
      )}

      {stacked ? (
        <>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              grow();
            }}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Message"
            className={`w-full resize-none overflow-y-hidden bg-transparent px-2 py-1 leading-normal text-secondary outline-none [scrollbar-width:thin] placeholder:text-body/55 ${
              large ? "text-[1.0625rem]" : "text-base"
            }`}
          />

          <div className="mt-1 flex items-center justify-between">
            <div ref={menuRef} className="relative flex items-center gap-0.5">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center text-body"
              >
                <SparkIcon className="h-5 w-5" />
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Add photos and files"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                  menuOpen
                    ? "bg-secondary/10 text-secondary"
                    : "text-body hover:bg-secondary/5 hover:text-secondary"
                }`}
              >
                <AttachIcon className="h-5 w-5" />
              </button>
              {menuOpen && attachMenu}
            </div>

            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-white transition-all duration-200 hover:bg-secondary/90"
              >
                <StopIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                aria-label="Send message"
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
                  canSend
                    ? "text-secondary hover:bg-primary/5 hover:text-primary"
                    : "cursor-not-allowed text-body/35"
                }`}
              >
                <SendIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <div ref={menuRef} className="relative flex shrink-0 items-center pb-0.5">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Add photos and files"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                menuOpen
                  ? "bg-secondary/10 text-secondary"
                  : "text-body hover:bg-secondary/5 hover:text-secondary"
              }`}
            >
              <PlusIcon className={`h-5 w-5 transition-transform duration-200 ${menuOpen ? "rotate-45" : ""}`} />
            </button>

            {menuOpen && attachMenu}
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              grow();
            }}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Message"
            className={`flex-1 resize-none overflow-y-hidden bg-transparent py-1 leading-normal text-secondary outline-none [scrollbar-width:thin] placeholder:text-body/55 ${
              large ? "text-[1.0625rem]" : "text-base"
            }`}
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white transition-all duration-200 hover:scale-105 hover:bg-secondary/90"
            >
              <StopIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#b30014] text-white shadow-[0_4px_14px_rgba(229,0,25,0.35)] transition-all duration-200 ease-smooth enabled:hover:scale-105 enabled:hover:shadow-[0_6px_20px_rgba(229,0,25,0.45)] disabled:cursor-not-allowed disabled:from-secondary/20 disabled:to-secondary/20 disabled:shadow-none"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e, "file")}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e, "image")}
      />
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base text-secondary transition-colors duration-150 hover:bg-secondary/5"
    >
      <span className="text-body">{icon}</span>
      {label}
    </button>
  );
}
