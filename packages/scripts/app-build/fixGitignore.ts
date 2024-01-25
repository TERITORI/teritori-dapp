import fs from "fs";

const FILE_PATH = "./.gitignore";

const TO_REMOVE_ITEMS = ["/weshd/ios/Frameworks/", "/weshd/android/libs/"];

fs.readFile(FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading gitignore", err);
    return;
  }
  let updatedData = data;

  TO_REMOVE_ITEMS.forEach((item) => {
    updatedData = updatedData.replace(new RegExp(item, "g"), "");
  });

  fs.writeFile(FILE_PATH, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to package.json:", err);
    } else {
      console.log("gitignore updated successfully!");
    }
  });
});
