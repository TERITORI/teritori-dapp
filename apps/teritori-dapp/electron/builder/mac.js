"use strict";

const builder = require("electron-builder");
const { program } = require("commander");
const Platform = builder.Platform;

program.argument("<arch>", "target architecture");
program.parse();
let arch;
const [archStr] = program.args;
switch (archStr) {
  case "amd64":
    arch = builder.Arch.x64;
    break;
  case "arm64":
    arch = builder.Arch.arm64;
    break;
  default:
    throw new Error(`Unsupported architecture ${archStr}`);
}

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
    "build/mac",
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

  mac: {
    target: "dmg",
    asar: true,
    asarUnpack: ["build/*"],
    hardenedRuntime: true,
    gatekeeperAssess: true,
    icon: "./icon.png",
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
    targets: Platform.MAC.createTarget(undefined, arch),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
