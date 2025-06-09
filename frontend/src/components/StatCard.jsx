export default function StatCard({ title, value, subtitle, icon, iconColor }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>
        <div className={`text-xl ${iconColor}`}>{icon}</div>
      </div>
      <div className={`text-2xl font-bold mb-1 ${iconColor}`}>{value}</div>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  )
}
