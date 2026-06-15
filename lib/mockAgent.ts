import type { StorageResult, SuggestedAction } from "./types";

// Mock data + scripted responses used when NEXT_PUBLIC_USE_REAL_AI is false,
// or as a fallback if the API route is unavailable. Kept separate from the
// adapter so it is trivial to delete once James's backend is live.

export const starterPrompts = [
  "Find warehouse space",
  "Get pallet storage",
  "Discuss fulfilment services",
  "I need overflow storage",
];

const sampleResults: StorageResult[] = [
  {
    id: "res-burntwood",
    title: "Burntwood Industrial Park - Shared User",
    location: "Burntwood, Staffordshire",
    distance: "On-site at SFS HQ",
    squareFeet: "Up to 20,000 sq ft",
    storageType: "Ambient, racked & bulk",
    availabilityDate: "Available now",
    facilities: ["24/7 CCTV", "Loading docks", "WMS + KPI reporting"],
    ctaLabel: "Discuss this space",
    ctaHref: "#contact",
  },
  {
    id: "res-midlands",
    title: "Midlands Overflow - Flexible Term",
    location: "Near Birmingham (M6 / A5)",
    distance: "~25 min from Birmingham",
    squareFeet: "5,000–15,000 sq ft",
    storageType: "Pallet & overflow",
    availabilityDate: "Available within 2 weeks",
    facilities: ["Flexible contract", "Pick & pack ready", "Pallet in/out"],
    ctaLabel: "Check availability",
    ctaHref: "#contact",
  },
];

const handoverAction: SuggestedAction = {
  type: "handover",
  label: "Speak to a specialist",
};

interface MockReply {
  content: string;
  results?: StorageResult[];
  suggestedActions?: SuggestedAction[];
}

export function getMockReply(userText: string): MockReply {
  const text = userText.toLowerCase();

  if (/(warehouse|space|sq\s?ft|square|overflow|pallet|storage)/.test(text)) {
    return {
      content:
        "Thanks - based on what you've described, here are a couple of options that could work. SFS offers **flexible terms** so you only pay for the space and handling you use.\n\nTell me your **rough volume** and **location** and I'll narrow it down, or speak to a specialist for an exact quote.",
      results: sampleResults,
      suggestedActions: [
        { type: "prompt", label: "Near Birmingham", value: "I need space near Birmingham" },
        { type: "prompt", label: "Long-term contract", value: "I'm looking for a long-term contract" },
        handoverAction,
      ],
    };
  }

  if (/(fulfil|e-?commerce|pick|pack|ship|order)/.test(text)) {
    return {
      content:
        "We run **e-commerce fulfilment** end to end - receiving stock, storing it, then picking, packing and dispatching your orders with full tracking and KPI reporting.\n\nWhat are you shipping, and roughly how many orders per month? That helps me size it.",
      suggestedActions: [
        { type: "prompt", label: "Under 1,000 orders/mo", value: "We ship under 1,000 orders a month" },
        { type: "prompt", label: "Over 1,000 orders/mo", value: "We ship over 1,000 orders a month" },
        handoverAction,
      ],
    };
  }

  if (/(specialist|human|call|phone|person|talk|speak)/.test(text)) {
    return {
      content:
        "No problem - I can connect you with a specialist. Share your **name** and the **best contact details**, or call us on **01543 371970** and we'll pick it up straight away.",
      suggestedActions: [handoverAction, { type: "lead", label: "Request a callback" }],
    };
  }

  return {
    content:
      "Happy to help. SFS provides **shared & dedicated warehousing, B2B logistics, e-commerce fulfilment, co-packing and reverse logistics** across the UK from our Burntwood site.\n\nWhat does your business need - storage space, fulfilment, or something else?",
    suggestedActions: [
      { type: "prompt", label: "Storage space", value: "I need storage space" },
      { type: "prompt", label: "Fulfilment", value: "I need fulfilment services" },
      handoverAction,
    ],
  };
}

// Splits a reply into small chunks so the mock can simulate token streaming.
export function chunkText(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [text];
}
