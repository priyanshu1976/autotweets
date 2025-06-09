"use client"

export default function Button({ children, variant = "primary", className = "", onClick, disabled = false }) {
  const variants = {
    primary: "bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-800",
    guide: "bg-teal-500 hover:bg-teal-600 text-white text-sm px-3 py-2",
  }

  return (
    <button
      className={`px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
