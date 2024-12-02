import fsp from "fs/promises";
import path from "path";

const main = async () => {
  const appName = "gno-dapp"; // TODO: CLI arg

  const rootPath = path.join(__dirname, "..", "..");

  await editJSON(path.join(rootPath, "package.json"), (packageJson) => {
    packageJson.main = `apps/${appName}/index.js`;

    return packageJson;
  });

  await editJSON(path.join(rootPath, "app.json"), (appConfig) => {
    const iconPath = `apps/${appName}/icon.png`;
    appConfig.expo.icon = iconPath;
    appConfig.expo.web.favicon = iconPath;

    return appConfig;
  });
};

const editJSON = async (
  filePath: string,
  edit: (json: any) => Promise<any>,
) => {
  const data = await fsp.readFile(filePath, { encoding: "utf-8" });
  // eslint-disable-next-line no-restricted-syntax
  const json = JSON.parse(data);
  const edited = await edit(json);
  await fsp.writeFile(filePath, JSON.stringify(edited, null, 2));
};

main();
