import { FaBookOpen, FaLanguage, FaUserPen } from "react-icons/fa6"
import { SeriesType } from "../../../../types/Series"

export default function SeriesCard({ series }: { series: SeriesType }) {
  return (
    <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex gap-4 p-4">
        <img
          src={series.cover}
          className="w-20 h-28 object-cover rounded-lg"
        />

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={series.url}
            target="_blank"
            className="font-semibold text-indigo-400 hover:underline"
          >
            {series.title}
          </a>

          <p className="text-xs text-zinc-400 italic">
            {series.alternativeTitle.join(" • ")}
          </p>

          <div className="flex gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <FaBookOpen /> {series.type}
            </span>
            <span className="flex items-center gap-1">
              <FaLanguage /> {series.language}
            </span>
            <span className="flex items-center gap-1">
              <FaUserPen /> {series.author.join(", ")}
            </span>
          </div>

          <p className="text-xs text-zinc-300 line-clamp-3">
            {series.synopsis}
          </p>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-zinc-800 text-xs text-zinc-400 flex justify-between">
        <span>Status: {series.status}</span>
        <span>Chapters: {series.chapters.length}</span>
      </div>
    </div>
  )
}
