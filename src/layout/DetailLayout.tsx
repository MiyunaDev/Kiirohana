import { useEffect, useState } from "react"
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { Chapter, SeriesType } from "./../types/Series"
import { library } from "../../demo"
import { FaArrowLeft } from "react-icons/fa";

const DetailLayout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    const [ch, setCh] = useState<Chapter>()
    const [detail, setDetail] = useState<SeriesType | null>(null);

    useEffect(() => {
        const title = searchParams.get('title');
        const chapterid = searchParams.get('chapterid');

        const info: SeriesType = library.find((x: SeriesType) => x.title === title) as SeriesType;
        setDetail(info);
        if (chapterid) {
            const chapter: Chapter | undefined = info.chapters.find(x => x.id === chapterid)
            if (!chapter) return;
            setCh(chapter)
        }
    }, [searchParams.toString()]);


    return (
        <div className="w-full h-full">
            <div className="sticky w-full py-4 flex items-center px-4 gap-4 top-0 left-0 bg-[#404040] z-50">
                <FaArrowLeft
                    onClick={() => navigate(-1) && setTimeout(() => {
                        window.location.reload()
                    }, 100)}
                    size={18}
                    className="cursor-pointer flex-shrink-0"
                />
                <div className={`grid ${ch ? "grid-rows-2" : "grid-rows-1"}`}>
                    <span className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {detail?.title}
                    </span>
                    {ch ? (
                        <span className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            {ch.volume !== 0 ? `Volume ${ch.volume} ` : ""}
                            Chapter {ch.chapter}
                        </span>
                    ) : null}
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default DetailLayout