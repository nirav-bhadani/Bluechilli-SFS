"use client";

import type { ComponentType, SVGProps } from "react";
import { useChat } from "./chat/useChat";
import { ChatInput } from "./chat/ChatInput";
import { MessageList } from "./chat/MessageList";
import { ConsentLine } from "./chat/ConsentLine";
import type { SuggestedAction } from "@/lib/types";
import { ArchiveIcon, CartIcon, LayersIcon, PinIcon, PlusIcon } from "./icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const PLACEHOLDER = "Type a Message…";

const prompts: Array<{ label: string; Icon: Icon }> = [
  { label: "Find warehouse space near you", Icon: PinIcon },
  { label: "Get a quote for pallet storage", Icon: LayersIcon },
  { label: "Set up e-commerce fulfilment", Icon: CartIcon },
  { label: "I need overflow storage for peak", Icon: ArchiveIcon },
];

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
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f8f9_100%)]"
    >
      {/* Layered background treatment - dotted grid, brand glow + cool blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:radial-gradient(rgba(34,38,42,0.05)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18%] h-[520px] w-[900px] max-w-[130vw] -translate-x-1/2 animate-glow-pulse rounded-full bg-secondary/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[24%] h-[360px] w-[360px] rounded-full bg-secondary/[0.06] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent"
      />

      <div className="container-content relative pb-6 pt-16 sm:pt-20 md:pb-8 md:pt-24">
        <div className="relative mx-auto max-w-4xl">
          {/* Red speech-bubble heading */}
          <div className="relative z-20 mx-auto flex w-fit max-w-full justify-center px-2">
            <h1
              id="hero-heading"
              className="animate-fade-in relative rounded-[20px] bg-primary px-7 py-4 text-center text-2xl font-bold leading-tight text-white shadow-lift sm:px-10 sm:text-[1.75rem]"
            >
              How can I help you today?
              <span
                aria-hidden
                className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 rounded-[4px] bg-primary"
              />
            </h1>
          </div>

          {/* White assistant card */}
          <div className="animate-scale-in relative z-10 -mt-4 rounded-[28px] bg-white p-5 shadow-lift sm:p-8 sm:pt-10">
            <p className="text-center text-base text-body">
              Ask about storage, warehousing or fulfilment - or get a quote in minutes.
            </p>

            {hasThread ? (
              <>
                <div className="mt-5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={chat.newConversation}
                    className="inline-flex items-center gap-1.5 text-base font-semibold text-primary transition-opacity hover:opacity-80"
                  >
                    <PlusIcon className="h-4 w-4" /> New conversation
                  </button>
                </div>
                <div
                  data-lenis-prevent
                  className="mt-3 max-h-[46vh] overflow-y-auto overscroll-contain px-1 py-2"
                >
                  <MessageList
                    messages={chat.messages}
                    isStreaming={chat.isStreaming}
                    error={chat.error}
                    onRetry={chat.retry}
                    onAction={handleAction}
                  />
                </div>
              </>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[860px]:grid-cols-4">
                {prompts.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => void chat.send(p.label)}
                    className="group flex flex-col items-center gap-5 rounded-2xl bg-[color:var(--surface-muted)] p-5 text-center transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:bg-primary/[0.04] hover:shadow-soft"
                  >
                    <p.Icon className="h-8 w-8 text-secondary transition-colors duration-200 group-hover:text-primary" />
                    <span className="text-base font-medium leading-snug text-secondary">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat input */}
            <div className="mt-4 rounded-2xl border border-[color:var(--hairline)] bg-white transition-all duration-200 focus-within:border-primary/40">
              <ChatInput
                onSend={(text, attachments) => void chat.send(text, attachments)}
                onStop={chat.stop}
                isStreaming={chat.isStreaming}
                placeholder={hasThread ? "Reply…" : PLACEHOLDER}
                large
                flat
                stacked
              />
            </div>
          </div>

          <ConsentLine className="mx-auto mt-5 max-w-2xl text-center" />
        </div>
      </div>
    </section>
  );
}
