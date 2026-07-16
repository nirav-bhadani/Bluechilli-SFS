// Shared action for every "How We Can Help" CTA: bring the real hero assistant
// card back into view so the visitor can start a conversation.
export function scrollToChat() {
  if (typeof document === "undefined") return;
  document
    .querySelector("[data-hero-card]")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}
