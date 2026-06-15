// ============================================================================
// agentService - the ONE backend-agnostic adapter layer.
//
// UI components (hero chat + full-screen assistant) call ONLY these functions.
// They never talk to an API/WebSocket/SDK directly. When James's backend is
// ready, implement it behind these functions and nowhere else.
//
//   // TODO: replace with James's backend
//   Swap the bodies of streamResponse / loadConversation / listConversations /
//   deleteConversation / submitLead / requestHumanHandover to call the real
//   REST / WebSocket / SSE / SDK. Keep the signatures identical so the UI is
//   untouched.
// ============================================================================

import type {
  Attachment,
  ChatMessage,
  Conversation,
  Lead,
  StorageResult,
  SuggestedAction,
} from "./types";
import { chunkText, getMockReply } from "./mockAgent";

export const USE_REAL_AI =
  process.env.NEXT_PUBLIC_USE_REAL_AI === "true";

const STORAGE_KEY = "sfs:conversations";

// --- analytics hook -------------------------------------------------------
// Replace with your analytics provider (GA4, Segment, PostHog, …).
function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // TODO: wire real analytics here.
  // window.dataLayer?.push({ event, ...payload });
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, payload);
  }
}

// --- local persistence (prototype only) -----------------------------------
function readStore(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

function writeStore(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    /* ignore quota / private mode errors */
  }
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function titleFrom(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean || "New chat";
}

// --- public adapter API ---------------------------------------------------

export function createConversation(): Conversation {
  const now = Date.now();
  const conversation: Conversation = {
    id: uid("conv"),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  const all = readStore();
  writeStore([conversation, ...all]);
  track("conversation_created", { conversationId: conversation.id });
  return conversation;
}

export function listConversations(): Conversation[] {
  // TODO: replace with James's backend (GET /conversations).
  return readStore().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function loadConversation(id: string): Conversation | null {
  // TODO: replace with James's backend (GET /conversations/:id).
  return readStore().find((c) => c.id === id) ?? null;
}

export function deleteConversation(id: string): void {
  // TODO: replace with James's backend (DELETE /conversations/:id).
  writeStore(readStore().filter((c) => c.id !== id));
  track("conversation_deleted", { conversationId: id });
}

// Persist a single message into a conversation (create the conv if missing).
export function saveMessage(conversationId: string, message: ChatMessage): void {
  const all = readStore();
  const idx = all.findIndex((c) => c.id === conversationId);
  if (idx === -1) return;
  const conv = all[idx];
  const existing = conv.messages.findIndex((m) => m.id === message.id);
  if (existing === -1) {
    conv.messages.push(message);
  } else {
    conv.messages[existing] = message;
  }
  conv.updatedAt = Date.now();
  if (conv.title === "New chat" && message.role === "user") {
    conv.title = titleFrom(message.content);
  }
  all[idx] = conv;
  writeStore(all);
}

export function buildUserMessage(
  conversationId: string,
  content: string,
  attachments: Attachment[] = [],
): ChatMessage {
  return {
    id: uid("msg"),
    conversationId,
    role: "user",
    content,
    timestamp: Date.now(),
    status: "complete",
    attachments,
  };
}

// sendMessage = persist the user's message. Streaming the reply is a separate
// call so the UI can render the user bubble immediately, then stream.
export function sendMessage(message: ChatMessage): ChatMessage {
  // TODO: replace with James's backend (POST /conversations/:id/messages).
  saveMessage(message.conversationId, message);
  track("message_sent", {
    conversationId: message.conversationId,
    attachments: message.attachments.length,
  });
  return message;
}

export interface StreamHandlers {
  onToken: (token: string) => void;
  onResults?: (results: StorageResult[]) => void;
  onSuggestedActions?: (actions: SuggestedAction[]) => void;
  signal?: AbortSignal;
}

// Streams the assistant reply. Returns the final assistant message.
// Routes through the Next.js API route when USE_REAL_AI is on, otherwise the
// local mock. Either path is reachable behind the SAME signature.
export async function streamResponse(
  conversationId: string,
  history: ChatMessage[],
  handlers: StreamHandlers,
): Promise<ChatMessage> {
  const assistant: ChatMessage = {
    id: uid("msg"),
    conversationId,
    role: "assistant",
    content: "",
    timestamp: Date.now(),
    status: "streaming",
    attachments: [],
    metadata: {},
  };

  track("response_stream_started", { conversationId, mode: USE_REAL_AI ? "real" : "mock" });

  try {
    if (USE_REAL_AI) {
      await streamFromApi(history, handlers, (t) => {
        assistant.content += t;
      });
    } else {
      await streamFromMock(history, handlers, assistant);
    }
    assistant.status = handlers.signal?.aborted ? "stopped" : "complete";
  } catch (err) {
    if (handlers.signal?.aborted) {
      assistant.status = "stopped";
    } else {
      assistant.status = "error";
      throw Object.assign(err instanceof Error ? err : new Error("Stream failed"), {
        partial: assistant,
      });
    }
  } finally {
    saveMessage(conversationId, assistant);
    track("response_stream_ended", { conversationId, status: assistant.status });
  }

  return assistant;
}

// --- real backend path (via secure Next.js API route) ---------------------
async function streamFromApi(
  history: ChatMessage[],
  handlers: StreamHandlers,
  append: (token: string) => void,
) {
  // The API route holds ANTHROPIC_API_KEY server-side; no key in browser code.
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: handlers.signal,
    body: JSON.stringify({
      messages: history
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Chat API error (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const token = decoder.decode(value, { stream: true });
    if (token) {
      append(token);
      handlers.onToken(token);
    }
  }
}

// --- mock path ------------------------------------------------------------
async function streamFromMock(
  history: ChatMessage[],
  handlers: StreamHandlers,
  assistant: ChatMessage,
) {
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const reply = getMockReply(lastUser?.content ?? "");

  // Simulated "thinking" pause.
  await delay(450, handlers.signal);

  for (const chunk of chunkText(reply.content)) {
    if (handlers.signal?.aborted) break;
    await delay(28, handlers.signal);
    assistant.content += chunk;
    handlers.onToken(chunk);
  }

  if (!handlers.signal?.aborted) {
    if (reply.results?.length) {
      assistant.metadata = { ...assistant.metadata, results: reply.results };
      handlers.onResults?.(reply.results);
    }
    if (reply.suggestedActions?.length) {
      assistant.suggestedActions = reply.suggestedActions;
      handlers.onSuggestedActions?.(reply.suggestedActions);
    }
  }
}

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) return resolve();
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        resolve();
      },
      { once: true },
    );
  });
}

// stopResponse - the UI owns an AbortController and calls abort(); this helper
// exists so the contract is explicit and analytics fire in one place.
export function stopResponse(controller: AbortController, conversationId: string): void {
  controller.abort();
  track("response_stopped", { conversationId });
}

// --- lead capture + human handover ----------------------------------------
export async function submitLead(lead: Lead): Promise<{ ok: boolean }> {
  // TODO: replace with James's backend (POST /leads or CRM webhook).
  track("lead_submitted", { hasConversation: Boolean(lead.conversationId) });
  await delay(500);
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[lead]", lead);
  }
  return { ok: true };
}

export async function requestHumanHandover(
  conversationId: string,
): Promise<{ ok: boolean; message: string }> {
  // TODO: replace with James's backend (notify sales / open live chat).
  track("human_handover_requested", { conversationId });
  await delay(400);
  return {
    ok: true,
    message:
      "A specialist has been notified. You can also call us on 01543 371970 or email contact@storagefulfilment.co.uk.",
  };
}
