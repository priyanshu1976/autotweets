export default function StatusIndicator({ status, message }) {
  const statusColors = {
    connected: "bg-green-500",
    disconnected: "bg-red-500",
    pending: "bg-yellow-500",
  }

  const statusText = {
    connected: "Connected",
    disconnected: "Not Connected",
    pending: "Connecting...",
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
      <div>
        <div className="text-white font-medium">{statusText[status]}</div>
        {message && <div className="text-slate-400 text-sm">{message}</div>}
      </div>
    </div>
  )
}
