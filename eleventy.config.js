import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginTOC from "eleventy-plugin-toc";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { siFacebook, siGithub, siTelegram, siX } from "simple-icons";
import site from "./src/_data/site.js";

const require = createRequire(import.meta.url);
const lucideDir = require.resolve("lucide-static/package.json").replace("package.json", "icons/");

// ---------------------------------------------------------------------------
// Icons: inlined at build time, no icon font and no CDN.
// ---------------------------------------------------------------------------
const brandPaths = {
  github: siGithub.path,
  facebook: siFacebook.path,
  telegram: siTelegram.path,
  x: siX.path,
  // simple-icons no longer ships LinkedIn, so the glyph is inlined here.
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
};

function icon(name) {
  if (brandPaths[name]) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${brandPaths[name]}"/></svg>`;
  }
  const svg = readFileSync(`${lucideDir}${name}.svg`, "utf8");
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

// ---------------------------------------------------------------------------
// Git based "last modified" date (replaces _plugins/posts-lastmod-hook.rb).
// Only reported once a post has more than one commit, like the Jekyll hook did.
// Needs full history in CI (fetch-depth: 0).
// ---------------------------------------------------------------------------
const lastModCache = new Map();
function lastModified(inputPath) {
  if (lastModCache.has(inputPath)) return lastModCache.get(inputPath);
  let result = null;
  try {
    const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    const count = Number(git("rev-list", "--count", "HEAD", "--", inputPath));
    if (count > 1) result = new Date(git("log", "-1", "--format=%aI", "--", inputPath));
  } catch {
    result = null;
  }
  lastModCache.set(inputPath, result);
  return result;
}

const fmt = (opts) => new Intl.DateTimeFormat("en-GB", { timeZone: site.timezone, ...opts });
const dateFmt = fmt({ day: "numeric", month: "short", year: "numeric" });

function plainText(html = "") {
  return String(html)
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function groupBy(posts, field) {
  const map = new Map();
  for (const post of posts) {
    for (const name of post.data[field] ?? []) {
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(post);
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en", { sensitivity: "base" }))
    .map(([name, posts]) => ({ name, posts }));
}

export default function (eleventyConfig) {
  // Static files
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/sw.js");

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginTOC, { tags: ["h2", "h3"], wrapper: "nav", wrapperClass: "toc", wrapperLabel: "Contents" });
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "blogPosts", limit: 10 },
    metadata: {
      language: site.lang,
      title: site.title,
      subtitle: site.description,
      base: `${site.url}/`,
      author: { name: site.author.name, email: site.author.email },
    },
  });

  // Markdown: allow inline HTML (used in the existing posts) and add heading anchors for the TOC.
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true, linkify: true }).use(markdownItAnchor, { tabIndex: false }),
  );

  // Collections
  eleventyConfig.addCollection("blogPosts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date),
  );
  eleventyConfig.addCollection("categoryList", (api) =>
    groupBy(api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date), "categories"),
  );
  eleventyConfig.addCollection("tagList", (api) =>
    groupBy(api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date), "tags"),
  );
  eleventyConfig.addCollection("postsByYear", (api) => {
    const years = new Map();
    for (const post of api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)) {
      const year = post.date.getUTCFullYear();
      if (!years.has(year)) years.set(year, []);
      years.get(year).push(post);
    }
    return [...years.entries()].sort(([a], [b]) => b - a).map(([year, posts]) => ({ year, posts }));
  });

  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

  // Filters and shortcodes
  eleventyConfig.addFilter("dateShort", (date) => dateFmt.format(date));
  eleventyConfig.addFilter("dateISO", (date) => new Date(date).toISOString());
  eleventyConfig.addFilter("lastModified", lastModified);
  eleventyConfig.addFilter("excerpt", (html, length = 200) => {
    const text = plainText(String(html).replace(/<h[1-6][\s\S]*?<\/h[1-6]>/g, " "));
    return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, "")}…` : text;
  });
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = plainText(html).split(" ").filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });
  eleventyConfig.addFilter("jsString", (value) => JSON.stringify(String(value ?? "")));
  eleventyConfig.addShortcode("icon", icon);

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
