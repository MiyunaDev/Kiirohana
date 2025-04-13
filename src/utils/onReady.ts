import ExtensionManager from "../extensions/manager";

var extensionManager: ExtensionManager | null

function onReady() {
    document.addEventListener("deviceready", () => {
        console.log(cordova.file.dataDirectory);
        const extm = new ExtensionManager(cordova.file.dataDirectory)
        extensionManager = extm
    }, false);
}

export {
    extensionManager,
    onReady
}