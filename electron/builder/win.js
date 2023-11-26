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
    "icon.icns",
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
  },
  nsis: {
    deleteAppDataOnUninstall: true,
    include: "installer/win/nsis-installer.nsh",
  },
};

builder
  .build({
    targets: Platform.WINDOWS.createTarget(),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
