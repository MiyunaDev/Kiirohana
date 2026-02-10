export function StatusDot({ status }: { status?: string }) {
  const color = {
    online: "bg-green-500",
    idle: "bg-yellow-400",
    offline: "bg-zinc-500"
  }[status || "offline"]

  return (
    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950 ${color}`} />
  )
}