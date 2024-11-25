import fs from "fs";

const FILE_PATH = "./ios/PrivacyInfo.xcprivacy";

const FILE_CONTENT = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>NSPrivacyAccessedAPITypes</key>
        <array>
                <dict>
                        <key>NSPrivacyAccessedAPIType</key>
                        <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
                        <key>NSPrivacyAccessedAPITypeReasons</key>
                        <array>
                                <string>35F9.1</string>
                        </array>
                </dict>
                <dict>
                        <key>NSPrivacyAccessedAPIType</key>
                        <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
                        <key>NSPrivacyAccessedAPITypeReasons</key>
                        <array>
                                <string>C617.1</string>
                        </array>
                </dict>
                <dict>
                        <key>NSPrivacyAccessedAPIType</key>
                        <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
                        <key>NSPrivacyAccessedAPITypeReasons</key>
                        <array>
                                <string>CA92.1</string>
                        </array>
                </dict>
                <dict>
                        <key>NSPrivacyAccessedAPIType</key>
                        <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
                        <key>NSPrivacyAccessedAPITypeReasons</key>
                        <array>
                                <string>E174.1</string>
                        </array>
                </dict>
        </array>
</dict>
</plist>
`;

fs.writeFile(FILE_PATH, FILE_CONTENT, "utf8", (err) => {
  if (err) {
    console.error("Error writing to PrivacyInfo.xcprivacy:", err);
    process.exit(1);
  } else {
    console.log("PrivacyInfo.xcprivacy file created successfully!");
  }
});
