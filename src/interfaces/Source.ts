import Category from "../enums/CategoryEnum";

export default interface Source {
    name: string,
    identification: string,
    type: string,
    language: string,
    url?: string,
    categories: Category
}