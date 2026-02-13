import { Chapter } from "../types/Series";
import ChapterContent from "./ChapterContent";
import Media from "./Media";
import MediaExternal from "./MediaExternal";
import Source from "./Source";

export default interface MultiSourceTree {
    media: Media,
    externals: Array<{
        source: Source,
        mediaExternal: MediaExternal,
        chapters: Array<{
            chapter: Chapter,
            hasContent: boolean,
            contentId?: string | null,
            content: ChapterContent
        }>
    }>
}