import { useState } from "react"
import {
  FaLink,
  FaImage,
  FaPlay,
  FaCircleInfo,
  FaRobot,
  FaFileLines,
  FaTriangleExclamation,
  FaCalendarDays,
  FaChevronDown
} from "react-icons/fa6"

export default function EmbedCard({ embed }: { embed: any }) {
  const [open, setOpen] = useState(true)

  const iconMap: any = {
    link: <FaLink />,
    image: <FaImage />,
    video: <FaPlay />,
    info: <FaCircleInfo />,
    ai: <FaRobot />,
    code: <FaFileLines />,
    warning: <FaTriangleExclamation />,
    event: <FaCalendarDays />
  }

  return (
    <div
      className="mt-2 rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden"
      style={{ borderLeft: `4px solid ${embed.accentColor || "#3f3f46"}` }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-zinc-200">
          <span className="text-zinc-400">{iconMap[embed.type]}</span>
          <span className="font-semibold">{embed.title}</span>
        </div>

        {embed.collapsible && (
          <button
            onClick={() => setOpen(!open)}
            className="text-zinc-400 hover:text-white transition"
          >
            <FaChevronDown
              className={`transition ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {open && (
        <div className="px-4 pb-4 text-sm space-y-3">
          {embed.description && (
            <p className="text-zinc-400 leading-relaxed">
              {embed.description}
            </p>
          )}

          {/* FIELDS */}
          {embed.fields && (
            <div className="grid grid-cols-2 gap-3">
              {embed.fields.map((f: any, i: number) => (
                <div key={i}>
                  <span className="text-xs text-zinc-500">
                    {f.name}
                  </span>
                  <p className="text-zinc-200">{f.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* IMAGE */}
          {embed.image && (
            <img
              src={embed.image}
              className="rounded-lg max-h-64 object-cover"
            />
          )}

          {/* URL */}
          {embed.url && (
            <a
              href={embed.url}
              target="_blank"
              className="text-indigo-400 hover:underline text-xs"
            >
              {embed.siteName || embed.url}
            </a>
          )}

          {/* FOOTER */}
          {embed.footer && (
            <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
              {embed.footer}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
