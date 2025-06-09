export default function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
