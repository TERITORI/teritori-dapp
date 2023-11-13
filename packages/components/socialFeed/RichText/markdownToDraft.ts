import MarkdownIt from "markdown-it";

export function markdownToHTML(markdown: string) {
  const mdit = new MarkdownIt("commonmark");
  return mdit.render(markdown);
}
