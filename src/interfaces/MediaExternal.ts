import Status from "../enums/StatusEnum";
import Type from "../enums/TypeEnum";
import Genre from "./Genre";
import Media from "./Media";
import Source from "./Source";
import Tag from "./Tag";

export default interface MediaExternal {
    _id?: string,
    _v?: number,
    
    source: Source | string,
    media: Media | string,
    
    title: string,
    alternativeTitle: string[]
    description?: string
    status: Status,
    type: Type,
    releaseDate?: Date,
    coverImage: string,
    bannerImage: string,
    genres: Array<Genre> | Array<string>,
    tags: Array<Tag> | Array<string>,

    lastUploadedAt: Date,
    url: string,
    raw: any
}