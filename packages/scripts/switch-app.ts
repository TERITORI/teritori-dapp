import { program } from "commander";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

const main = async () => {
  const [appName] = program.argument("<app-name>").parse().args;

  const rootPath = path.join(__dirname, "..", "..");

  const appPath = path.join(rootPath, "apps", appName);
  const exists = fs.existsSync(appPath);
  if (!exists) {
    console.error(`ERROR: App "${appName}" does not exist`);
    process.exit(1);
  }

  const appSwitchPath = path.join(rootPath, "app-switch.js");
  await fsp.writeFile(appSwitchPath, `require("./apps/${appName}/index");\n`);

  const appConfigPath = path.join(rootPath, "app.config.js");
  await fsp.writeFile(
    appConfigPath,
    `module.exports = require("./apps/${appName}/app.config.js");\n`,
  );
};

main();
