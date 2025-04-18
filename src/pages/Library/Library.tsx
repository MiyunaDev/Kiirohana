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
            cover: "https://cdn.discordapp.com/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=6802b630&is=680164b0&hm=a7bf4480a2cc0f098f7754ba7847e4d936ae7ed3f0d41c73640a470b29faa5b0&"
        },
        {
            title: "Gochumon wa usagi desuga. Season 2",
            language: LanguageEnum.INDONESIA_DUB,
            cover: "https://cdn.discordapp.com/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=6802b630&is=680164b0&hm=a7bf4480a2cc0f098f7754ba7847e4d936ae7ed3f0d41c73640a470b29faa5b0&"
        },
        {
            title: "Gochumon wa usagi desuga. Season 2",
            language: LanguageEnum.ENGLISH,
            cover: "https://cdn.discordapp.com/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=6802b630&is=680164b0&hm=a7bf4480a2cc0f098f7754ba7847e4d936ae7ed3f0d41c73640a470b29faa5b0&"
        },
        {
            title: "Gochumon wa usagi desuga. Season 2",
            language: LanguageEnum.JAPANESE_DUB,
            cover: "https://cdn.discordapp.com/attachments/847678573040631818/1070984388612993024/Gochuumon_wa_Usagi_desu_ka_.jpg?ex=6802b630&is=680164b0&hm=a7bf4480a2cc0f098f7754ba7847e4d936ae7ed3f0d41c73640a470b29faa5b0&"
        }
    ]

const Library = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 max-w-screen-xl mx-auto px-2">
            {library.map((detail, index) => (
                <div key={index} className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto">
                    <div className="relative w-full">
                        <Flag
                            code={getFlag(detail.language)}
                            className="absolute w-1/4 top-1 left-1 z-10"
                        />
                        <p className="absolute text-xs top-1 right-1 rounded-3xl bg-[#C667F7] p-1">
                            12
                        </p>
                        <img
                            className="w-full aspect-[2/3] sm:aspect-[3/4] object-cover bg-gray-300 rounded-r-xl"
                            src={detail.cover}
                            alt={detail.title}
                        />
                        <a className='absolute p-2 bottom-0 text-center left-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.0)]'>Anilist</a>
                    </div>
                    <a className=' w-1/2 rounded-br-2xl text-xs sm:text-sm p-1 text-center bg-[#C667F7]'>Anime</a>
                    <a className="w-full text-xs sm:text-sm font-semibold text-center py-2 px-1 line-clamp-2">
                        {detail.title}
                    </a>
                </div>
            ))}
        </div>
    )
}

export default Library