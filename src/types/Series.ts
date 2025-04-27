import LanguageEnum from "../enums/LanguageEnum"

export enum SeriesEnum {
    LightNovel = "Light Novel",
    WebNovel = "Web Novel",
    Manga = "Manga",
    Manhua = "Manhua",
    Manhwa = "Manhwa"
}

export enum StatusEnum {
    Finished = "Finished",
    Ongoing = "Ongoing",
    Hiatus = "Hiatus",
    NotYetReleased = "Not Yet Released",
    Cancelled = "Cancelled"
}

export type NovelContent = {
    type: "paragraph" | "illustration" | "heading",
    value?: string,
    size?: 1 | 2 | 3 | 4 | 5 | 6,
    url?: string
}

export type Chapter = {
    volume: number,
    chapter: number,
    title?: string | null,
    url: string,
    id: string,
    content: Array<string> | Array<NovelContent>
}

export type SeriesType = {
    title: string,
    url: string,
    id: string,
    cover: string,
    type: SeriesEnum,
    language: LanguageEnum,
    genres?: Array<string>,
    status: StatusEnum,
    author: Array<string>,
    release: string,
    alternativeTitle: Array<string>
    chapters: Array<Chapter>,
    synopsis: string
}