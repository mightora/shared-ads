import { readLimited } from "../core/network";
import type { Candidate } from "../core/types";
/** One credential-free fetch, then a local blob image; no click handler or measurement. */
export async function renderHouse(
  candidate: Candidate,
  container: HTMLElement,
  signal: AbortSignal,
): Promise<boolean> {
  if (!candidate.variant || !candidate.campaign || signal.aborted) return false;
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 5000);
  let objectURL: string | undefined;
  try {
    const response = await fetch(candidate.variant.src, {
      credentials: "omit",
      referrerPolicy: "no-referrer",
      redirect: "error",
      signal: controller.signal,
      cache: "force-cache",
    });
    if (
      !response.ok ||
      !["image/svg+xml", "image/webp", "image/png", "image/jpeg"].includes(
        response.headers.get("content-type")?.split(";")[0]?.trim() || "",
      )
    )
      return false;
    const bytes = await readLimited(response, 150000);
    const blob = new Blob([new Uint8Array(bytes)], {
      type: response.headers.get("content-type")!,
    });
    if (signal.aborted) return false;
    objectURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = candidate.campaign.destination;
    a.target = "_blank";
    a.rel = "sponsored noopener noreferrer";
    a.referrerPolicy = "no-referrer";
    const img = document.createElement("img");
    img.width = candidate.width;
    img.height = candidate.height;
    img.alt = candidate.campaign.alt;
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    const loaded = new Promise<boolean>((resolve) => {
      const cancel = () => {
        img.removeAttribute("src");
        resolve(false);
      };
      controller.signal.addEventListener("abort", cancel, { once: true });
      img.onload = () => {
        controller.signal.removeEventListener("abort", cancel);
        resolve(true);
      };
      img.onerror = () => {
        controller.signal.removeEventListener("abort", cancel);
        resolve(false);
      };
    });
    a.append(img);
    container.append(a);
    img.src = objectURL;
    const ok = await loaded;
    if (!ok) a.remove();
    return ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
    if (objectURL) URL.revokeObjectURL(objectURL);
  }
}
