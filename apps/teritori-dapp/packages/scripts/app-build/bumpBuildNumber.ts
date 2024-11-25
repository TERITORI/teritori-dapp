import fs from "fs";

const FILE_PATH = "./app.config.js";
const incrementalNumber = process.argv[2];

fs.readFile(FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading app.config.js", err);
    process.exit(1);
  }
  const regexBuildNumber = /buildNumber: "(\d+)"/;
  const regexVersionCode = /versionCode: "(\d+)"/;

  const updatedData = data
    .replace(regexBuildNumber, 'buildNumber: "' + incrementalNumber + '"')
    .replace(regexVersionCode, 'versionCode: "' + incrementalNumber + '"');

  fs.writeFile(FILE_PATH, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error updating app.config.js:", err);
      process.exit(1);
    } else {
      console.log("app.config.js updated successfully!");
    }
  });
});
