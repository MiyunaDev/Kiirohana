export {};

declare global {
  interface Window {
    resolveLocalFileSystemURL: (url: string, successCallback: (fileEntry: FileEntry) => void, errorCallback?: () => void) => void;
  }
}