import { test } from "node:test";
import assert from "node:assert/strict";
import { hasGoogleConsent, type TCData } from "../src/consent/tcf";
export function granted(): TCData {
  return {
    cmpId: 300,
    cmpStatus: "loaded",
    eventStatus: "tcloaded",
    listenerId: 1,
    gdprApplies: true,
    tcString: "Certified-CMP-test-fixture-not-a-real-TC-string",
    vendor: { consents: { 755: true } },
    purpose: {
      consents: Object.fromEntries(
        [1, 2, 3, 4, 7, 9, 10].map((p) => [p, true]),
      ),
    },
  };
}
test("certified CMP full explicit consent passes conservative gate", () =>
  assert.equal(hasGoogleConsent(granted(), true, [300]), true));
for (const [name, change] of Object.entries<(tc: TCData) => void>({
  "missing TC string": (t) => {
    t.tcString = "";
  },
  "unknown CMP": (t) => {
    t.cmpId = 999;
  },
  "CMP loading": (t) => {
    t.cmpStatus = "loading";
  },
  "consent refused": (t) => {
    t.vendor!.consents![755] = false;
  },
  "purpose 1 refused": (t) => {
    t.purpose!.consents![1] = false;
  },
  withdrawal: (t) => {
    t.eventStatus = "useractioncomplete";
    t.purpose!.consents = {};
  },
  "unknown jurisdiction": (t) => {
    t.gdprApplies = undefined;
  },
  "outside TCF scope": (t) => {
    t.gdprApplies = false;
  },
  "publisher prohibits": (t) => {
    t.publisher = { restrictions: { 1: { 755: 0 } } };
  },
  "requires legitimate interest": (t) => {
    t.publisher = { restrictions: { 2: { 755: 2 } } };
  },
}))
  test(`${name} cannot start Google`, () => {
    const tc = granted();
    change(tc);
    assert.equal(hasGoogleConsent(tc, true, [300]), false);
  });
test("failed CMP callback does not grant consent", () =>
  assert.equal(hasGoogleConsent(granted(), false, [300]), false));
