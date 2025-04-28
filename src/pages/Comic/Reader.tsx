import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router';
import { Chapter, SeriesType } from "./../../types/Series.ts";
import { library } from "../../../demo";
import LazyImage from "../../components/LazyImage.tsx";
import PageChanger from "../../components/PageChanger.tsx";

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
            {before ? <PageChanger type="before" chapter={before} chapterPreview={beforePreview} to={`/detail/reader/comic?title=${encodeURIComponent(detail?.title as string)}&chapterid=${encodeURIComponent(before?.id)}`} /> : null}
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
            {after ? <PageChanger type="next" chapter={after} chapterPreview={afterPreview} to={`/detail/reader/comic?title=${encodeURIComponent(detail?.title as string)}&chapterid=${encodeURIComponent(after?.id)}`} /> : null}
        </div>
    );
};

export default ComicReader;