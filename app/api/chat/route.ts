import type { ChatRequestMessage } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

// Runs on the server only. OPENROUTER_API_KEY is never sent to the browser -
// the client calls this route, this route calls OpenRouter.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Default to the cheap, agentic demo model. Override with OPENROUTER_MODEL,
// e.g. openai/gpt-5.4-mini for a higher-quality pass.
const MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-v4-flash";

const SYSTEM_PROMPT = `You are the AI assistant for ${siteConfig.legalName} (SFS), a UK warehousing and fulfilment company based at ${siteConfig.contact.street}, ${siteConfig.contact.locality}, ${siteConfig.contact.postalCode}.

SFS services: shared-user warehousing, dedicated site warehousing, B2B logistics and delivery, e-commerce fulfilment, co-packing, and reverse logistics. You serve customers across the UK.

Your job: help visitors describe their storage, warehousing or fulfilment needs and guide them toward a quote. Be warm, plain-spoken and specific. Ask one focused follow-up question when you need volume, location or timing. Use short paragraphs and bullet points. Never invent precise prices or guaranteed availability - instead offer to connect the visitor with a specialist (phone ${siteConfig.contact.phone}, email ${siteConfig.contact.email}). Keep replies concise.`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      "The AI assistant is not configured yet. Set OPENROUTER_API_KEY or use the mock agent (NEXT_PUBLIC_USE_REAL_AI=false).",
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

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const upstream = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            // Optional but recommended by OpenRouter for attribution.
            "HTTP-Referer": siteConfig.url,
            "X-Title": siteConfig.legalName,
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 1024,
            stream: true,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
              })),
            ],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          throw new Error(`OpenRouter error ${upstream.status}`);
        }

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // OpenRouter streams Server-Sent Events: `data: {json}` lines.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              /* ignore keep-alive / partial frames */
            }
          }
        }

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
