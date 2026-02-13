import Media from "./Media";

export default interface Chapter {
    _id: string,
    _v: number,

    media: Media,

    volume: number, 
    chapter: number,

    canonicalTitle?: string,
}