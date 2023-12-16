"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;

// Let's get that intellisense working
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  appId: `com.teritori`,
  productName: "Teritori",

  compression: "normal",
  removePackageScripts: true,
  files: [
    "build/win.exe",
    "web-build/**/*",
    "node_modules/**/*",
    "package.json",
    "main.js",
    "icon.png",
    "splash.html",
    "splash.png",
    "preload.js",
  ],

  nodeGypRebuild: false,
  buildDependenciesFromSource: false,

  directories: {
    output: "dist/artifacts/local",
    buildResources: "installer/resources",
  },

  win: {
    target: "nsis",
    asar: true,
    asarUnpack: ["build/*"],
    icon: "./icon.png",
  },
  nsis: {
    deleteAppDataOnUninstall: true,
  },
};

builder
  .build({
    targets: Platform.WINDOWS.createTarget(undefined, builder.Arch.x64),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
