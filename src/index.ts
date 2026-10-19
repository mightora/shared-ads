import { AdsRuntime, type AdsOptions } from "./core/runtime";
import { registerElement } from "./components/mightora-ad";
export { AdsRuntime };
export type { AdsOptions };
export { validateConfig } from "./core/validation";
export { choose, eligible } from "./core/selection";
registerElement();
let active: AdsRuntime | undefined;
export async function start(options: AdsOptions): Promise<AdsRuntime> {
  active?.stop();
  active = new AdsRuntime(options);
  await active.start();
  return active;
}
export function stop(): void {
  active?.stop();
  active = undefined;
}
export function refresh(): Promise<void> {
  return active?.refresh() ?? Promise.resolve();
}
export function notifyNavigation(): void {
  active?.notifyNavigation();
}
// Deliberate script opt-in only. Loading the library alone never fetches configuration.
const script = document.currentScript as HTMLScriptElement | null;
if (script?.dataset.enabled === "true") {
  const options: AdsOptions = {
    enabled: true,
    siteId: script.dataset.site || "",
    allowedHosts: (script.dataset.domains || "")
      .split(",")
      .map((s) => s.trim()),
    configUrl: script.dataset.config || "",
    offline: script.dataset.offline === "true",
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => void start(options), {
      once: true,
    });
  else void start(options);
}
