import fs from "fs";

const FILE_PATH = "./electron/web-build/index.html";

fs.readFile(FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading gitignore", err);
    return;
  }
  let updatedData = data;

  updatedData = updatedData.replace(/\/_expo\//g, "./_expo/");

  fs.writeFile(FILE_PATH, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error updating electron index.html:", err);
    } else {
      console.log("index.html updated successfully!");
    }
  });
});
