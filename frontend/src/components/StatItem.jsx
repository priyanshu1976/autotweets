export default function StatItem({ label, value, valueColor = "text-white" }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-slate-400">{label}</span>
      <span className={`font-medium ${valueColor}`}>{value}</span>
    </div>
  )
}
