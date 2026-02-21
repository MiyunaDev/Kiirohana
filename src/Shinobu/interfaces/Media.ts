import Status from "../enums/StatusEnum";
import Type from "../enums/TypeEnum";
import Genre from "./Genre";
import Tag from "./Tag";

export default interface Media {
    _id?: string,
    _v?: number,
    title: string,
    alternativeTitle: string[]
    description?: string
    status: Status,
    type: Type,
    releaseDate?: Date,
    coverImage: string,
    bannerImage: string,
    genres: Array<Genre> | Array<string>
    tags: Array<Tag> | Array<string>
}