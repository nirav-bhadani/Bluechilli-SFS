// Stable internal data contract shared by the hero chat and the full-screen
// assistant. Keep this shape in sync with whatever James's backend returns so
// the adapter (lib/agentService.ts) is the only place that needs mapping.

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus =
  | "sending"
  | "streaming"
  | "complete"
  | "error"
  | "stopped";

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  kind: "file" | "image";
  // Object URL for local preview, or a remote URL once uploaded by the backend.
  url?: string;
}

// Structured storage result the agent can return. Rendered as a card, not text.
export interface StorageResult {
  id: string;
  title: string;
  location: string;
  distance?: string;
  squareFeet?: string;
  storageType?: string;
  availabilityDate?: string;
  facilities?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export type SuggestedAction =
  | { type: "prompt"; label: string; value: string }
  | { type: "handover"; label: string }
  | { type: "lead"; label: string };

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status: MessageStatus;
  attachments: Attachment[];
  metadata?: {
    results?: StorageResult[];
    [key: string]: unknown;
  };
  suggestedActions?: SuggestedAction[];
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface Lead {
  name: string;
  company?: string;
  email: string;
  telephone?: string;
  location?: string;
  spaceRequired?: string;
  goodsType?: string;
  startDate?: string;
  duration?: string;
  additionalServices?: string[];
  preferredContact?: string;
  consent: boolean;
  message: string;
  conversationId?: string;
}

// Wire shape for the API route request body.
export interface ChatRequestMessage {
  role: MessageRole;
  content: string;
}
