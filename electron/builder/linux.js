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
    "build/linux",
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

  linux: {
    desktop: {
      StartupNotify: "false",
      Encoding: "UTF-8",
      MimeType: "x-scheme-handler/deeplink",
    },
    target: ["AppImage", "deb"],
    asar: true,
    asarUnpack: ["build/*"],
    icon: "./icon.png",
  },
  deb: {
    priority: "optional",
    afterInstall: "installer/linux/after-install.tpl",
  },
};

builder
  .build({
    targets: Platform.LINUX.createTarget(undefined, builder.Arch.x64),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
