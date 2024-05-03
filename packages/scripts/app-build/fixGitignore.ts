import fs from "fs";

const FILE_PATH = "./.gitignore";

const TO_REMOVE_ITEMS = [
  "/weshd/ios/Frameworks/",
  "/weshd/android/libs/",
  "/ios",
];

fs.readFile(FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading gitignore", err);
    process.exit(1);
  }
  let updatedData = data;

  TO_REMOVE_ITEMS.forEach((item) => {
    updatedData = updatedData.replace(new RegExp(item, "g"), "");
  });

  fs.writeFile(FILE_PATH, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to gitignore:", err);
      process.exit(1);
    } else {
      console.log("gitignore updated successfully!");
    }
  });
});
