import { Chapter } from "../types/Series";
import MediaExternal from "./MediaExternal";
import Source from "./Source";

export type EpisodeSource =
  | { type: "video"; url: string; server: string }
  | { type: "iframe"; url: string; server: string };

export default interface ChapterContent {
    _id: string,
    _v: number,

    chapter: Chapter;
    mediaExternal: MediaExternal,
    extension: Source,

    language: string,
    authors?: Array<string>
    title?: string,
    content?: Array<string> | EpisodeSource[],
    uploadedAt: Date,
    isApproved?: boolean,

    url: string,
    raw: any
}