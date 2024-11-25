import * as fs from "fs/promises";
import { glob } from "glob";
import markdownit, { Token } from "markdown-it";

const main = async () => {
  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
  });
  const verbose = false;
  const errors: string[] = [];
  const files = await glob("**/*.md", { ignore: "node_modules/**" });
  for (const file of files) {
    if (verbose) {
      console.log(`Validating ${file}`);
    }
    const content = await fs.readFile(file, "utf-8");
    let doc: Token[];
    try {
      doc = md.parse(content, {});
    } catch (err) {
      const errStr = `${file}: Failed to parse markdown: ${err}`;
      errors.push(errStr);
      if (verbose) {
        console.error(errStr);
      }
      continue;
    }
    const ctx: Context = { errors: [], file, verbose };
    await processTokens(ctx, doc);
    errors.push(...ctx.errors);
  }

  if (errors.length > 0) {
    for (const err of errors) {
      console.error(`❌ ERROR: ${err}`);
    }
    process.exit(1);
  }
};

interface Context {
  errors: string[];
  file: string;
  verbose: boolean;
}

const processToken = async (ctx: Context, token: Token) => {
  if (token.type !== "link_open") {
    return;
  }
  const href = token.attrGet("href");
  if (
    !href ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("#")
  ) {
    return;
  }
  if (ctx.verbose) {
    console.log("Found relative link: ", token.attrGet("href"));
  }
  try {
    await fs.stat(href);
  } catch (err) {
    // TODO: add line and character number
    const errStr = `${ctx.file}: Bad relative link: ${href}: ${err}`;
    ctx.errors.push(errStr);
    if (ctx.verbose) {
      console.error(errStr);
    }
  }
};

const processTokens = async (ctx: Context, tokens: Token[]) => {
  for (const token of tokens) {
    await processToken(ctx, token);
    if (token.children) {
      await processTokens(ctx, token.children);
    }
  }
};

main();
