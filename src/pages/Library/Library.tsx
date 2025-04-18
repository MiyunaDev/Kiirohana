import Flag from 'react-world-flags'
import getFlag from '../../utils/getFlag'
import LanguageEnum from '../../enums/LanguageEnum'

const library: Array<{
    title: string,
    language: LanguageEnum,
    cover: string
}> = [
        {
            title: "Gochumon wa usagi desuga. Season 2",
            language: LanguageEnum.INDONESIA,
            cover: "https://media.discordapp.net/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=67fcc770&is=67fb75f0&hm=51487e03e5cd821102ff0db72648be149cd714b774aed5daf25ec53766703f2a&=&format=webp&width=663&height=940"
        },
        {
            title: "Gochumon wa usagi desuga. Season 2",
            language: LanguageEnum.INDONESIA_DUB,
            cover: "https://media.discordapp.net/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=67fcc770&is=67fb75f0&hm=51487e03e5cd821102ff0db72648be149cd714b774aed5daf25ec53766703f2a&=&format=webp&width=663&height=940"
        },
        {
            title: "Gochumon wa usagi desuga. Season 2",
            language: LanguageEnum.ENGLISH,
            cover: "https://media.discordapp.net/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=67fcc770&is=67fb75f0&hm=51487e03e5cd821102ff0db72648be149cd714b774aed5daf25ec53766703f2a&=&format=webp&width=663&height=940"
        },
        {
            title: "Gochumon wa usagi desuga. Season 2",
            language: LanguageEnum.JAPANESE_DUB,
            cover: "https://media.discordapp.net/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=67fcc770&is=67fb75f0&hm=51487e03e5cd821102ff0db72648be149cd714b774aed5daf25ec53766703f2a&=&format=webp&width=663&height=940"
        }
    ]

const Library = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 max-w-screen-xl mx-auto px-2">
            {library.map((detail, index) => (
                <div key={index} className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto">
                    <p className="rounded-t-2xl text-xs sm:text-sm p-1 text-center bg-[#C667F7]">Anime</p>

                    <div className="relative w-full">
                        <Flag
                            code={getFlag(detail.language)}
                            className="absolute w-1/4 top-1 left-1 z-10"
                        />
                        <p className="absolute text-xs top-1 right-1 rounded-3xl bg-[#C667F7] p-1">
                            12
                        </p>
                        <img
                            className="w-full aspect-[2/3] sm:aspect-[3/4] object-cover bg-gray-300 rounded-b-lg"
                            src={detail.cover}
                            alt={detail.title}
                        />
                    </div>

                    <a className="w-full text-xs sm:text-sm font-semibold text-center py-2 px-1 line-clamp-2">
                        {detail.title}
                    </a>
                </div>
            ))}
        </div>
    )
}

export default Library