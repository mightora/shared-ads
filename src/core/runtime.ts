import { MightoraAd, registerElement } from "../components/mightora-ad";
import { TcfConsent } from "../consent/tcf";
import { GoogleAdsense } from "../providers/google-adsense";
import { renderHouse } from "../providers/house-ads";
import { readLimited } from "./network";
import {
  choose,
  eligible,
  googleEnabled,
  normalPath,
  pageLimit,
  pageExcluded,
  siteFor,
} from "./selection";
import { httpsURL, isChildDomain, validateConfig } from "./validation";
import {
  PLACEMENTS,
  type Candidate,
  type Config,
  type Context,
  type Placement,
  type Site,
} from "./types";
export interface AdsOptions {
  enabled: boolean;
  siteId: string;
  allowedHosts: string[];
  configUrl: string;
  offline?: boolean;
  development?: boolean;
  onGoogleWithdrawal?: () => void;
}
interface RecordState {
  element: MightoraAd;
  controller: AbortController;
  candidate?: Candidate;
  fingerprint?: string;
  attemptedGoogle: boolean;
  visible: boolean;
  busy: boolean;
  broken: Set<string>;
}
const prohibited =
  'form,[role="form"],nav,header,footer,mightora-header,mightora-author,mightora-footer,[data-ad-free],[contenteditable="true"],[role="application"],.monaco-editor,.CodeMirror';
