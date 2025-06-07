import type React from 'react'
import { BarChart3, Calendar } from 'lucide-react'

interface SidebarProps {
  activeTab?: string
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard' }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Calendar,
      href: '/',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
    },
  ]

  return (
    <aside className="w-64 bg-red-800 text-white flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">AutoTweet Dev</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-900 text-yellow-300 font-semibold'
                      : 'text-white hover:bg-red-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-red-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">D</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm">Developer</p>
            <p className="text-red-200 text-xs truncate">dev@autotweet.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
