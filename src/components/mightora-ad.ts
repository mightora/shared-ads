import { adStyle } from "../styles/ad";
export class MightoraAd extends HTMLElement {
  static observedAttributes = ["placement", "disabled"];
  readonly root = this.attachShadow({ mode: "open" }); // Houses only. Google uses light DOM for standard AdSense discovery.
  constructor() {
    super();
    this.hidden = true;
  }
  connectedCallback(): void {
    this.dispatchEvent(
      new CustomEvent("mightora-ad-connect", { bubbles: true, composed: true }),
    );
  }
  disconnectedCallback(): void {
    this.dispatchEvent(new CustomEvent("mightora-ad-disconnect"));
    this.dispatchEvent(new Event("ad-remove"));
  }
  attributeChangedCallback(): void {
    this.dispatchEvent(new Event("ad-change"));
  }
  clear(): void {
    this.root.replaceChildren();
    this.replaceChildren();
    this.hidden = true;
    this.style.removeProperty("min-height");
  }
  frame(
    width: number,
    height: number,
    label: string,
    google = false,
  ): HTMLElement {
    this.clear();
    this.hidden = false;
    this.style.minHeight = `${height + 25}px`;
    const style = document.createElement("style");
    style.textContent = adStyle;
    this.root.append(style);
    const section = document.createElement("section");
    section.setAttribute("aria-label", "Advertisement");
    section.style.width = `${width}px`;
    const p = document.createElement("p");
    p.textContent = label;
    section.append(p);
    const box = document.createElement("div");
    box.className = "creative";
    box.style.width = `${width}px`;
    box.style.minHeight = `${height}px`;
    if (google) {
      const slot = document.createElement("slot");
      section.append(slot);
      box.style.maxWidth = "100%";
      this.append(box);
    } else section.append(box);
    this.root.append(section);
    return box;
  }
}
export function registerElement(): void {
  if (!customElements.get("mightora-ad"))
    customElements.define("mightora-ad", MightoraAd);
}
