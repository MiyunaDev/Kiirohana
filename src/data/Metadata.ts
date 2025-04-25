import localforage from "localforage"; 

export type metadataType = {
    title: string,
    id: string,
    cover: Base64URLString,
    extensionId: string,
    author: Array<String>,
}

export const metadataStore = localforage.createInstance({
    name: "app",
    storeName: "metadata",
});