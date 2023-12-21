const fs = require("fs");

const filePath = "./.gitignore";

// Read the package.json file
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading gitignore", err);
    return;
  }

  // Define the regular expression to match the line you want to remove

  // Remove the matched line using replace
  let updatedData = data.replace("/modules/weshd/ios/Frameworks/", "");
  updatedData = data.replace("/modules/weshd/android/libs/", "");

  // Write the updated content back to package.json
  fs.writeFile(filePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to package.json:", err);
    } else {
      console.log("Package.json updated successfully!");
    }
  });
});
