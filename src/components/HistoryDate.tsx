import { useEffect, useState } from "react"
import { Link } from "react-router"
import Flag from "react-world-flags"
import getFlag from "../utils/getFlag"
import LanguageEnum from "../enums/LanguageEnum"

const HistoryDate = ({ histories }: { histories: React.ComponentState }) => {

    const [hist, setHist] = useState<Record<string, any>>({})
    useEffect(() => {
        const fetch = async () => {
            const hist = histories.map((x: any) => {
                let date = new Date(x.updatedAt * 1000);
                let formattedDate = date.toLocaleDateString('en-GB');
                x.updatedAt = formattedDate;
                return x
            })
            const days: any = {}
            await hist.forEach((data: any) => {
                if (!days[data?.updatedAt]) {
                    days[data?.updatedAt] = []
                    days[data?.updatedAt].push(data)
                } else {
                    days[data?.updatedAt].push(data)
                }
            })
            console.log(days)

            setHist(days)
        }
        fetch()
    }, [histories])

    const formatDate = (k: string): string => {
        const [day, month, year] = k.split('/');
        const parsedDay = parseInt(day);
        const parsedMonth = parseInt(month) - 1;
        const parsedYear = parseInt(year);

        const date = new Date(parsedYear, parsedMonth, parsedDay);
        const now = new Date();

        const diffTime = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hari ini";
        if (diffDays === 1) return "Kemarin";
        if (diffDays < 7) return `${diffDays} Hari yang lalu`;
        if (diffDays < 14) return "Minggu lalu";
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} Minggu lalu`;
        if (diffDays < 60) return "Bulan lalu";
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} Bulan lalu`;

        return k;
    };

    return (
        <div className="w-full flex flex-col gap-2">
            {Object.keys(hist).map((k: string) => (
                <div key={k} className="flex flex-col">
                    <div className='w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 rounded-br-2xl py-2 my-2 text-center bg-[#C667F7]'>{formatDate(k)}</div>
                    <div className="w-full h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 max-w-screen-xl mx-auto px-2">
                        {hist[k]?.map((detail: any) => (
                            <Link
                                to={`/detail/?title=${encodeURIComponent(detail.media.title.userPreferred)}`}
                                key={detail.media.id}
                                className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto"
                            >
                                <div className="relative w-full">
                                    <Flag
                                        code={getFlag("ID" as LanguageEnum)}
                                        className="absolute w-1/4 top-1 left-1 z-10"
                                    />

                                    <img
                                        className="w-full aspect-[2/3] sm:aspect-[3/4] object-cover bg-gray-300 rounded-r-xl"
                                        src={detail.media.coverImage.large}
                                        alt={detail.media.title.userPreferred}
                                    />

                                    <a className='absolute text-sm p-2 bottom-0 text-center left-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.0)]'>
                                        Anilist
                                    </a>
                                </div>

                                <div className='grid grid-cols-2'>
                                    <a className='rounded-br-2xl px-0.5 py-1 text-xs text-center bg-[#C667F7]'>
                                        {detail.media.countryOfOrigin === "JP" ? "Anime" : detail.media.format === "NOVEL" ? "Light Novel" : detail.media.countryOfOrigin === "JP" && detail.media.format === "MANGA" ? "Manga" : detail.media.countryOfOrigin === "CN" && detail.media.format === "MANGA" ? "Manhua" : detail.media.countryOfOrigin === "KR" && detail.media.format === "MANGA" ? "Manhwa" : "Uknown"}
                                    </a>
                                    <a className='rounded-br-2xl px-0.5 py-1 text-xs text-center'>
                                        {detail.media.type === "ANIME" ? "Ep" : detail.media.type === "MANGA" ? "Ch" : "Ch"} {detail.progress ?? ""}
                                    </a>
                                </div>

                                <a className='px-0.5 py-1 text-xs text-center'>
                                    {detail.media.type == "ANIME" ? "Source Anime" : detail.media.type == "MANGA" ? "Source Manga" : "Uknown"}
                                </a>
                                <a className="w-full text-xs font-semibold text-center px-1 overflow-hidden">
                                    <a className='line-clamp-2'>
                                        {detail.media.title.english ?? detail.media.title.userPreferred}
                                    </a>
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HistoryDate