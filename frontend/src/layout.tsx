import type React from 'react'
import Sidebar from './components/sideBar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="dashboard" />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default Layout
