import { useEffect, useState } from "react"
import { Link, useSearchParams } from 'react-router';
import { Chapter, SeriesEnum, SeriesType } from "./../../types/Series.ts"
import { library } from "../../../demo"
import { motion } from "framer-motion";

const ChapterCard = ({
    chapter,
    type,
    detail
}: {
    chapter: Chapter;
    type?: "novel" | "comic";
    detail: SeriesType
}) => {
    const [preview, setPreview] = useState<string>();
    const [destination, setDestination] = useState<string>()

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

        if (type === "comic") {
            setDestination(`/detail/reader/comic?title=${encodeURIComponent(detail.title)}&chapterid=${encodeURIComponent(chapter.id)}`)
        } else if (type === "novel") {
            setDestination(`/detail/reader/novel?title=${encodeURIComponent(detail.title)}&chapterid=${encodeURIComponent(chapter.id)}`)
        }

    }, [chapter, type]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link to={destination as string} className="relative flex flex-row items-center p-2 h-24 gap-2 group before:absolute before:z-10 before:left-0 before:top-0
        before:min-h-full before:rounded-r-full before:transition-all before:duration-500
        hover:shadow active:shadow hover:shadow-[#C667F7] active:shadow-[#C667F7]
        before:w-0 hover:before:w-screen active:before:w-screen before:bg-[#C667F7] overflow-hidden rounded-r-xl">
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
            </Link>
        </motion.div>
    );
};


const Detail = () => {
    const [searchParams] = useSearchParams();

    const [detail, setDetail] = useState<SeriesType | null>(null);

    useEffect(() => {
        const title = searchParams.get('title');

        const info: SeriesType = library.find(x => x.title === title) as SeriesType;
        setDetail(info);
    }, [searchParams.toString()]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen text-white overflow-x-hidden"
        >

            <div className="w-full flex flex-col md:grid md:grid-cols-2">
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full aspect-[16/5] relative z-0"
                    >

                        <img
                            className="w-full h-full object-cover"
                            src={detail?.cover}
                            alt="cover background"
                        />
                        <div className="absolute inset-0 backdrop-blur-lg" />
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="w-full px-4 -mt-8 flex items-start gap-4 relative z-10"
                    >

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
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="px-4 py-6 md:px-8 md:py-6 text-sm md:text-base leading-relaxed"
                    >
                        {detail?.synopsis}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, translateX: -100 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: 0.55 }}

                        className="p-2 flex flex-row overflow-y-auto items-center"
                    >
                        {detail?.genres?.map((gen) =>
                            <div
                                className="py-2 px-3 border-2 border-[#C667F7] rounded-lg m-1"
                            >
                                {gen}
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="relative w-full overflow-hidden p-4 gap-2">
                    {detail?.chapters.sort((a, b) => {
                        if (a.volume === b.volume) {
                            return a.chapter - b.chapter;
                        }
                        return a.volume - b.volume;
                    }).map((ch) => {
                        const isNovel = detail.type === SeriesEnum.LightNovel || detail.type === SeriesEnum.WebNovel;
                        const isComic = detail.type === SeriesEnum.Manga || detail.type === SeriesEnum.Manhwa || detail.type === SeriesEnum.Manhua;
                        const type = isComic ? "comic" : isNovel ? "novel" : undefined;

                        return <ChapterCard key={ch.id} chapter={ch} type={type} detail={detail} />;
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default Detail;