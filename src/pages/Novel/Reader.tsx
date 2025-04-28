import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router';
import { Chapter, NovelContent, SeriesType } from "./../../types/Series.ts";
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

const NovelReader = () => {
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
        <div className="w-screen overflow-x-hidden h-full flex flex-col items-center max-w-screen-sm">
            {before ? <PageChanger type="before" chapter={before} chapterPreview={beforePreview} to={`/detail/reader/novel?title=${encodeURIComponent(detail?.title as string)}&chapterid=${encodeURIComponent(before?.id)}`} /> : null}
            <div className="w-full overflow-x-hidden">
                {chapter?.content.map((ct, index) => {
                    ct = ct as NovelContent
                    if (ct.type === "heading") {
                        const size = ct.size ?? 1;

                        const textSizes = {
                            1: "text-4xl",
                            2: "text-3xl",
                            3: "text-2xl",
                            4: "text-xl",
                            5: "text-lg",
                            6: "text-base",
                        };

                        return (
                            <div key={index} className={`max-w-full box-border break-words px-4 my-4 font-bold ${textSizes[size]}`}>
                                {ct.value}
                            </div>
                        );
                    }

                    if (ct.type === "paragraph") {
                        return (
                            <div key={index} className="max-w-full box-border break-words px-4 mb-2 leading-relaxed">
                                {ct.value}
                            </div>
                        );
                    }

                    if (ct.type === "illustration") {
                        return (
                            <LazyImage
                                key={index}
                                src={ct.url}
                                className="w-full my-4"
                                loading="lazy"
                                alt={`Illust ${index + 1}`}
                            />
                        );
                    }
                    return null;
                })}
            </div>
            {after ? <PageChanger type="next" chapter={after} chapterPreview={afterPreview} to={`/detail/reader/novel?title=${encodeURIComponent(detail?.title as string)}&chapterid=${encodeURIComponent(after?.id)}`} /> : null}
        </div>
    );
};

export default NovelReader;