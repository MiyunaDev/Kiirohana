import { motion } from "framer-motion"
import { FaRobot, FaShieldHalved, FaReply, FaFaceSmile } from "react-icons/fa6"
import { StatusDot } from "./StatusDot"
import { ChatMessage as Message } from "./interface"
import EmbedCard from "./EmbedCard"
import SeriesCard from "./SeriesCard"
import ReactionBar from "./ReactionBar"

export default function ChatMessage({
    msg,
    showAvatar = true
}: {
    msg: Message
    showAvatar?: boolean
}) {
    if (msg.type === "system") {
        return (
            <div className="text-center text-xs text-zinc-500">
                {msg.content}
            </div>
        )
    }

    const user = msg.sender!

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex gap-3 px-4 items-start"
        >
            {showAvatar ? (
                <div className="relative">
                    <img
                        src={user.avatar}
                        className="w-9 h-9 rounded-full ring-2 ring-zinc-800"
                    />
                    <StatusDot status={user.status} />
                </div>
            ) : (
                <div className="w-9" />
            )}

            <div className="flex flex-col gap-1 max-w-xl">
                {/* HEADER */}
                <div className="flex items-center gap-2 text-xs">
                    <span
                        className="font-semibold"
                        style={{ color: user.nameColor || "#fff" }}
                    >
                        {user.name}
                    </span>

                    {user.isAdmin && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
                            <FaShieldHalved /> Admin
                        </span>
                    )}

                    {user.isBot && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                            <FaRobot /> AI
                        </span>
                    )}

                    <span className="text-zinc-500">
                        • {user.role}
                    </span>
                </div>

                {/* BUBBLE */}
                <div>
                    {msg.content && (
                        <div className="text-sm px-4 py-2 rounded-2xl">
                            {msg.content}
                        </div>
                    )}

                    {msg.embed && <EmbedCard embed={msg.embed} />}

                    {msg.series && <SeriesCard series={msg.series} />}

                    <ReactionBar reactions={msg.reactions} />
                    {/* HOVER ACTION */}
                    <div className="absolute -top-3 right-2 hidden group-hover:flex gap-2 bg-zinc-900 rounded-full px-2 py-1 text-xs shadow-lg">
                        <FaReply className="cursor-pointer hover:text-indigo-400" />
                        <FaFaceSmile className="cursor-pointer hover:text-yellow-400" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}