import { useEffect, useState } from "react"
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { SeriesType } from "./../types/Series"
import { library } from "../../demo"
import { FaArrowLeft } from "react-icons/fa";

const DetailLayout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const title = searchParams.get('title');

    const [detail, setDetail] = useState<SeriesType | null>(null);

    useEffect(() => {
        const info: SeriesType = library.find((x: SeriesType) => x.title === title) as SeriesType;
        setDetail(info);
    }, [title]);

    return (
        <div className="w-full overflow-x-hidden">
            <div className="w-full py-4 flex items-center px-4 gap-4 sticky top-0 bg-[#404040] z-50">
                <FaArrowLeft
                    onClick={() => navigate(-1)}
                    size={18}
                    className="cursor-pointer flex-shrink-0"
                />
                <span className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {detail?.title}
                </span>
            </div>
            <Outlet />
        </div>
    )
}

export default DetailLayout