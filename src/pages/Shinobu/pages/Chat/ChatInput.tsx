import { FaPaperPlane } from "react-icons/fa6"

export default function ChatInput() {
  return (
    <div className="p-4 border-t border-white/10 bg-zinc-900">
      <div className="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-2">
        <input
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-zinc-400"
          placeholder="Tulis pesan..."
        />
        <button className="text-indigo-400 hover:text-indigo-300 transition">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  )
}
