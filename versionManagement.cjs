const pkg = require("./package.json")
const appPkg = require("./cordova/package.json")
var clc = require("cli-color");
const fs = require("node:fs")

if (pkg.version !== appPkg.version) {
    console.log(clc.blue(`Version is different in project is ${clc.underline(pkg.version)} and app is`), clc.red(appPkg.version))
    console.log(clc.blue(`Try changing`))
    appPkg.version = pkg.version
    try {
        fs.writeFileSync("./cordova/package.json", JSON.stringify(appPkg, null, 2), "utf-8")
        console.log(clc.green("Success write version"))
    } catch(err) {
        console.log(clc.red("Fail to write version", err))
    }
}