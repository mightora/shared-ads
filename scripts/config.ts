import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { validateConfig } from "../src/core/validation";
export function loadConfig() {
  const parts = ["global", "sites", "campaigns"].map((n) =>
    JSON.parse(readFileSync(`config/${n}.json`, "utf8")),
  );
  parts.forEach((p, i) => {
    const allowed = [
      "schemaVersion",
      "revision",
      ["global", "sites", "campaigns"][i],
    ];
    if (Object.keys(p).some((k) => !allowed.includes(k)))
      throw Error("Unexpected configuration input key");
  });
  if (
    parts.some(
      (p) =>
        p.schemaVersion !== parts[0].schemaVersion ||
        p.revision !== parts[0].revision,
    )
  )
    throw Error(
      "All three configuration files must have the same schemaVersion and revision",
    );
  const config = Object.assign({}, ...parts);
  const result = validateConfig(config);
  if (!result.ok) throw Error(result.errors.join("\n"));
  return result.config;
}
const config = loadConfig();
const snapshot = `config/versions/${config.revision}.json`;
if (
  existsSync(snapshot) &&
  JSON.stringify(JSON.parse(readFileSync(snapshot, "utf8"))) !==
    JSON.stringify(config)
)
  throw Error(
    "Revision already used for different content; increment the revision in all three input files",
  );
writeFileSync("config/config.json", JSON.stringify(config, null, 2) + "\n");
mkdirSync("config/versions", { recursive: true });
writeFileSync(
  `config/versions/${config.revision}.json`,
  JSON.stringify(config, null, 2) + "\n",
);
console.log(
  `Validated configuration ${config.revision}: ${config.sites.length} sites, ${config.campaigns.length} campaigns`,
);
