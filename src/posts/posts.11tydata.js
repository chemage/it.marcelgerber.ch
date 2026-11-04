// Defaults for everything in src/posts (replaces the `defaults:` block of the Jekyll _config.yml).

// Cheap meta description from the first prose paragraph of the markdown source.
function firstParagraph(raw = "") {
  const paragraphs = raw
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#{1,6}\s.*$/gm, "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^(#|!\[|[-*>]|\d+\.)/.test(p));
  const text = (paragraphs[0] ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ");
  return text.length > 160 ? `${text.slice(0, 160).replace(/\s+\S*$/, "")}…` : text;
}

export default {
  layout: "layouts/post.njk",
  comments: true,
  toc: true,
  eleventyComputed: {
    // Same URLs as before: /posts/<slug>/ (Eleventy's fileSlug drops the date prefix).
    permalink: (data) => `/posts/${data.page.fileSlug}/`,
    description: (data) => data.description || firstParagraph(data.page.rawInput),
  },
};
