
import { Outlet } from 'react-router-dom'

import HeaderStaff from './header'
import SidebarStaff from './Sidebar'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarStaff />
      <div className="flex-1 flex flex-col">
        <HeaderStaff />
        <main className="p-4 flex-1 overflow-auto">
          <Outlet /> {/* Đây là nơi route con sẽ hiển thị */}
        </main>
      </div>
    </div>
  )
}
