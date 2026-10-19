import type { Candidate } from "../core/types";
declare global {
  interface Window {
    adsbygoogle?: { push: (args: Record<string, never>) => unknown };
  }
}
export class GoogleAdsense {
  started = false;
  private loader?: Promise<boolean>;
  private script?: HTMLScriptElement;
  private load(publisher: string, permitted: () => boolean): Promise<boolean> {
    if (!permitted()) return Promise.resolve(false);
    if (this.loader) return this.loader;
    // A separate AdSense loader can defeat consent and Auto Ads controls: fail closed.
    if (
      document.querySelector(
        'script[src*="googlesyndication.com/pagead/js/adsbygoogle.js"]',
      )
    )
      return Promise.resolve(false);
    this.started = true;
    this.loader = new Promise((resolve) => {
      const script = document.createElement("script");
      this.script = script;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`;
      let done = false;
      const finish = (ok: boolean) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
        resolve(ok && permitted());
      };
      const timer = setTimeout(() => finish(false), 5000);
      script.onload = () => finish(true);
      script.onerror = () => finish(false);
      document.head.append(script);
    });
    return this.loader;
  }
  async render(
    candidate: Candidate,
    container: HTMLElement,
    publisher: string,
    signal: AbortSignal,
    permitted: () => boolean,
  ): Promise<boolean> {
    if (!candidate.unit || signal.aborted || !permitted()) return false;
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.dataset.adClient = publisher;
    ins.dataset.adSlot = candidate.unit.slot;
    if (candidate.unit.format === "fixed") {
      ins.style.display = "inline-block";
      ins.style.width = `${candidate.width}px`;
      ins.style.height = `${candidate.height}px`;
    } else {
      ins.style.display = "block";
      ins.dataset.adFormat = "horizontal";
      ins.dataset.fullWidthResponsive = "false";
    }
    container.append(ins);
    const ready = await this.load(publisher, permitted);
    if (!ready || signal.aborted || !permitted()) {
      ins.remove();
      return false;
    }
    try {
      (window.adsbygoogle =
        window.adsbygoogle || ([] as Record<string, never>[])).push({});
    } catch {
      ins.remove();
      return false;
    }
    return new Promise((resolve) => {
      let done = false;
      const finish = (ok: boolean) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        observer.disconnect();
        signal.removeEventListener("abort", abort);
        if (!ok) ins.remove();
        resolve(ok);
      };
      const abort = () => finish(false);
      const observer = new MutationObserver(() => {
        if (ins.dataset.adStatus === "unfilled") finish(false);
        else if (ins.dataset.adStatus === "filled") finish(true);
      });
      const timer = setTimeout(() => finish(false), 8000);
      observer.observe(ins, {
        attributes: true,
        attributeFilter: ["data-ad-status"],
      });
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) finish(false);
      else if (ins.dataset.adStatus === "unfilled") finish(false);
      else if (ins.dataset.adStatus === "filled") finish(true);
    });
  }
  /** Removing a script cannot unload executed JS; the host must reload after persisted withdrawal. */
  stop(): void {
    this.script?.remove();
  }
}
