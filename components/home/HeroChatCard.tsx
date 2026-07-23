"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { useChat } from "@/components/chat/useChat";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import type { SuggestedAction } from "@/lib/types";
import {
  FigBoxIcon,
  FigCartIcon,
  FigLayersIcon,
  FigMarkerIcon,
  FigUserIcon,
} from "./figma-icons";

const GREETING = "Need commercial storage or warehouse space? Talk to us.";

type Chip = { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

// The 4 hero suggestion chips (Figma 89:1911) — icon + prompt. Clicking sends
// the prompt into the real assistant.
const CHIPS: Chip[] = [
  { label: "Find warehouse space near you", Icon: FigMarkerIcon },
  { label: "Get a quote for pallet storage", Icon: FigLayersIcon },
  { label: "Set up e-commerce fulfilment", Icon: FigCartIcon },
  { label: "I need overflow storage for peak", Icon: FigBoxIcon },
];

export function HeroChatCard() {
  const chat = useChat();
  const hasThread = chat.messages.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  // The chips no longer auto-scroll: the red rule beneath the thread doubles as
  // the scrollbar, so the row only moves when the user drags it (or scrolls the
  // row directly). Thumb width/offset mirror the visible fraction of the track.
  const chipsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });

  const syncThumb = useCallback(() => {
    const el = chipsRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    const visible = scrollWidth > 0 ? Math.min(1, clientWidth / scrollWidth) : 1;
    const max = scrollWidth - clientWidth;
    setThumb({
      width: visible * 100,
      left: max > 0 ? (scrollLeft / max) * (100 - visible * 100) : 0,
    });
  }, []);

  useEffect(() => {
    syncThumb();
    const el = chipsRef.current;
    const ro =
      el && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncThumb)
        : null;
    if (el) ro?.observe(el);
    window.addEventListener("resize", syncThumb);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", syncThumb);
    };
  }, [syncThumb]);

  // Map a pointer x on the bar to a scroll position on the chip row.
  const seek = (clientX: number) => {
    const bar = barRef.current;
    const el = chipsRef.current;
    if (!bar || !el) return;
    const r = bar.getBoundingClientRect();
    if (r.width <= 0) return;
    const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    el.scrollLeft = pct * (el.scrollWidth - el.clientWidth);
  };

  // Keep the newest message in view while streaming.
  useEffect(() => {
    if (hasThread && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages, hasThread]);

  const handleAction = (action: SuggestedAction) => {
    if (action.type === "prompt") void chat.send(action.value);
    else if (action.type === "handover") void chat.handover();
    else if (action.type === "lead")
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      data-hero-card
      className="relative mx-auto w-full max-w-[1024px] rounded-[8px] border border-black/10 bg-white/90 shadow-sfs-chat backdrop-blur-[10px] min-[1024px]:h-[592px]"
    >
      {/* Mascot — overlaps the top edge, horizontally centred (Figma 89:1910).
          Plain <img> so the SVG renders crisply and bypasses the image optimizer
          (which rejects SVG without dangerouslyAllowSVG). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-hero-mascot
        src="/figma-assets/chatglobe.svg"
        alt="SFS assistant"
        width={238}
        height={238}
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-[140px] w-[140px] -translate-x-1/2 -translate-y-[70px] select-none min-[1024px]:h-[238px] min-[1024px]:w-[238px] min-[1024px]:-translate-y-[119px]"
      />

      <div className="flex h-full flex-col px-[24px] pb-[24px] pt-[86px] min-[1024px]:pt-[139px]">
        {/* Conversation area */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
        >
          {hasThread ? (
            <MessageList
              messages={chat.messages}
              isStreaming={chat.isStreaming}
              error={chat.error}
              onRetry={chat.retry}
              onAction={handleAction}
            />
          ) : (
            <RestingBubbles />
          )}
        </div>

        {/* Red rule — Figma 89:2018 (200×2), now the draggable scrollbar for the
            chips. Padding widens the grab area without moving the 2px rule. */}
        <div
          ref={barRef}
          role="scrollbar"
          aria-label="Scroll suggestions"
          aria-controls="hero-chips"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(thumb.left)}
          tabIndex={0}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            seek(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragging.current) seek(e.clientX);
          }}
          onPointerUp={(e) => {
            dragging.current = false;
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onKeyDown={(e) => {
            const el = chipsRef.current;
            if (!el) return;
            if (e.key === "ArrowRight") el.scrollLeft += 160;
            else if (e.key === "ArrowLeft") el.scrollLeft -= 160;
          }}
          className="mb-[-8px] mt-[8px] w-[200px] max-w-full cursor-grab touch-none py-2 outline-none active:cursor-grabbing"
        >
          <div className="h-[2px] w-full rounded-full bg-sfs-red/25">
            <div
              className="h-full rounded-full bg-sfs-red"
              style={{ width: `${thumb.width}%`, marginLeft: `${thumb.left}%` }}
            />
          </div>
        </div>

        {/* Suggestion chips — scrolled by the bar above (or directly), never
            auto-rotating. Faded edges via .hero-chip-mask. */}
        <div
          id="hero-chips"
          ref={chipsRef}
          onScroll={syncThumb}
          className="hero-chip-mask mt-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-3">
            {CHIPS.map((chip) => (
              <ChipButton
                key={chip.label}
                chip={chip}
                onClick={() => void chat.send(chip.label)}
              />
            ))}
          </div>
        </div>

        {/* Input — reuses the shared auto-growing composer (no spinners, no inner
            scrollbar) wired to the real agent. */}
        <div className="mt-3 rounded-[8px] border-[0.5px] border-black/10 bg-white shadow-sfs-chat">
          <ChatInput
            onSend={(text, attachments) => void chat.send(text, attachments)}
            onStop={chat.stop}
            isStreaming={chat.isStreaming}
            placeholder="Type a Message..."
            large
            flat
            stacked
          />
        </div>
      </div>
    </div>
  );
}

