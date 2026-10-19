import { start, stop } from "../src/index";
if (document.documentElement.dataset.ads !== "off") {
  const local = ["127.0.0.1", "localhost"].includes(location.hostname);
  const siteId = local
    ? location.hostname === "localhost"
      ? "localhost-preview"
      : "local-preview"
    : "shared-ads-demo";
  void start({
    enabled: true,
    siteId,
    allowedHosts: ["127.0.0.1", "localhost", "mightora.github.io"],
    configUrl: new URL("../config/config.json", location.href).href,
    development: local,
  });
}
const tool = document.querySelector<HTMLTextAreaElement>("#tool-input");
if (tool)
  tool.addEventListener("input", () => {
    const out = document.querySelector("#tool-output");
    if (out)
      out.textContent = `${tool.value.length} characters · ${tool.value.trim().split(/\s+/).filter(Boolean).length} words. Processed locally.`;
  });
document.querySelector("#disable-now")?.addEventListener("click", () => {
  document.documentElement.dataset.ads = "off";
  stop();
});
