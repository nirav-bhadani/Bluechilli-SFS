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
  ArrowRightIcon,
  BuildingIcon,
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
            <ChatInput
              onSend={(text, attachments) => void chat.send(text, attachments)}
              onStop={chat.stop}
              isStreaming={chat.isStreaming}
              placeholder="Type a message…"
            />
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
    hint: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
  }> = [
    {
      label: "Find warehouse space near Birmingham",
      hint: "Shared or dedicated storage",
      Icon: PinIcon,
    },
    {
      label: "Get a quote for pallet storage",
      hint: "Pay-as-you-use pricing",
      Icon: LayersIcon,
    },
    {
      label: "Set up e-commerce fulfilment",
      hint: "Pick, pack & dispatch",
      Icon: CartIcon,
    },
    {
      label: "I need overflow storage for peak",
      hint: "Flexible seasonal capacity",
      Icon: BuildingIcon,
    },
  ];

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 items-center justify-center rounded-2xl border border-[color:var(--hairline)] bg-white px-6 shadow-soft">
        <Image
          src="/sfs-logo-dark.svg"
          alt={siteConfig.legalName}
          width={140}
          height={41}
          className="h-9 w-auto"
        />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-secondary">How can I help you today?</h2>
      <p className="mt-2 max-w-md text-body">
        Ask about storage, warehousing or fulfilment - or get a quote in minutes.
      </p>

      <div className="mt-8 grid w-full max-w-5xl gap-3 sm:grid-cols-2">
        {prompts.map(({ label, hint, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPrompt(label)}
            className="group flex items-center gap-4 rounded-2xl border border-[color:var(--hairline)] bg-white p-4 text-left shadow-soft transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-secondary transition-colors group-hover:text-primary">
                {label}
              </span>
              <span className="mt-0.5 block text-sm text-body">{hint}</span>
            </span>
            <ArrowRightIcon className="h-4 w-4 shrink-0 text-body/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
}
