const fs = require("fs");

const filePath = "./.gitignore";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading gitignore", err);
    return;
  }

  let updatedData = data.replace("/weshd/ios/Frameworks/", "");
  updatedData = updatedData.replace("/weshd/android/libs/", "");

  fs.writeFile(filePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to package.json:", err);
    } else {
      console.log("gitignore updated successfully!");
    }
  });
});
