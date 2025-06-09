export default function SettingItem({ title, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-800">
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}
