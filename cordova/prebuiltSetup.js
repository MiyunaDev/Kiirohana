const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

// =========================
// ENV DETECTION
// =========================
const buildTarget = process.env.BUILD_TARGET || "cordova";
const env = process.env.BUILD_ENV || "dev";

// =========================
// PATHS
// =========================
const baseDir = __dirname;

const manifestPath = path.join(
  baseDir,
  "platforms/android/app/src/main/AndroidManifest.xml"
);

// =========================
// SAFE GUARD (IMPORTANT FIX)
// =========================
const isAndroidAvailable = fs.existsSync(manifestPath);

if (buildTarget !== "electron" && !isAndroidAvailable) {
  console.warn("[WARN] AndroidManifest.xml not found. Skipping Android config.");
}

// =========================
// ANDROID CONFIG PATCH (ONLY IF AVAILABLE + NOT ELECTRON)
// =========================
if (buildTarget !== "electron" && isAndroidAvailable) {
  let xml = fs.readFileSync(manifestPath, "utf-8");

  if (env === "dev") {
    console.log("Applying DEV config (allow HTTP)");

    if (!xml.includes("android:usesCleartextTraffic")) {
      xml = xml.replace(
        /<application([^>]*)>/,
        `<application$1 android:usesCleartextTraffic="true" android:networkSecurityConfig="@xml/network_security_config">`
      );
    }

  } else {
    console.log("Applying PROD config (HTTPS only)");

    xml = xml
      .replace(/\sandroid:usesCleartextTraffic="true"/g, "")
      .replace(
        /\sandroid:networkSecurityConfig="@xml\/network_security_config"/g,
        ""
      );
  }

  fs.writeFileSync(manifestPath, xml);
  console.log("AndroidManifest.xml updated");
} else {
  console.log("[SKIP] Android config not applied (electron or missing platform)");
}

// =========================
// PLATFORM-SPECIFIC BUILD CONFIG
// =========================
let configFile = "";

switch (os.platform()) {
  case "win32":
    configFile = "build-windows.json";
    break;
  case "linux":
    configFile = "build-linux.json";
    break;
  case "darwin":
    configFile = "build-mac.json";
    break;
  default:
    console.error("Unsupported platform for build.");
    process.exit(1);
}

// =========================
// SAFE COPY CONFIG
// =========================
const source = path.join(baseDir, configFile);
const dest = path.join(baseDir, "build.json");

if (!fs.existsSync(source)) {
  console.warn(`[WARN] ${configFile} not found, skipping copy.`);
} else {
  fs.copyFileSync(source, dest);
  console.log(`Copied ${configFile} -> build.json`);
}

// =========================
// DEBUG INFO (OPTIONAL)
// =========================
console.log("Build Target:", buildTarget);
console.log("Environment:", env);
console.log("Platform:", os.platform());