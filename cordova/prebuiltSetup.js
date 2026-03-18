// switch-build-config.js
const fs = require('node:fs');
const path = require('node:path');

const manifestPath = path.join(
  __dirname,
  'platforms/android/app/src/main/AndroidManifest.xml'
);

const env = process.env.BUILD_ENV || 'dev';

let xml = fs.readFileSync(manifestPath, 'utf-8');

if (env === 'dev') {
  console.log('Applying DEV config (allow HTTP)');

  xml = xml.replace(
    /<application([^>]*)>/,
    `<application$1 android:usesCleartextTraffic="true" android:networkSecurityConfig="@xml/network_security_config">`
  );

} else {
  console.log('Applying PROD config (HTTPS only)');

  xml = xml.replace(/\sandroid:usesCleartextTraffic="true"/g, '');
  xml = xml.replace(/\sandroid:networkSecurityConfig="@xml\/network_security_config"/g, '');
}

fs.writeFileSync(manifestPath, xml);
console.log('AndroidManifest.xml updated');

const baseDir = path.join(__dirname);
let configFile = '';

if (os.platform() === 'win32') {
  configFile = 'build-windows.json';
} else if (os.platform() === 'linux') {
  configFile = 'build-linux.json';
} else if (os.platform() === 'darwin') {
  configFile = 'build-mac.json';
} else {
  console.error('Unsupported platform for build.');
  process.exit(1);
}

const source = path.join(baseDir, configFile);
const dest = path.join(baseDir, 'build.json');

fs.copyFileSync(source, dest);
console.log(`Copied ${configFile} -> build.json`);