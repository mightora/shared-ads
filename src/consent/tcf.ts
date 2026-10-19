export interface TCData {
  cmpId?: number;
  cmpStatus?: string;
  eventStatus?: string;
  listenerId?: number;
  gdprApplies?: boolean;
  tcString?: string;
  purpose?: { consents?: Record<string, boolean> };
  vendor?: { consents?: Record<string, boolean> };
  publisher?: { restrictions?: Record<string, Record<string, number>> };
}
export type TcfApi = (
  command: string,
  version: number,
  callback: (data: TCData, success: boolean) => void,
  parameter?: unknown,
) => void;
declare global {
  interface Window {
    __tcfapi?: TcfApi;
  }
}
// Conservative consent-only policy. No legitimate-interest fallback or limited ads.
const PURPOSES = [1, 2, 3, 4, 7, 9, 10];
export function hasGoogleConsent(
  tc: TCData,
  success: boolean,
  certifiedCmpIds: number[],
): boolean {
  return (
    success &&
    tc.cmpStatus === "loaded" &&
    ["tcloaded", "useractioncomplete"].includes(tc.eventStatus || "") &&
    tc.gdprApplies === true &&
    !!tc.tcString &&
    !!tc.cmpId &&
    certifiedCmpIds.includes(tc.cmpId) &&
    tc.vendor?.consents?.["755"] === true &&
    PURPOSES.every(
      (p) =>
        tc.purpose?.consents?.[String(p)] === true &&
        ![0, 2].includes(
          tc.publisher?.restrictions?.[String(p)]?.["755"] ?? -1,
        ),
    )
  );
}
/** Reads the certified CMP's standard API; never stores preferences or manufactures TC strings. */
export class TcfConsent {
  allowed = false;
  private api?: TcfApi;
  private listenerId?: number;
  private retry?: ReturnType<typeof setInterval>;
  private stopped = false;
  constructor(
    private ids: number[],
    private changed: (allowed: boolean) => void,
  ) {}
  start(): void {
    let tries = 0;
    const bind = () => {
      if (this.stopped) return true;
      const api = window.__tcfapi;
      if (!api) return false;
      this.api = api;
      try {
        api("addEventListener", 2, (tc, success) => {
          if (this.stopped) return;
          this.listenerId = tc.listenerId;
          if (success && tc.eventStatus === "cmpuishown") return;
          const allowed = hasGoogleConsent(tc, success, this.ids);
          if (allowed !== this.allowed) {
            this.allowed = allowed;
            this.changed(allowed);
          }
        });
      } catch {
        this.changed(false);
      }
      return true;
    };
    if (!bind())
      this.retry = setInterval(() => {
        if (bind() || ++tries >= 30) {
          clearInterval(this.retry);
          this.retry = undefined;
        }
      }, 100);
  }
  stop(): void {
    this.stopped = true;
    clearInterval(this.retry);
    if (this.api && this.listenerId !== undefined)
      try {
        this.api("removeEventListener", 2, () => {}, this.listenerId);
      } catch {
        /* CMP unavailable */
      }
    this.allowed = false;
  }
}
