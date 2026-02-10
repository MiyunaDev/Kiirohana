import { FaPlus } from "react-icons/fa6"
import { Reaction } from "./interface"

export default function ReactionBar({
  reactions
}: {
  reactions?: Reaction[]
}) {
  if (!reactions?.length) return null

  return (
    <div className="flex gap-2 mt-1">
      {reactions.map(r => (
        <button
          key={r.emoji}
          className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1
          ${r.reactedByMe
            ? "bg-indigo-500/20 text-indigo-300"
            : "bg-zinc-800 text-zinc-300"
          }`}
        >
          {r.emoji} {r.count}
        </button>
      ))}

      <button className="px-2 py-0.5 rounded-full bg-zinc-800 text-xs text-zinc-400">
        <FaPlus />
      </button>
    </div>
  )
}