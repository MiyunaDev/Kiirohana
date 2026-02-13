import MediaExternal from "./MediaExternal";
import Source from "./Source";


export default interface ChapterContent {
    _id: string,
    _v: number,

    mediaExternal: MediaExternal | string,
    extension: Source | string,

    language: string,
    authors?: Array<string>
    title?: string,
    content?: Array<string>,
    uploadedAt: Date,
    isApproved?: boolean,

    url: string,
    raw: any
}