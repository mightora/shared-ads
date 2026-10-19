import { SIZES } from "./core/types";
const tags = new Set([
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "title",
  "desc",
]);
const attrs = new Set([
  "width",
  "height",
  "viewBox",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "d",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "transform",
  "font-family",
  "font-size",
  "font-weight",
  "letter-spacing",
  "text-anchor",
  "points",
  "id",
  "offset",
  "stop-color",
  "stop-opacity",
  "gradientUnits",
  "gradientTransform",
  "clip-path",
  "preserveAspectRatio",
]);
/** Local artwork preview only; CI independently checks the committed asset bytes. */
export async function localArtwork(
  file: File,
): Promise<{ url: string; bytes: Uint8Array }> {
  if (
    !/^[a-zA-Z0-9_-]+\.(svg|png|jpe?g|webp)$/.test(file.name) ||
    file.size > 150000
  )
    throw Error(
      "Use a static SVG, PNG, JPEG or WebP under 150 KB with a simple filename.",
    );
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (file.name.endsWith(".svg")) {
    const text = new TextDecoder().decode(bytes);
    if (/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet/i.test(text))
      throw Error("SVG declarations are not allowed.");
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    if (
      doc.querySelector("parsererror") ||
      doc.documentElement.localName !== "svg"
    )
      throw Error("Invalid SVG.");
    for (const el of doc.querySelectorAll("*")) {
      if (
        !tags.has(el.localName) ||
        el.namespaceURI !== "http://www.w3.org/2000/svg"
      )
        throw Error("Unsafe SVG element.");
      for (const a of el.attributes) {
        if (a.name === "xmlns" && a.value === "http://www.w3.org/2000/svg")
          continue;
        if (
          !attrs.has(a.name) ||
          /javascript:|https?:|data:|@import|expression\(/i.test(a.value) ||
          (/url\(/.test(a.value) && !/^url\(#[a-zA-Z0-9_-]+\)$/.test(a.value))
        )
          throw Error("Unsafe SVG attribute.");
      }
    }
  } else {
    const scan = new TextDecoder("latin1").decode(bytes);
    if (
      (file.name.endsWith(".png") && scan.includes("acTL")) ||
      (file.name.endsWith(".webp") && /ANIM|ANMF/.test(scan))
    )
      throw Error("Animated artwork is not accepted.");
  }
  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(Error("Unable to read artwork."));
    reader.readAsDataURL(file);
  });
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(Error("Image cannot be decoded."));
    img.src = url;
  });
  if (!SIZES.includes(`${img.naturalWidth}x${img.naturalHeight}` as never))
    throw Error("Image must use one of the five approved pixel dimensions.");
  return { url, bytes };
}
