import Sidebar from './Sidebar';
import HeaderDashboard from './HeaderDashboard';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout({ role }: { role: 'admin' | 'staff' }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <HeaderDashboard role={role} />
        <main className="p-4 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