// Single marquee chip (red split-pill, icon on the left).
function ChipButton({
  chip,
  onClick,
  ...rest
}: {
  chip: Chip;
  onClick: () => void;
} & { "aria-hidden"?: boolean }) {
  const { Icon } = chip;
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={rest["aria-hidden"] ? -1 : 0}
      className="group/chip inline-flex shrink-0 items-center  outline-none"
      {...rest}
    >
      <span className="grid h-[50px] w-[50px] place-items-center rounded-[8px] bg-sfs-red text-white transition-colors duration-300 group-hover/chip:bg-[#c40016]">
        <Icon className="h-6 w-6" />
      </span>
      <span className="flex h-[50px] items-center whitespace-nowrap rounded-[8px] bg-sfs-red px-[24px] font-body text-[16px] leading-[1.6] text-white transition-colors duration-300 group-hover/chip:bg-[#c40016]">
        {chip.label}
      </span>
    </button>
  );
}

// The Figma resting state: a greeting assistant bubble and a "typing" user
// bubble. Purely presentational — real turns replace this once the thread opens.
function RestingBubbles() {
  return (
    <div className="flex flex-col gap-5 pt-1">
      {/* Assistant */}
      <div className="flex items-start gap-3">
        <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma-assets/chatglobe.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
          />
        </span>
        <p className="max-w-[534px] rounded-[8px] rounded-tl-none bg-white p-[24px] font-body text-[18px] leading-[1.6] text-black shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          {GREETING}
        </p>
      </div>

      {/* User (decorative typing indicator) */}
      <div className="flex items-start justify-end gap-3">
        <span className="flex items-center gap-1 rounded-[8px] rounded-tr-none bg-sfs-red px-[24px] py-[26px]">
          <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
        </span>
        <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sfs-red text-white">
          <FigUserIcon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-blink rounded-full bg-white"
      style={{ animationDelay: delay }}
    />
  );
}
