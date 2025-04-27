import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from 'react-router';
import { Chapter, SeriesEnum, SeriesType } from "./../../types/Series.ts"
import { library } from "../../../demo"
import { FaArrowLeft } from "react-icons/fa";

const ChapterCard = ({
    chapter,
    type,
}: {
    chapter: Chapter;
    type?: "novel" | "comic";
}) => {
    const [preview, setPreview] = useState<string>();

    useEffect(() => {
        const slc = chapter.content
            .filter(
                (co) =>
                    typeof co === "string" || (typeof co === "object" && co.url)
            )
            .map((content) =>
                typeof content === "string" ? content : content.url
            ) as string[];

        let previewUrl: string | undefined;

        if (type === "novel") {
            previewUrl = slc[0];
        } else {
            if (slc.length === 1) {
                previewUrl = slc[0];
            } else if (slc.length < 3) {
                previewUrl = slc[slc.length - 1];
            } else {
                let page = Math.floor(slc.length * 0.05);
                if (page < 2) page = 2;
                previewUrl = slc[page];
            }
        }

        setPreview(previewUrl);
    }, [chapter, type]);

    return (
        <div className="relative flex flex-row items-center p-2 h-24 gap-2 group before:absolute before:z-10 before:left-0 before:top-0
        before:min-h-full before:rounded-r-full before:transition-all before:duration-500
        hover:shadow active:shadow hover:shadow-[#C667F7] active:shadow-[#C667F7]
        before:w-0 hover:before:w-screen active:before:w-screen before:bg-[#C667F7]">
            {preview && (
                <div className={`relative z-10 w-15 aspect-[3/4] ${type === "novel" ? "group-hover:after:to-[rgba(198,103,247,0.7)] group-active:after:to-[rgba(198,103,247,0.7)] after:absolute after:inset-0 after:bg-gradient-to-r after:from-[rgba(0,0,0,0.2)] after:to-[rgba(0,0,0,1)] transition-all duration-500" : ""}`}>
                    <img
                        className="w-full h-full object-cover object-top"
                        src={preview}
                        alt="Chapter preview"
                    />
                </div>

            )}
            <div className={`flex z-10 flex-col ${type === "novel" ? "absolute left-10" : ""}`}>
                <a>
                    {chapter.volume !== 0 ? `Volume ${chapter.volume} ` : ""}
                    Chapter {chapter.chapter}
                </a>
            </div>
        </div>
    );
};


const Detail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const title = searchParams.get('title');

    const [detail, setDetail] = useState<SeriesType | null>(null);

    useEffect(() => {
        const info: SeriesType = library.find(x => x.title === title) as SeriesType;
        setDetail(info);
    }, [title]);

    return (
        <div className="min-h-screen max-h-screen text-white overflow-x-hidden">
            <div className="w-full py-4 flex items-center px-4 gap-4 sticky top-0 bg-[#404040] z-50">
                <FaArrowLeft onClick={() => navigate(-1)} size={18} className="cursor-pointer" />
                <span className="truncate max-w-full">{detail?.title}</span>
            </div>

            <div className="w-full flex flex-col md:grid md:grid-cols-2">
                <div className="relative w-full overflow-hidden">
                    <div className="w-full aspect-[16/5] relative z-0">
                        <img
                            className="w-full h-full object-cover"
                            src={detail?.cover}
                            alt="cover background"
                        />
                        <div className="absolute inset-0 backdrop-blur-lg" />
                    </div>

                    <div className="w-full px-4 -mt-8 flex items-start gap-4 relative z-10">
                        <img
                            className="aspect-[2/3] w-32 sm:w-40 object-cover bg-gray-300 rounded-md shadow-lg"
                            src={detail?.cover}
                            alt={detail?.title}
                        />
                        <div className="flex flex-col mt-8 justify-end pb-2">
                            <h1 className="text-xl sm:text-2xl font-semibold">{detail?.title}</h1>
                            <p className="text-sm opacity-70">Unknown</p>
                            <p className="text-sm">{detail?.author?.join(", ")}</p>
                        </div>
                    </div>
                    <div className="px-4 py-6 md:px-8 md:py-6 text-sm md:text-base leading-relaxed">
                        {detail?.synopsis}
                    </div>
                    <div className="p-2">{detail?.genres?.map((gen) => <span className="py-2 px-3 border-2 border-[#C667F7] rounded-lg m-1">{gen}</span>)}</div>
                </div>

                <div className="p-4 gap-2">
                    {detail?.chapters.map((ch) => {
                        const isNovel = detail.type === SeriesEnum.LightNovel || detail.type === SeriesEnum.WebNovel;
                        const isComic = detail.type === SeriesEnum.Manga || detail.type === SeriesEnum.Manhwa || detail.type === SeriesEnum.Manhua;
                        const type = isComic ? "comic" : isNovel ? "novel" : undefined;

                        return <ChapterCard key={ch.id} chapter={ch} type={type} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default Detail;