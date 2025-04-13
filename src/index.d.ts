export {};



declare global {

  declare var cordova: any

  interface Window {
    cordova: Cordova | null | undefined;
    file: any;
    resolveLocalFileSystemURL: (url: string, successCallback: (fileEntry: FileEntry) => void, errorCallback?: () => void) => void;
  }
}