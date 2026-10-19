import { writeFileSync } from "node:fs";
import Ajv from "ajv";
import { buildSync } from "esbuild";
import standaloneCode from "ajv/dist/standalone/index.js";
const str = (maxLength = 300) => ({ type: "string", minLength: 1, maxLength });
const id = { type: "string", pattern: "^[a-z0-9][a-z0-9-]{0,63}$" };
const bool = { type: "boolean" };
const arr = (items, maxItems = 1000, minItems = 0) => ({
  type: "array",
  items,
  maxItems,
  minItems,
  uniqueItems: true,
});
const obj = (properties) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});
const count = { type: "integer", minimum: 0, maximum: 2 };
const modes = { enum: ["mixed", "house-only", "google-only", "off"] };
const placements = [
  "content-bottom",
  "article-middle",
  "sidebar",
  "landing-secondary",
  "footer-above-author",
];
const size = { enum: ["320x50", "468x60", "728x90", "320x100", "300x250"] };
const common = {
  id,
  name: str(100),
  description: str(500),
  enabled: bool,
  weight: { type: "number", minimum: 0, maximum: 1000000 },
  start: str(30),
  end: str(30),
  minScreen: { type: "integer", minimum: 0, maximum: 10000 },
  maxScreen: { type: "integer", minimum: 0, maximum: 10000 },
};
const placementSettings = {
  type: "object",
  properties: Object.fromEntries(
    placements.map((p) => [p, obj({ enabled: bool, sizes: arr(size, 5, 1) })]),
  ),
  additionalProperties: false,
};
export const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://mightora.github.io/shared-ads/config/schema-v1.json",
  ...obj({
    schemaVersion: { const: 1 },
    revision: { type: "string", pattern: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$" },
    global: obj({
      enabled: bool,
      killSwitch: bool,
      houseEnabled: bool,
      googleEnabled: bool,
      mode: modes,
      rotation: { enum: ["equal", "weighted"] },
      maxAdsPerPage: count,
      cacheSeconds: { type: "integer", minimum: 30, maximum: 300 },
      allowedSizes: arr(size, 5, 1),
      imageOrigins: arr(str(), 20, 1),
      destinationOrigins: arr(str(), 100, 1),
      categories: arr(id, 30, 1),
      fallback: { enum: ["house", "empty"] },
      google: obj({
        publisherId: {
          anyOf: [
            { type: "null" },
            { type: "string", pattern: "^ca-pub-[0-9]{16}$" },
          ],
        },
        autoAdsDisabledConfirmed: bool,
        certifiedCmpIds: arr(
          { type: "integer", minimum: 1, maximum: 4095 },
          30,
        ),
      }),
    }),
    sites: arr(
      obj({
        id,
        domain: {
          type: "string",
          pattern: "^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$",
          maxLength: 253,
        },
        pathPrefixes: arr(str(2048), 30, 1),
        audience: { enum: ["general", "child-directed"] },
        enabled: bool,
        houseAdsApproved: bool,
        googleEnabled: bool,
        googleApproved: bool,
        mode: modes,
        maxAdsPerPage: count,
        categories: arr(id, 30, 1),
        allowedSizes: arr(size, 5, 1),
        exclusions: arr(str(2048), 100),
        longContentPaths: arr(str(2048), 30),
        placements: placementSettings,
        googleUnits: arr(
          obj({
            ...common,
            placement: { enum: placements },
            slot: { type: "string", pattern: "^[0-9]{6,20}$" },
            size,
            format: { enum: ["fixed", "responsive-horizontal"] },
          }),
          30,
        ),
      }),
      500,
    ),
    campaigns: arr(
      obj({
        ...common,
        category: id,
        sites: arr(id, 500, 1),
        placements: arr({ enum: placements }, 5, 1),
        variants: arr(
          obj({
            src: str(2048),
            width: { type: "integer", minimum: 1, maximum: 728 },
            height: { type: "integer", minimum: 1, maximum: 250 },
          }),
          5,
          1,
        ),
        alt: str(250),
        destination: str(2048),
        disclosure: {
          enum: ["Advertisement", "Paid advertisement", "House advertisement"],
        },
      }),
      1000,
    ),
  }),
};
writeFileSync("config/schema-v1.json", JSON.stringify(schema, null, 2) + "\n");
const ajv = new Ajv({
  allErrors: true,
  code: { source: true, esm: true },
  strict: true,
});
const validate = ajv.compile(schema);
writeFileSync(
  "src/core/schema.generated.js",
  buildSync({
    stdin: {
      contents: standaloneCode(ajv, validate),
      resolveDir: process.cwd(),
    },
    bundle: true,
    format: "esm",
    write: false,
    platform: "browser",
  }).outputFiles[0].text,
);
writeFileSync(
  "src/core/schema.generated.d.ts",
  "declare const validate: ((data: unknown) => boolean) & {errors?: Array<{instancePath: string; message?: string}> | null}; export default validate;\n",
);
