import { FaRobot, FaShieldHalved } from "react-icons/fa6"

interface Props {
  user: {
    name: string
    role: string
    avatar: string
    isAdmin?: boolean
    isBot?: boolean
    nameColor?: string
  }
}

export default function ChatHeader({ user }: Props) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-zinc-900">
      <img
        src={user.avatar}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700"
      />

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className="font-semibold"
            style={{ color: user.nameColor || "#fff" }}
          >
            {user.name}
          </span>

          {user.isAdmin && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
              <FaShieldHalved /> Admin
            </span>
          )}

          {user.isBot && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
              <FaRobot /> AI
            </span>
          )}
        </div>

        <span className="text-xs text-zinc-400">{user.role}</span>
      </div>
    </div>
  )
}