import localforage from "localforage"; 

export type sourceType = {
    url: string
}

export const sourceStore = localforage.createInstance({
    name: "app",
    storeName: "source",
});