import {
  LayoutDashboard,
  MessageSquareText,
  Settings,
  CheckCircle,
  Bird,
  Home,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: 'Tweet Preferences',
    path: '/prompt',
    icon: <MessageSquareText size={18} />,
  },
  {
    title: 'Twitter API Setup',
    path: '/apisetup',
    icon: <Bird size={18} />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings size={18} />,
  },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-white font-bold text-sm">
            ST
          </div>
          <span className="text-white font-semibold text-lg">SleepTweeter</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-2">
        <nav className="space-y-1">
          {menuItems.map(({ title, path, icon }) => (
            <NavLink
              to={path}
              key={title}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-[#39FF14]'
                }`
              }
            >
              {icon}
              <span>{title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
          <span className="text-sm truncate">user@example.com</span>
        </div>
      </div>
    </div>
  )
}
