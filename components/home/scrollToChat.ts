// Shared action for every "How We Can Help" / storage CTA. On pages with the
// hero assistant card (home), scroll it into view; elsewhere (e.g. About), open
// the floating assistant via a global event so the CTA still starts a chat.
export function scrollToChat() {
  if (typeof document === "undefined") return;
  const card = document.querySelector("[data-hero-card]");
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    window.dispatchEvent(new CustomEvent("sfs:open-assistant"));
  }
}
