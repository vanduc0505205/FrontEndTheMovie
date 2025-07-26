import { Link, useLocation } from 'react-router-dom'
import { VideoCameraOutlined, AppstoreOutlined, PictureOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons'
import clsx from 'clsx'

const navItems = [
  {
    label: 'Phim',
    path: 'movies',
    icon: <VideoCameraOutlined />
  },
  {
    label: 'Danh mục',
    path: 'categories',
    icon: <AppstoreOutlined />
  },
  {
    label: 'Rạp chiếu',
    path: 'cinemas',
    icon: <HomeOutlined />
  },
  {
    label: 'Suất chiếu',
    path: 'showtimes',
    icon: <VideoCameraOutlined />
  },
  {
    label: 'Ghế',
    path: 'seats',
    icon: <AppstoreOutlined />
  },
  {
    label: 'Phòng',
    path: 'rooms',
    icon: <PictureOutlined />
  },
  {
    label: 'Tài khoản',
    path: 'users',
    icon: <TeamOutlined />
  }
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
      <div className="text-xl font-bold p-4 border-b">🎬 Admin Panel</div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition',
              location.pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-700'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
