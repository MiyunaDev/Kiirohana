import ExtensionInterface from "../interface/ExtensionInterface";

export default class ExtensionManager {
    public get(id: string): ExtensionInterface {
        return {
            name: "Nama",
            id: "com.kohana.kiirohana.komikcast",
            language: "sub"
        }
    }
}