import LanguageEnum from "../enums/LanguageEnum";

export default function getFlag(lang: LanguageEnum) {
    switch(lang) {
        case LanguageEnum.INDONESIA:
            return "ID"
            break;
        case LanguageEnum.INDONESIA_DUB:
            return "ID"
            break;
        case LanguageEnum.ENGLISH:
            return "US"
            break;
        case LanguageEnum.ENGLISH_DUB:
            return "US"
            break;
        case LanguageEnum.JAPANESE:
            return "JP"
            break;
        case LanguageEnum.JAPANESE_DUB:
            return "JP"
            break;
    }
}