import { Chapter } from "../types/Series";
import MediaExternal from "./MediaExternal";
import Source from "./Source";


export default interface ChapterContent {
    _id: string,
    _v: number,

    chapter: Chapter;
    mediaExternal: MediaExternal,
    extension: Source,

    language: string,
    authors?: Array<string>
    title?: string,
    content?: Array<string>,
    uploadedAt: Date,
    isApproved?: boolean,

    url: string,
    raw: any
}