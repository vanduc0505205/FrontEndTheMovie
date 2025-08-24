import { Link, useLocation } from 'react-router-dom';
import {
  VideoCameraOutlined,
  AppstoreOutlined,
  PictureOutlined,
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
  InsertRowAboveOutlined,
  ShoppingCartOutlined,
  ContactsOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import clsx from 'clsx';

const navItemsAdmin = [
  { label: 'Dashboard', path: 'dashboard', icon: <VideoCameraOutlined /> },
  { label: 'Phim', path: 'movies', icon: <VideoCameraOutlined /> },
  { label: 'Danh mục', path: 'categories', icon: <AppstoreOutlined /> },
  { label: 'Rạp chiếu', path: 'cinemas', icon: <HomeOutlined /> },
  { label: 'Suất chiếu', path: 'showtimes', icon: <VideoCameraOutlined /> },
  { label: 'Ghế', path: 'seats', icon: <AppstoreOutlined /> },
  { label: 'Phòng', path: 'rooms', icon: <PictureOutlined /> },
  { label: 'Mã giảm giá', path: 'discounts', icon: <AppstoreOutlined /> },
  { label: 'Combo', path: 'combos', icon: <DollarOutlined /> },
  { label: 'Tài khoản', path: 'users', icon: <TeamOutlined /> },
  { label: 'Quản lý đơn hàng', path: 'bookings', icon: <ShoppingCartOutlined /> },
  { label: "Quản lý Liên hệ", path: "lienhe", icon: <ContactsOutlined /> },
  { label: "Quản lý Tin tức", path: "news", icon: <FileTextOutlined /> },
];

const navItemsStaff = [
  { label: 'Đặt vé', path: 'bookings', icon: <DollarOutlined /> },
  { label: 'Thanh toán', path: 'payments', icon: <DollarOutlined /> },
  { label: 'Lịch chiếu', path: 'showtimes', icon: <VideoCameraOutlined /> },
  { label: 'Phim', path: 'movies', icon: <VideoCameraOutlined /> },
  { label: 'Phòng chiếu', path: 'rooms', icon: <InsertRowAboveOutlined /> },
  { label: 'Danh mục', path: 'categories', icon: <AppstoreOutlined /> },
  { label: "Quản lý Tin tức", path: "news", icon: <FileTextOutlined /> },
];

export default function Sidebar({ role }: { role: 'admin' | 'staff' }) {
  const location = useLocation();
  const navItems = role === 'admin' ? navItemsAdmin : navItemsStaff;

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
      <div className="text-xl font-bold p-4 border-b">
        🎬 {role === 'admin' ? 'Admin Panel' : 'Staff Panel'}
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname.endsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-2 p-2 rounded-md font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-500 text-white shadow-inner'
                  : 'text-gray-700 hover:bg-blue-100'
              )}
            >
              <span className={clsx('text-lg', isActive ? 'text-white' : 'text-blue-500')}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
