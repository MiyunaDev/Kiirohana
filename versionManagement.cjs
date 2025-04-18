const pkg = require("./package.json");
const appPkg = require("./cordova/package.json");
const clc = require("cli-color");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js"); // npm install xml2js

const configPath = path.join(__dirname, "cordova", "config.xml");

fs.readFile(configPath, "utf-8", (err, xmlData) => {
  if (err) {
    console.log(clc.red("❌ Failed to read config.xml:", err));
    return;
  }

  xml2js.parseString(xmlData, (err, result) => {
    if (err) {
      console.log(clc.red("❌ Failed to parse config.xml:", err));
      return;
    }

    const configVersion = result?.widget?.$?.version;

    if (
      pkg.version !== appPkg.version ||
      pkg.version !== configVersion
    ) {
      console.log(
        clc.blue("🔄 Detected version mismatch:")
      );
      console.log("  📦 package.json       :", clc.yellow(pkg.version));
      console.log("  📦 cordova/package.json:", clc.red(appPkg.version));
      console.log("  ⚙️  config.xml         :", clc.magenta(configVersion));

      appPkg.version = pkg.version;
      try {
        fs.writeFileSync(
          "./cordova/package.json",
          JSON.stringify(appPkg, null, 2),
          "utf-8"
        );
        console.log(clc.green("✅ Updated cordova/package.json"));
      } catch (err) {
        console.log(clc.red("❌ Failed to write cordova/package.json:", err));
      }

      result.widget.$.version = pkg.version;
      const builder = new xml2js.Builder();
      const updatedXml = builder.buildObject(result);

      try {
        fs.writeFileSync(configPath, updatedXml, "utf-8");
        console.log(clc.green("✅ Updated config.xml"));
      } catch (err) {
        console.log(clc.red("❌ Failed to write config.xml:", err));
      }
    } else {
      console.log(clc.green("✅ All versions are in sync."));
    }
  });
});
