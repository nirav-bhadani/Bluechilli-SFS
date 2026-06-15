"use client";

import { useChat } from "./chat/useChat";
import { ChatInput } from "./chat/ChatInput";
import { MessageList } from "./chat/MessageList";
import { ConsentLine } from "./chat/ConsentLine";
import { starterPrompts } from "@/lib/mockAgent";
import type { SuggestedAction } from "@/lib/types";
import { CheckIcon, PlusIcon, SparkIcon } from "./icons";

const HEADLINE =
  "What storage, warehousing or fulfilment support does your business need?";
const PLACEHOLDER =
  'Describe your requirement, e.g. "I need 15,000 sq ft of temporary warehouse space near Birmingham."';

const proofPoints = ["Instant, specific answers", "No contact form", "Talk to a human anytime"];

export function HeroChat() {
  const chat = useChat();
  const hasThread = chat.messages.length > 0;

  const handleAction = (action: SuggestedAction) => {
    if (action.type === "prompt") void chat.send(action.value);
    else if (action.type === "handover") void chat.handover();
    else if (action.type === "lead")
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f4f6f7_100%)]"
    >
      {/* Layered background treatment - dotted grid, brand glow + cool blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:radial-gradient(rgba(34,38,42,0.05)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18%] h-[520px] w-[900px] max-w-[130vw] -translate-x-1/2 animate-glow-pulse rounded-full bg-primary/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[24%] h-[360px] w-[360px] rounded-full bg-secondary/[0.06] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent"
      />

      <div className="container-content relative pb-20 pt-16 sm:pt-20 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <span className="animate-fade-in inline-flex max-w-full items-center gap-2 whitespace-normal rounded-2xl border border-[color:var(--hairline)] bg-white/80 px-4 py-2 text-left text-base font-medium text-secondary shadow-soft backdrop-blur min-[375px]:whitespace-nowrap min-[375px]:rounded-full">
            <SparkIcon className="h-4 w-4 shrink-0 text-primary" />
            Innovative · Unique · Tailored solutions
          </span>
          <h1
            id="hero-heading"
            className="mt-6 text-balance text-3xl font-bold leading-[1.08] text-secondary sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {HEADLINE}
          </h1>
          <p className="mx-auto mt-5 max-w-prose text-pretty text-lg text-body">
            Skip the contact form. Tell our AI assistant what you need - space,
            pallets, fulfilment or a specialist - and get a fast, specific answer.
          </p>

          {/* Inline proof row */}
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base font-medium text-secondary">
            {proofPoints.map((point) => (
              <li key={point} className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          {hasThread && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-medium text-body">Your conversation</span>
              <button
                type="button"
                onClick={chat.newConversation}
                className="inline-flex items-center gap-1.5 text-base font-semibold text-primary transition-opacity hover:opacity-80"
              >
                <PlusIcon className="h-4 w-4" /> New conversation
              </button>
            </div>
          )}

          {/* The premium chat surface - soft glow + gradient hairline ring. */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-3 -z-10 rounded-[34px] bg-primary/[0.08] blur-2xl"
            />
            <div className="animate-scale-in rounded-[28px] bg-gradient-to-b from-white/90 via-[color:var(--hairline)] to-transparent p-px shadow-lift">
              <div className="rounded-[27px] bg-white/90 p-1.5 backdrop-blur sm:p-2">
                {hasThread && (
                  <div className="max-h-[46vh] overflow-y-auto px-3 py-4 sm:px-5">
                    <MessageList
                      messages={chat.messages}
                      isStreaming={chat.isStreaming}
                      error={chat.error}
                      onRetry={chat.retry}
                      onAction={handleAction}
                    />
                  </div>
                )}

                <ChatInput
                  onSend={(text, attachments) => void chat.send(text, attachments)}
                  onStop={chat.stop}
                  isStreaming={chat.isStreaming}
                  placeholder={hasThread ? "Reply…" : PLACEHOLDER}
                  large
                  flat
                />
              </div>
            </div>
          </div>

          {!hasThread && (
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void chat.send(prompt)}
                  className="chip"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <ConsentLine className="mx-auto mt-6 max-w-2xl text-center" />
        </div>
      </div>
    </section>
  );
}
