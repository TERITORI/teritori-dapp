import fs from "fs/promises";
import path from "path";
import process from "process";

import { Routes } from "../utils/router";

const ROUTES_DIR = path.join(__dirname, "../../packages/routes");

const routes: string[] = Object.keys({} as Routes);

const getFilenames = async (directoryPath: string) => {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    let filePaths: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        const subDirectoryFiles = await getFilenames(fullPath);
        // Append the subdirectory file paths with the directory name
        filePaths = filePaths.concat(
          subDirectoryFiles.map((file: string) => path.join(entry.name, file)),
        );
      } else {
        filePaths.push(entry.name);
      }
    }

    const removeFiles = [".DS_Store", "_layout.tsx"];

    filePaths = filePaths.filter(
      (path) => !removeFiles.some((removeFile) => path.includes(removeFile)),
    );
    filePaths = filePaths.map((path) => {
      path = path.replace(".tsx", "");
      path = path.replace(/\/?index$/, "");
      if (path === "") {
        return "";
      }
      return `/${path}`;
    });

    return filePaths;
  } catch (err) {
    console.error("Error reading directory:", err);
    throw err; // Throw the error for handling outside this function
  }
};

const main = async () => {
  try {
    const filenames = await getFilenames(ROUTES_DIR);
    // console.log("filename", filenames);

    const _fileNames = new Set(filenames);
    const _routes = new Set(routes);

    console.log(_routes);

    for (const fileName of _fileNames) {
      if (routes.includes(fileName)) {
        console.log("includes", fileName);
        _routes.delete(fileName);
        _fileNames.delete(fileName);
      }
    }

    console.log("test tt", _fileNames, _routes);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

main();
