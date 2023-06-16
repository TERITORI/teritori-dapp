const _ = require("lodash");
const path = require("path");

const desktopDependencies = require("./package.json").dependencies;
const commonWebpack = require("./webpack");

module.exports = async (env) => {
  const rendererConfig = await commonWebpack();
  const outputPath = path.resolve(__dirname, "go/electron/prod/resources/app");

  const mainProcessConfig = {
    mode: "production",
    name: "desktop",
    target: "electron-main",
    entry: {
      index: "./desktop/prod/index.js",
      contextBridge: "./desktop/prod/contextBridge.js",
    },
    output: {
      filename: "[name].js",
      path: outputPath,
      libraryTarget: "commonjs2",
    },
    externals: [..._.keys(desktopDependencies), "fsevents"],
    node: {
      __dirname: false,
      __filename: false,
    },
  };

  return [mainProcessConfig, rendererConfig];
};
