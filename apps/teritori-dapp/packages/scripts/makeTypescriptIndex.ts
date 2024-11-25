import { program } from "commander";
import fs from "fs/promises";
import path from "path";

const main = async () => {
  program.argument("<contract-dir>", "path to contract dir");
  program.parse();
  const [contractDir] = program.args;

  const indexFileName = "index.ts";

  const files = (await fs.readdir(contractDir)).filter(
    (file) => file !== indexFileName,
  );

  const lines = files
    .filter((f) => f.endsWith(".ts"))
    .map(
      (file) =>
        `export * from "./${file.substring(0, file.length - ".ts".length)}";`,
    );

  const indexFile = path.join(contractDir, indexFileName);
  await fs.writeFile(indexFile, lines.join("\n"));
};

main();
