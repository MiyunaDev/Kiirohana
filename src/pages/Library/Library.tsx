import Flag from 'react-world-flags'
import getFlag from '../../utils/getFlag'
import LanguageEnum from '../../enums/LanguageEnum'
import { useEffect } from 'react'
import { getSettings, saveSettings } from '../../utils/testData'

const library: Array<{
    title: string,
    language: LanguageEnum,
    cover: string
}> = [
        {
            title: "Ruri Dragon",
            language: LanguageEnum.INDONESIA,
            cover: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx150440-QdBFoMh4YHsK.jpg"
        },
        {
            title: "Ruri Dragon",
            language: LanguageEnum.INDONESIA_DUB,
            cover: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx150440-QdBFoMh4YHsK.jpg"
        },
        {
            title: "Ruri Dragon",
            language: LanguageEnum.ENGLISH,
            cover: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx150440-QdBFoMh4YHsK.jpg"
        },
        {
            title: "Ruri Dragon",
            language: LanguageEnum.JAPANESE_DUB,
            cover: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx150440-QdBFoMh4YHsK.jpg"
        }
    ]

const Library = () => {

    useEffect(() => {
        const loadSettings = async () => {
            let setting = await getSettings();
            console.log("Before saving:", setting);

            await saveSettings({
                language: "ENGLISH"
            });

            setting = await getSettings();
            console.log("After saving:", setting);
        };

        loadSettings();
    }, []);

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