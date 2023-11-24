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
    "build/**/*",
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

  mac: {
    target: "dmg",
    hardenedRuntime: true,
    gatekeeperAssess: true,
    icon: "./icon.icns",
    extendInfo: {
      // NSAppleEventsUsageDescription: "Let me use Apple Events.",
      // NSCameraUsageDescription: "Let me use the camera.",
      // NSScreenCaptureDescription: "Let me take screenshots.",
    },
  },
  dmg: {
    iconSize: 100,
    contents: [
      {
        x: 255,
        y: 85,
        type: "file",
      },
      {
        x: 253,
        y: 325,
        type: "link",
        path: "/Applications",
      },
    ],
  },
};

builder
  .build({
    targets: Platform.MAC.createTarget(),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
