// src/components/layout/MainLayout.tsx
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1 overflow-auto">
          <Outlet /> {/* Đây là nơi route con sẽ hiển thị */}
        </main>
      </div>
    </div>
  )
}
