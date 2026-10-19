import { readFileSync } from "node:fs";
import type { Config, Context } from "../src/core/types";
export function fixture(): Config {
  return JSON.parse(readFileSync("config/config.json", "utf8"));
}
export const ctx: Context = {
  hostname: "127.0.0.1",
  path: "/demo/landing.html",
  placement: "content-bottom",
  width: 728,
  screenWidth: 1024,
  now: Date.parse("2026-10-19T12:00:00Z"),
  googleConsent: false,
  words: 1200,
};
export function googleFixture(): Config {
  const c = fixture();
  c.global.googleEnabled = true;
  c.global.mode = "mixed";
  c.global.google = {
    publisherId: "ca-pub-1234567890123456",
    autoAdsDisabledConfirmed: true,
    certifiedCmpIds: [300],
  };
  const s = c.sites[1]!;
  s.googleEnabled = true;
  s.googleApproved = true;
  s.mode = "mixed";
  s.googleUnits = [
    {
      id: "google-bottom",
      name: "Mock manual unit",
      description: "Tests only — never real inventory",
      enabled: true,
      weight: 100,
      start: "2026-01-01T00:00:00Z",
      end: "2030-01-01T00:00:00Z",
      minScreen: 0,
      maxScreen: 10000,
      placement: "content-bottom",
      slot: "1234567890",
      size: "320x50",
      format: "fixed",
    },
  ];
  return c;
}
