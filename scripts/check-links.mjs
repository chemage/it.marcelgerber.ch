// Minimal internal link checker for the built site (replaces html-proofer).
// Checks that every local href/src resolves to a file and that #fragments exist on the target page.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix } from "node:path";

const root = new URL("../_site/", import.meta.url).pathname;
if (!existsSync(root)) {
  console.error("_site/ not found. Run `npm run build` first.");
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".html")) htmlFiles.push(full);
  }
})(root);

const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath);
  const candidates = [join(root, clean), join(root, clean, "index.html")];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

const errors = [];
for (const file of htmlFiles) {
  const pageUrl = "/" + file.slice(root.length).replace(/index\.html$/, "");
  const html = readFileSync(file, "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
  for (const [, attr, value] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|javascript:|data:|\/\/)/.test(value) || value === "") continue;
    const [pathPart, fragment] = value.split("#");
    const target = pathPart ? (pathPart.startsWith("/") ? pathPart : posix.join(dirname(pageUrl + "x"), pathPart)) : pageUrl;
    const found = resolve(target.split("?")[0]);
    if (!found) errors.push(`${pageUrl}: ${attr}="${value}" does not exist`);
    else if (fragment && found.endsWith(".html") && !idsOf(found).has(fragment)) {
      errors.push(`${pageUrl}: ${attr}="${value}" fragment not found`);
    }
  }
}

if (errors.length) {
  console.error(`${errors.length} broken internal link(s):\n` + errors.join("\n"));
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} pages: no broken internal links.`);
