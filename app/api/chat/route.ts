import Anthropic from "@anthropic-ai/sdk";
import type { ChatRequestMessage } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

// Runs on the server only. ANTHROPIC_API_KEY is never sent to the browser -
// the client calls this route, this route calls Claude.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const SYSTEM_PROMPT = `You are the AI assistant for ${siteConfig.legalName} (SFS), a UK warehousing and fulfilment company based at ${siteConfig.contact.street}, ${siteConfig.contact.locality}, ${siteConfig.contact.postalCode}.

SFS services: shared-user warehousing, dedicated site warehousing, B2B logistics and delivery, e-commerce fulfilment, co-packing, and reverse logistics. You serve customers across the UK.

Your job: help visitors describe their storage, warehousing or fulfilment needs and guide them toward a quote. Be warm, plain-spoken and specific. Ask one focused follow-up question when you need volume, location or timing. Use short paragraphs and bullet points. Never invent precise prices or guaranteed availability - instead offer to connect the visitor with a specialist (phone ${siteConfig.contact.phone}, email ${siteConfig.contact.email}). Keep replies concise.`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      "The AI assistant is not configured yet. Set ANTHROPIC_API_KEY or use the mock agent (NEXT_PUBLIC_USE_REAL_AI=false).",
      { status: 503 },
    );
  }

  let messages: ChatRequestMessage[];
  try {
    const body = (await req.json()) as { messages?: ChatRequestMessage[] };
    messages = (body.messages ?? []).filter(
      (m) => m.role !== "system" && typeof m.content === "string",
    );
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  if (messages.length === 0) {
    return new Response("No messages provided.", { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const completion = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        });

        completion.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await completion.finalMessage();
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            "\n\nSorry - I hit a problem reaching the assistant. Please try again or call 01543 371970.",
          ),
        );
        controller.close();
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error("[/api/chat]", err);
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
