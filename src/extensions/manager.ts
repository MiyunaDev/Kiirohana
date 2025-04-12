import axios from "axios";
import * as cheerio from "cheerio";


import ExtensionTypeEnum from "../enums/ExtensionTypeEnum";
import LanguageEnum from "../enums/LanguageEnum";
import ExtensionMetadataType from "../types/ExtensionMetadataType";
import readFileAsText from "../utils/readFileAsText";



export default class ExtensionManager {
    basePath: string; 
    constructor(basePath: string) {
        this.basePath = basePath
    }

    async getExtension(id: string): Promise<ExtensionMetadataType | null | { functions: any } | undefined>{
        const extensionType = Object.values(ExtensionTypeEnum)
        const languages = Object.values(LanguageEnum)
        for(const etype in extensionType) {
            for(const lang in languages) {
                const path = `${this.basePath}extension-${etype}/${lang}/${id}`
                try {
                    const metaStr = await readFileAsText(`${path}/metadata.json`)
                    const meta: ExtensionMetadataType = JSON.parse(metaStr as string)

                    const scriptStr = await readFileAsText(`${path}/${meta.entry}`)
                    const exports = await this.evaluateScript(scriptStr.toString())

                    return {
                        ...meta,
                        functions: exports
                    }
                } catch {

                }
            }
        }
    }

    async getExtensions(type: string): Promise<ExtensionMetadataType[]> {
        const folderPath = type ? `${this.basePath}extension-${type}/` : null
        if(!folderPath) throw Error("Folder cannot empty");
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(folderPath, (dirEntry: FileSystemDirectoryEntry) => {
                const reader = dirEntry.createReader()
                reader.readEntries((entries: FileSystemEntry[]) => {
                    const loadAll = entries.map((value: FileSystemEntry) => {
                        return new Promise<ExtensionMetadataType>((res, rej) => {
                            const metaPath = `${value.fullPath}metadata.json`
                            readFileAsText(metaPath).then((value: String): void | PromiseLike<void | null | undefined> | null | undefined => {
                                res(JSON.parse(value.toString()))
                            }).catch(rej)
                        })
                    })
                    Promise.all(loadAll).then(resolve).catch(reject)
                }, reject)
            }, reject)
        })
    }

    private async evaluateScript(script: string): Promise<Record<string, any>> {
        const exports = {}
        const module = { exports }
        const wrapped = new Function("axios", "cheerio", "module", "exports", `
            ${script}`)
        await wrapped(axios, cheerio, module, module, exports )
        return module.exports;
    }
}