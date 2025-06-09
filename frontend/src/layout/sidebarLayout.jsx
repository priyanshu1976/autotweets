import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-950 text-white min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
