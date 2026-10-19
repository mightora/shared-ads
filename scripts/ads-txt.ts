import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import type { Config } from "../src/core/types";
export function validAdsTxt(text: string, publisherId: string): boolean {
  const expected = publisherId.replace(/^ca-/, "");
  return text.split(/\r?\n/).some((line) => {
    const f = line
      .split("#")[0]!
      .split(",")
      .map((s) => s.trim());
    return (
      f.length === 4 &&
      f[0]?.toLowerCase() === "google.com" &&
      f[1] === expected &&
      f[2] === "DIRECT" &&
      f[3] === "f08c47fec0942fa0"
    );
  });
}
export async function checkAdsTxt(
  c: Config,
  request: typeof fetch = fetch,
): Promise<string[]> {
  const errors: string[] = [];
  for (const s of c.sites.filter(
    (s) => s.enabled && s.googleEnabled && s.googleApproved,
  )) {
    const url = `https://${s.domain}/ads.txt`;
    try {
      const response = await request(url, {
        credentials: "omit",
        referrerPolicy: "no-referrer",
        redirect: "error",
        signal: AbortSignal.timeout(6000),
      });
      if (
        !response.ok ||
        !c.global.google.publisherId ||
        !validAdsTxt(await response.text(), c.global.google.publisherId)
      )
        errors.push(`${url}: missing authorised Google DIRECT record`);
    } catch {
      errors.push(
        `${url}: unavailable or redirected; inspect domain ownership and Google's subdomain requirements`,
      );
    }
  }
  return errors;
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const c = JSON.parse(readFileSync("config/config.json", "utf8")) as Config;
  const errors = await checkAdsTxt(c);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `ads.txt check passed (${c.sites.filter((s) => s.enabled && s.googleEnabled && s.googleApproved).length} Google-enabled domains; house-only sites do not require a Google entry)`,
    );
}
