"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import Image from "next/image";
import { useChat } from "./chat/useChat";
import { ChatInput } from "./chat/ChatInput";
import { MessageList } from "./chat/MessageList";
import { ConsentLine } from "./chat/ConsentLine";
import { siteConfig } from "@/lib/siteConfig";
import type { Conversation, SuggestedAction } from "@/lib/types";
import {
  ArchiveIcon,
  CartIcon,
  CloseIcon,
  LayersIcon,
  MenuIcon,
  PinIcon,
  PlusIcon,
  TrashIcon,
} from "./icons";

export default function FullScreenAssistant({ onClose }: { onClose: () => void }) {
  const chat = useChat();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasThread = chat.messages.length > 0;

  // Escape closes; lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleAction = (action: SuggestedAction) => {
    if (action.type === "prompt") void chat.send(action.value);
    else if (action.type === "handover") void chat.handover();
  };

  const selectAndClose = (id: string) => {
    chat.selectConversation(id);
    setDrawerOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SFS AI assistant"
      className="fixed inset-0 z-50 flex bg-white animate-fade-in"
    >
      {/* Sidebar (desktop) */}
      <Sidebar
        className="hidden w-72 shrink-0 md:flex"
        conversations={chat.conversations}
        activeId={chat.conversationId}
        onNew={chat.newConversation}
        onSelect={chat.selectConversation}
        onDelete={chat.removeConversation}
      />

      {/* Sidebar drawer (mobile) */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-black/40 md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <Sidebar
            className="fixed inset-y-0 left-0 z-20 flex w-72 md:hidden"
            conversations={chat.conversations}
            activeId={chat.conversationId}
            onNew={() => {
              chat.newConversation();
              setDrawerOpen(false);
            }}
            onSelect={selectAndClose}
            onDelete={chat.removeConversation}
          />
        </>
      )}

      {/* Main panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[color:var(--hairline)] px-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open conversations"
            className="flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-black/5 md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <span className="font-heading text-base font-semibold text-secondary">
            SFS Assistant
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-black/5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-4 py-6">
            {hasThread ? (
              <MessageList
                messages={chat.messages}
                isStreaming={chat.isStreaming}
                error={chat.error}
                onRetry={chat.retry}
                onAction={handleAction}
              />
            ) : (
              <EmptyState onPrompt={(p) => void chat.send(p)} />
            )}
          </div>
        </div>

        <div className="border-t border-black/10 bg-white px-4 py-3">
          <div className="mx-auto w-full max-w-5xl">
            <div className="rounded-2xl border border-[color:var(--hairline)] bg-white transition-all duration-200 focus-within:border-primary/40">
              <ChatInput
                onSend={(text, attachments) => void chat.send(text, attachments)}
                onStop={chat.stop}
                isStreaming={chat.isStreaming}
                placeholder="Type a Message…"
                large
                flat
                stacked
              />
            </div>
            <ConsentLine className="mt-2 text-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  className = "",
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
}: {
  className?: string;
  conversations: Conversation[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <aside className={`flex-col bg-secondary text-white ${className}`}>
      <div className="flex items-center px-4 py-4">
        <Image
          src="/sfs-logo.svg"
          alt={`${siteConfig.legalName} logo`}
          width={130}
          height={38}
          className="h-9 w-auto"
        />
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-xl border border-white/15 px-3.5 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
        >
          <PlusIcon className="h-4 w-4" /> New chat
        </button>
      </div>

      <p className="px-5 pb-2 pt-5 text-sm font-semibold uppercase tracking-[0.14em] text-white/40">
        Recent
      </p>

      <nav aria-label="Recent conversations" className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-sm text-white/40">No chats yet</p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <div
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    conv.id === activeId ? "bg-white/15" : "hover:bg-white/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(conv.id)}
                    className="min-w-0 flex-1 truncate text-left text-white/90"
                    title={conv.title}
                  >
                    {conv.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(conv.id)}
                    aria-label={`Delete ${conv.title}`}
                    className="shrink-0 text-white/40 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}

function EmptyState({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  const prompts: Array<{
    label: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
  }> = [
    { label: "Find warehouse space near you", Icon: PinIcon },
    { label: "Get a quote for pallet storage", Icon: LayersIcon },
    { label: "Set up e-commerce fulfilment", Icon: CartIcon },
    { label: "I need overflow storage for peak", Icon: ArchiveIcon },
  ];

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center">
      {/* Red speech-bubble heading */}
      <div className="relative z-20 flex w-fit max-w-full justify-center px-2">
        <h2 className="relative rounded-[20px] bg-primary px-7 py-4 text-center text-2xl font-bold leading-tight text-white shadow-lift sm:px-10 sm:text-[1.75rem]">
          How can I help you today?
          <span
            aria-hidden
            className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 rounded-[4px] bg-primary"
          />
        </h2>
      </div>

      <p className="mt-7 text-center text-base text-body">
        Ask about storage, warehousing or fulfilment - or get a quote in minutes.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[860px]:grid-cols-4">
        {prompts.map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPrompt(label)}
            className="group flex flex-col items-center gap-5 rounded-2xl bg-[color:var(--surface-muted)] p-5 text-center transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:bg-primary/[0.04] hover:shadow-soft"
          >
            <Icon className="h-8 w-8 text-secondary transition-colors duration-200 group-hover:text-primary" />
            <span className="text-base font-medium leading-snug text-secondary">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
