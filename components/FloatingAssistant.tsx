"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ChatIcon } from "./icons";

// Lazy-load the heavy assistant so it never affects initial PageSpeed/LCP.
const FullScreenAssistant = dynamic(() => import("./FullScreenAssistant"), {
  ssr: false,
});

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="btn-primary fixed bottom-6 right-6 z-40 px-5 py-3.5 shadow-lift shadow-primary/25"
      >
        <ChatIcon className="h-5 w-5" />
        <span>Ask SFS</span>
      </button>

      {open && <FullScreenAssistant onClose={() => setOpen(false)} />}
    </>
  );
}
