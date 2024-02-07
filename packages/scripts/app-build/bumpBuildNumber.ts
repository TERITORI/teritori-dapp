import fs from "fs";

const FILE_PATH = "./app.config.js";
const buildNumber = process.argv[2];

fs.readFile(FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading app.config.js", err);
    return;
  }
  const regex = /buildNumber: "(\d+)"/;

  const updatedData = data.replace(regex, 'buildNumber: "' + buildNumber + '"');

  fs.writeFile(FILE_PATH, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error updating app.config.js:", err);
    } else {
      console.log("app.config.js updated successfully!");
    }
  });
});
