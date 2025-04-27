import Flag from 'react-world-flags'
import getFlag from '../../utils/getFlag'
import { useEffect, useState } from 'react'
import { getSettings, saveSettings } from '../../utils/testData'

import { library } from "./../../../demo.json"
import LanguageEnum from '../../enums/LanguageEnum'
import { SeriesType } from '../../types/Series'

const Library = () => {
    const [libraries] = useState<Array<any>>(library)

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
            {libraries.map((detail: SeriesType, index: number) => (
                <div key={index} className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto">
                    <div className="relative w-full">
                        <Flag
                            code={getFlag(detail.language as LanguageEnum)}
                            className="absolute w-1/4 top-1 left-1 z-10"
                        />
                        <p className="absolute text-xs top-1 right-1 rounded-3xl bg-[#C667F7] p-1">
                            {detail.chapters.length}
                        </p>
                        <img
                            className="w-full aspect-[2/3] sm:aspect-[3/4] object-cover bg-gray-300 rounded-r-xl"
                            src={detail.cover}
                            alt={detail.title}
                        />
                        <a className='absolute p-2 bottom-0 text-center left-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.0)]'>Uknown</a>
                    </div>
                    <a className=' w-1/2 rounded-br-2xl text-xs sm:text-sm p-1 text-center bg-[#C667F7]'>{detail.type}</a>
                    <a className="w-full text-xs sm:text-sm font-semibold text-center py-2 px-1 overflow-hidden">
                        <a className='line-clamp-2'>{detail.title}</a>
                    </a>
                </div>
            ))}
        </div>
    )
}

export default Library