import http from "node:http";
import { readFileSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist"),
  port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".yaml": "text/yaml",
  ".zip": "application/zip",
  ".md": "text/plain",
};
http
  .createServer((req, res) => {
    try {
      let path = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (path.startsWith("/shared-ads/"))
        path = path.slice("/shared-ads".length);
      let file = resolve(root, "." + path);
      if (!file.startsWith(root + sep) && file !== root) throw Error();
      if (statSync(file).isDirectory()) file = resolve(file, "index.html");
      const bytes = readFileSync(file);
      res.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Preview http://127.0.0.1:${port}/demo/`),
  );
