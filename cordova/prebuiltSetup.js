// switch-build-config.js
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const baseDir = path.join(__dirname);
let configFile = '';

if (os.platform() === 'win32') {
  configFile = 'build-windows.json';
} else if (os.platform() === 'linux') {
  configFile = 'build-linux.json';
} else {
  console.error('Unsupported platform for build.');
  process.exit(1);
}

const source = path.join(baseDir, configFile);
const dest = path.join(baseDir, 'build.json');

fs.copyFileSync(source, dest);
console.log(`Copied ${configFile} -> build.json`);