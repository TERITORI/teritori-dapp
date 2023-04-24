const VERSION = "1.0.0";
module.exports = {
  appId: "com.teritori",
  productName: "TERITORI",
  extraMetadata: {
    version: VERSION,
  },
  mac: {
    category: "public.app-category.finance",
    icon: "desktop/prod/logo.png",
    hardenedRuntime: true,
    entitlements: "desktop/prod/entitlements.mac.plist",
    entitlementsInherit: "desktop/prod/entitlements.mac.plist",
    type: "distribution",
  },
  dmg: {
    title: "TERITORI",
    artifactName: "Teritori.dmg",
    internetEnabled: true,
  },

  afterSign: undefined,
  files: ["dist", "index.js"],
  directories: {
    app: "desktop/prod",
    output: "desktop-build",
  },
  protocols: {
    name: "TERITORI",
    schemes: ["teritori"],
  },
};