export class AdsRuntime {
  private config?: Config;
  private site?: Site;
  private stopped = false;
  private revoking = false;
  private consent?: TcfConsent;
  private consentAllowed = false;
  private google = new GoogleAdsense();
  private records = new Map<MightoraAd, RecordState>();
  private queue = Promise.resolve();
  private poll?: ReturnType<typeof setInterval>;
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private mo?: MutationObserver;
  private loading = false;
  private fetchController?: AbortController;
  constructor(private options: AdsOptions) {}
  private localAllowed(): boolean {
    return (
      this.options.enabled === true &&
      !this.options.offline &&
      location.protocol !== "file:" &&
      document.documentElement.dataset.ads !== "off" &&
      document.documentElement.dataset.offline !== "true" &&
      this.options.allowedHosts.includes(location.hostname) &&
      !isChildDomain(location.hostname, location.pathname) &&
      !pageExcluded(location.pathname) &&
      !document.querySelector('meta[name="mightora-ads"][content="off"]')
    );
  }
  async start(): Promise<void> {
    if (!this.localAllowed()) return;
    registerElement();
    document.addEventListener("mightora-ad-connect", this.connect);
    document.addEventListener("visibilitychange", this.visibility);
    window.addEventListener("popstate", this.navigation);
    window.addEventListener("hashchange", this.navigation);
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const r = this.records.get(e.target as MightoraAd);
          if (r && e.isIntersecting) {
            r.visible = true;
            this.schedule(r);
          }
        }
      },
      { rootMargin: "200px" },
    );
    this.ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const r = this.records.get(e.target as MightoraAd);
        if (!r) {
          for (const entry of this.records.values())
            if (entry.element.parentElement === e.target) this.schedule(entry);
          continue;
        }
        if (r.candidate && this.width(r.element) < r.candidate.width)
          this.clear(r);
        this.schedule(r);
      }
    });
    this.mo = new MutationObserver(() => {
      if (!this.localAllowed()) {
        this.stop();
        return;
      }
      for (const [el, r] of this.records)
        if (!el.isConnected) {
          r.controller.abort();
          this.records.delete(el);
          this.io?.unobserve(el);
          this.ro?.unobserve(el);
        }
    });
    this.mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-ads", "data-offline"],
    });
    for (const e of document.querySelectorAll<MightoraAd>("mightora-ad"))
      this.add(e);
    await this.refresh();
  }
  private connect = (e: Event): void => {
    if (e.target instanceof MightoraAd) this.add(e.target);
  };
  private visibility = (): void => {
    if (document.visibilityState === "visible") void this.refresh();
  };
  private navigation = (): void => {
    this.notifyNavigation();
  };
  private add(el: MightoraAd): void {
    if (this.records.has(el) || this.stopped) return;
    const r: RecordState = {
      element: el,
      controller: new AbortController(),
      attemptedGoogle: false,
      visible: false,
      busy: false,
      broken: new Set(),
    };
    this.records.set(el, r);
    el.addEventListener(
      "ad-remove",
      () => {
        r.controller.abort();
        this.records.delete(el);
      },
      { once: true },
    );
    el.addEventListener("ad-change", () => {
      this.clear(r);
      this.schedule(r);
    });
    if (this.config && this.site) {
      const choices = eligible(this.config, this.site, this.context(el));
      if (choices.length) {
        el.hidden = false;
        el.style.minHeight = `${Math.max(...choices.map((a) => a.height)) + 25}px`;
      }
    }
    this.io?.observe(el);
    if (el.parentElement) this.ro?.observe(el.parentElement);
    this.ro?.observe(el);
  }
  private width(el: MightoraAd): number {
    return Math.floor(
      Math.min(
        el.parentElement?.getBoundingClientRect().width ?? 0,
        window.innerWidth,
      ),
    );
  }
  private context(el: MightoraAd): Context {
    return {
      hostname: location.hostname,
      path: normalPath(location.pathname),
      placement: el.getAttribute("placement") as Placement,
      width: this.width(el),
      screenWidth: window.innerWidth,
      now: Date.now(),
      googleConsent: this.consentAllowed && !this.revoking,
      words:
        document.querySelector("main")?.textContent?.trim().split(/\s+/)
          .length ?? 0,
    };
  }
  private safeElement(el: MightoraAd): boolean {
    return (
      el.isConnected &&
      !el.hasAttribute("disabled") &&
      PLACEMENTS.includes(el.getAttribute("placement") as Placement) &&
      !el.parentElement?.closest(prohibited)
    );
  }
  private schedule(r: RecordState): void {
    this.queue = this.queue
      .then(() => this.render(r))
      .catch(() => {
        this.clear(r);
      });
  }
  private clear(r: RecordState): void {
    r.controller.abort();
    r.controller = new AbortController();
    r.candidate = undefined;
    r.fingerprint = undefined;
    r.element.clear();
  }
  private revokeGoogle(): void {
    this.consentAllowed = false;
    for (const r of this.records.values())
      if (r.candidate?.kind === "google") this.clear(r);
    if (this.google.started && !this.revoking) {
      this.revoking = true;
      this.google.stop();
      this.options.onGoogleWithdrawal?.();
      if (!this.options.onGoogleWithdrawal) location.reload();
    }
  }
  private consentChanged = (allowed: boolean): void => {
    if (this.stopped) return;
    if (!allowed) this.revokeGoogle();
    else if (!this.revoking) this.consentAllowed = true;
    for (const r of this.records.values()) if (!r.candidate) this.schedule(r);
  };
  private syncConsent(): void {
    if (this.config && this.site && googleEnabled(this.config, this.site)) {
      if (!this.consent) {
        this.consent = new TcfConsent(
          this.config.global.google.certifiedCmpIds,
          this.consentChanged,
        );
        this.consent.start();
      }
    } else {
      this.consent?.stop();
      this.consent = undefined;
      this.revokeGoogle();
    }
  }
  /** Revalidates centrally, removes disallowed units; never refreshes an existing Google impression. */
  async refresh(): Promise<void> {
    if (this.stopped || this.loading || !this.localAllowed()) return;
    this.loading = true;
    const previous = this.config;
    try {
      let u = httpsURL(this.options.configUrl);
      if (
        !u &&
        this.options.development &&
        ["localhost", "127.0.0.1"].includes(location.hostname)
      ) {
        const candidate = new URL(this.options.configUrl, location.href);
        if (candidate.origin === location.origin) u = candidate;
      }
      if (!u) throw new Error("Configuration must be HTTPS");
      this.fetchController = new AbortController();
      const timer = setTimeout(() => this.fetchController?.abort(), 4000);
      try {
        u.searchParams.set("epoch", String(Math.floor(Date.now() / 30000)));
        const res = await fetch(u, {
          signal: this.fetchController.signal,
          credentials: "omit",
          referrerPolicy: "no-referrer",
          cache: "no-store",
          redirect: "error",
        });
        if (!res.ok) throw new Error("Unavailable configuration");
        const raw = new TextDecoder().decode(await readLimited(res, 524288));
        const valid = validateConfig(JSON.parse(raw));
        if (!valid.ok) throw new Error(valid.errors.join("; "));
        this.config = valid.config;
      } finally {
        clearTimeout(timer);
      }
      this.site = siteFor(
        this.config,
        this.options.siteId,
        location.hostname,
        normalPath(location.pathname),
      );
      this.syncConsent();
      if (
        !this.site ||
        !this.config.global.enabled ||
        this.config.global.killSwitch ||
        this.config.global.mode === "off" ||
        this.config.global.maxAdsPerPage === 0 ||
        this.site.maxAdsPerPage === 0
      ) {
        for (const r of this.records.values()) this.clear(r);
        this.revokeGoogle();
        clearInterval(this.poll);
        this.poll = undefined;
        return;
      }
      const changed =
        !previous ||
        JSON.stringify(previous.global.google) !==
          JSON.stringify(this.config.global.google);
      if (changed && previous && this.google.started) this.revokeGoogle();
      if (changed && this.consent) {
        this.consent.stop();
        this.consent = undefined;
        this.consentAllowed = false;
        this.syncConsent();
      }
      for (const r of this.records.values()) {
        if (r.candidate) {
          const found = eligible(
            this.config,
            this.site,
            this.context(r.element),
          ).find((a) => a.id === r.candidate?.id);
          if (
            !found ||
            JSON.stringify(found) !== r.fingerprint ||
            !this.safeElement(r.element)
          )
            this.clear(r);
        }
        if (!r.candidate && this.safeElement(r.element)) {
          const choices = eligible(
            this.config,
            this.site,
            this.context(r.element),
          );
          if (choices.length) {
            r.element.hidden = false;
            r.element.style.minHeight = `${Math.max(...choices.map((a) => a.height)) + 25}px`;
          }
        }
        this.schedule(r);
      }
      if (!this.poll)
        this.poll = setInterval(
          () => void this.refresh(),
          Math.min(this.config.global.cacheSeconds, 60) * 1000,
        );
    } catch {
      this.config = undefined;
      this.site = undefined;
      this.consent?.stop();
      this.consent = undefined;
      for (const r of this.records.values()) this.clear(r);
      this.revokeGoogle();
    } finally {
      this.loading = false;
    }
  }
  private async render(r: RecordState): Promise<void> {
    if (
      this.stopped ||
      r.busy ||
      r.candidate ||
      !r.visible ||
      !this.config ||
      !this.site ||
      !this.localAllowed() ||
      !this.safeElement(r.element)
    )
      return;
    const c = this.config,
      s = this.site,
      ctx = this.context(r.element);
    const others = [...this.records.values()].filter(
      (x) => x !== r && x.candidate,
    );
    if (
      others.length >= pageLimit(c, s, ctx.path, ctx.words) ||
      others.some((x) => x.element.getAttribute("placement") === ctx.placement)
    )
      return;
    let choices = eligible(c, s, ctx).filter(
      (a) => !r.broken.has(a.id) && (a.kind !== "google" || !r.attemptedGoogle),
    );
    r.busy = true;
    try {
      while (choices.length) {
        const chosen = choose(
          choices,
          c.global.rotation,
          new Set(others.map((x) => x.candidate!.id)),
        );
        if (!chosen) break;
        r.candidate = chosen;
        r.fingerprint = JSON.stringify(chosen);
        const controller = r.controller;
        const box = r.element.frame(
          chosen.width,
          chosen.height,
          chosen.kind === "google"
            ? "Advertisements"
            : chosen.campaign!.disclosure,
          chosen.kind === "google",
        );
        let ok = false;
        if (chosen.kind === "house") {
          let artwork = chosen;
          if (
            this.options.development &&
            ["localhost", "127.0.0.1"].includes(location.hostname)
          ) {
            const source = new URL(
              "../adverts/" +
                new URL(chosen.variant!.src).pathname.split("/").at(-1),
              this.options.configUrl,
            );
            if (source.origin === location.origin)
              artwork = {
                ...chosen,
                variant: { ...chosen.variant!, src: source.href },
              };
          }
          ok = await renderHouse(artwork, box, controller.signal);
        } else {
          r.attemptedGoogle = true;
          ok = await this.google.render(
            chosen,
            box,
            c.global.google.publisherId!,
            controller.signal,
            () =>
              !this.stopped &&
              !this.revoking &&
              this.consentAllowed &&
              !!this.config &&
              !!this.site &&
              googleEnabled(this.config, this.site) &&
              !controller.signal.aborted,
          );
        }
        if (controller.signal.aborted) break;
        if (ok) {
          r.element.dispatchEvent(
            new CustomEvent("mightora-ad-status", {
              detail: { provider: chosen.kind, campaign: chosen.id },
              bubbles: true,
            }),
          );
          return;
        }
        r.broken.add(chosen.id);
        this.clear(r);
        // A failure never triggers another Google request. Use reviewed house fallback only.
        choices =
          c.global.fallback === "house"
            ? eligible(c, s, { ...ctx, googleConsent: false }).filter(
                (a) => a.kind === "house" && !r.broken.has(a.id),
              )
            : [];
      }
      if (!r.candidate) r.element.clear();
    } finally {
      r.busy = false;
    }
  }
  /** Call after a SPA router changes the path. Existing Google ads are not re-requested. */
  notifyNavigation(): void {
    if (!this.config) return;
    this.site = siteFor(
      this.config,
      this.options.siteId,
      location.hostname,
      normalPath(location.pathname),
    );
    for (const r of this.records.values()) this.clear(r);
    this.syncConsent();
    for (const r of this.records.values()) this.schedule(r);
  }
  stop(): void {
    this.stopped = true;
    this.fetchController?.abort();
    clearInterval(this.poll);
    this.consent?.stop();
    this.io?.disconnect();
    this.ro?.disconnect();
    this.mo?.disconnect();
    document.removeEventListener("mightora-ad-connect", this.connect);
    document.removeEventListener("visibilitychange", this.visibility);
    window.removeEventListener("popstate", this.navigation);
    window.removeEventListener("hashchange", this.navigation);
    for (const r of this.records.values()) this.clear(r);
    this.revokeGoogle();
    this.records.clear();
  }
}
