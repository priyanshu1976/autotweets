export default function StepItem({ number, title, isCompleted = false }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          isCompleted ? "bg-teal-500 text-white" : "bg-slate-700 text-slate-300"
        }`}
      >
        {number}
      </div>
      <span className={`text-sm ${isCompleted ? "text-white" : "text-slate-400"}`}>{title}</span>
    </div>
  )
}
