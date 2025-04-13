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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 gap-y-4">
            {library.map((detail) => {
                return (
                    <div className='w-full'>
                        <p className='rounded-t-2xl text-xs p-1 text-center bg-[#C667F7]'>Anime</p>
                        <div className="relative w-full">
                            <Flag code={getFlag(detail.language)} className="absolute w-1/4 top-1 left-1 z-10" />
                            <p className='absolute text-xs top-1 right-1 rounded-3xl bg-[#C667F7] p-1'>12</p>
                            <img
                                className="w-full aspect-[2/3] bg-gray-500 z-0"
                                src={detail.cover}
                            />
                        </div>
                        <a className='w-full text-xs font-semibold line-clamp-2 text-ellipsis text-center py-2'>{detail.title}</a>
                    </div>
                )
            })}
        </div>
    )
}

export default Library