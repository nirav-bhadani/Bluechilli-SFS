"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage, SuggestedAction } from "@/lib/types";
import { Markdown } from "./Markdown";
import { StorageResultCard } from "./StorageResultCard";
import { AttachmentPreview } from "./AttachmentPreview";
import { RetryIcon, SparkIcon, UserIcon } from "@/components/icons";

export function MessageList({
  messages,
  isStreaming,
  error,
  onRetry,
  onAction,
  className = "",
}: {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  onRetry: () => void;
  onAction: (action: SuggestedAction) => void;
  className?: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  return (
    <div className={`space-y-6 ${className}`} aria-live="polite" aria-atomic="false">
      {messages.map((message) => (
        <MessageRow key={message.id} message={message} onAction={onAction} />
      ))}

      {error && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3.5 text-base text-secondary">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="ml-auto inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <RetryIcon className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}

function MessageRow({
  message,
  onAction,
}: {
  message: ChatMessage;
  onAction: (action: SuggestedAction) => void;
}) {
  const isUser = message.role === "user";
  const isThinking =
    message.role === "assistant" && message.status === "streaming" && message.content === "";

  return (
    <div className={`flex animate-fade-up gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar isUser={isUser} />

      <div className={`min-w-0 max-w-[86%] ${isUser ? "items-end text-right" : "items-start"}`}>
        {message.attachments.length > 0 && (
          <div className={`mb-2 ${isUser ? "flex justify-end" : ""}`}>
            <AttachmentPreview attachments={message.attachments} />
          </div>
        )}

        <div
          className={`inline-block rounded-2xl px-4 py-3 text-left text-base leading-relaxed ${
            isUser
              ? "rounded-tr-md bg-secondary text-white"
              : "rounded-tl-md bg-secondary/[0.04] text-secondary"
          }`}
        >
          {isThinking ? (
            <ThinkingDots />
          ) : isUser ? (
            <span className="whitespace-pre-wrap">{message.content}</span>
          ) : (
            <Markdown content={message.content} />
          )}
        </div>

        {message.metadata?.results && message.metadata.results.length > 0 && (
          <div className="mt-3 grid gap-3 text-left sm:grid-cols-2">
            {message.metadata.results.map((r) => (
              <StorageResultCard key={r.id} result={r} />
            ))}
          </div>
        )}

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-left">
            {message.suggestedActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onAction(action)}
                className="rounded-full border border-[color:var(--hairline)] bg-white px-4 py-2 text-base font-medium text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ isUser }: { isUser: boolean }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        isUser ? "bg-secondary text-white" : "bg-primary text-white shadow-soft"
      }`}
      aria-hidden
    >
      {isUser ? <UserIcon className="h-4 w-4" /> : <SparkIcon className="h-4 w-4" />}
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1.5 py-1" aria-label="Assistant is thinking">
      <span className="h-2 w-2 animate-blink rounded-full bg-body/60" style={{ animationDelay: "0ms" }} />
      <span className="h-2 w-2 animate-blink rounded-full bg-body/60" style={{ animationDelay: "200ms" }} />
      <span className="h-2 w-2 animate-blink rounded-full bg-body/60" style={{ animationDelay: "400ms" }} />
    </span>
  );
}
