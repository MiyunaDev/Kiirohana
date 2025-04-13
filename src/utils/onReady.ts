import ExtensionManager from "../extensions/manager";

declare var extensionManager: ExtensionManager

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