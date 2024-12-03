import { program } from "commander";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

const main = async () => {
  const [appName] = program.argument("<app-name>").parse().args;

  const rootPath = path.join(__dirname, "..", "..");
  const appsPath = path.join(rootPath, "apps");
  const appPath = path.join(appsPath, appName);
  const exists = fs.existsSync(appPath);
  if (!exists) {
    let apps: string[] = [];
    try {
      apps = await fsp.readdir(appsPath, {});
      apps = apps.filter((app) => ![".DS_Store"].includes(app));
    } catch {}
    console.error(
      `ERROR: App ${JSON.stringify(appName)} does not exist, must be one of ${apps.map((app) => JSON.stringify(app)).join(", ")}`,
    );
    process.exit(1);
  }

  const appSelectorPath = path.join(rootPath, "app-selector.js");
  await fsp.writeFile(appSelectorPath, `require("./apps/${appName}/index");\n`);

  const appConfigPath = path.join(rootPath, "app.config.js");
  await fsp.writeFile(
    appConfigPath,
    `module.exports = require("./apps/${appName}/app.config.js");\n`,
  );
};

main();
