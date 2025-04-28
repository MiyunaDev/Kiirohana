import { Link } from "react-router"
import { Chapter } from "../types/Series"

const PageChanger = ({ to, chapter, chapterPreview, type }: { to?: string, chapter: Chapter | null, chapterPreview: string, type: "next" | "before" }) => {
    return (
        <Link
            to={to as string}
            onClick={() => setTimeout(() => {
                window.location.reload()
            }, 100)}
            className={`w-4/5 bg-[#C667F7] flex flex-row my-5 ${!chapter ? "opacity-70" : ""}`}
        >
            {chapterPreview && (
                <img
                    src={chapterPreview}
                    className="w-2/5 md:w-auto md:h-30 aspect-square object-cover object-top"
                    alt="Preview Before"
                />
            )}
            <div
                className={`w-3/5 md:w-full flex flex-col items-center justify-center ${!chapterPreview ? "!w-full" : ""}`}
            >
                <a href="#">{type === "next" ? "Next" : "Previous"}</a>
                <a>
                    {chapter?.volume !== 0 ? `Volume ${chapter?.volume} ` : ""}
                    Chapter {chapter?.chapter}
                </a>
            </div>
        </Link>

    )
}

export default PageChanger