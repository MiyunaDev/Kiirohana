import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router';
import { Chapter, SeriesType } from "./../../types/Series.ts";
import { library } from "../../../demo";
import LazyImage from "../../components/LazyImage.tsx";

function getPreview(chapter: Chapter, type: string): string {
    const slc = chapter.content
        .filter(co => typeof co === "string" || (typeof co === "object" && co.url))
        .map(content => typeof content === "string" ? content : content.url) as string[];

    if (!slc.length) return "";

    if (type === "novel") {
        return slc[0];
    } else {
        if (slc.length === 1) return slc[0];
        if (slc.length < 3) return slc[slc.length - 1];

        let page = Math.floor(slc.length * 0.05);
        if (page < 2) page = 2;
        return slc[page];
    }
}

const ComicReader = () => {
    const [searchParams] = useSearchParams();

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [detail, setDetail] = useState<SeriesType | null>(null);
    const [before, setBefore] = useState<Chapter | null>(null);
    const [after, setAfter] = useState<Chapter | null>(null);

    
    useEffect(() => {
        const title = searchParams.get('title');
        const chapterid = searchParams.get('chapterid');
        
        const info = library.find(x => x.title === title) || null;
        setDetail(info);

        if (info) {
            const sortedChapters = [...info.chapters].sort((a, b) => {
                if (a.volume === b.volume) {
                    return a.chapter - b.chapter;
                }
                return a.volume - b.volume;
            });
            const currentChapterIndex = sortedChapters.findIndex(ch => ch.id === chapterid);

            if (currentChapterIndex !== -1) {
                setChapter(sortedChapters[currentChapterIndex]);
                setBefore(sortedChapters[currentChapterIndex - 1] || null);
                setAfter(sortedChapters[currentChapterIndex + 1] || null);
            }
        }
    }, [searchParams.toString()]);

    const beforePreview = before && detail ? getPreview(before, detail.type) : "";
    const afterPreview = after && detail ? getPreview(after, detail.type) : "";

    return (
        <div className="w-full h-full flex flex-col items-center max-w-screen">
            {before ? (
                <button disabled={!before} className="w-4/5 bg-[#C667F7] flex flex-row my-5">
                    {beforePreview && <img src={beforePreview} className="w-2/5 aspect-square object-cover object-top" alt="Preview Before" />}
                    <div className={`w-3/5 flex flex-col items-center justify-center ${!beforePreview ? "!w-full" : ""}`}>
                        <a href="#">Previous</a>
                        <a>{before.volume !== 0 ? `Volume ${before.volume} ` : ""}Chapter {before.chapter}</a>
                    </div>
                </button>) : null}
            {chapter?.content.map((ct, index) => {
                const src = typeof ct === "string" ? ct : ct.url;
                return (
                    <LazyImage
                        key={index}
                        src={src}
                        className="w-full"
                        loading="lazy"
                        alt={`Page ${index + 1}`}
                    />
                );
            })}
            {after ? (
                <button disabled={!after} className="w-4/5 bg-[#C667F7] flex flex-row my-5">
                    {afterPreview && <img src={afterPreview} className="w-2/5 aspect-square object-cover object-top" alt="Preview Before" />}
                    <div className={`w-3/5 flex flex-col items-center justify-center ${!afterPreview ? "!w-full" : ""}`}>
                        <a href="#">Next</a>
                        <a>{after.volume !== 0 ? `Volume ${after.volume} ` : ""}Chapter {after.chapter}</a>
                    </div>
                </button>
            ) : null}
        </div>
    );
};

export default ComicReader;