// src/components/layout/AdminSidebar.tsx
'use client'; // Cần thiết nếu dùng hook như usePathname để highlight link active

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook để lấy đường dẫn hiện tại
// (Tùy chọn) Import icons từ react-icons
// import { FiGrid, FiUsers, FiCalendar, FiSettings } from 'react-icons/fi';

// Định nghĩa các mục menu cho Admin
const adminMenuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' }, // Placeholder icon
  { href: '/admin/doctors', label: 'Quản lý Bác Sĩ', icon: '👨‍⚕️' }, 
  { href: '/admin/patients', label: 'Quản lý Bệnh Nhân', icon: '🧑‍🤝‍🧑' },
  // { href: '/admin/appointments', label: 'Quản lý Lịch hẹn', icon: '🗓️' }, // Thêm nếu cần
  // { href: '/admin/settings', label: 'Cài đặt', icon: '⚙️' }, // Thêm nếu cần
];

export const AdminSidebar = () => {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại để biết link nào active

  return (
    // Sidebar: Nền tối, chiều rộng cố định, flex column
    <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col h-screen sticky top-0">
      {/* Logo/Tên App */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <Link href="/admin/dashboard" className="text-xl font-bold text-white">
          Admin Panel {/* Hoặc Logo */}
        </Link>
      </div>

      {/* Phần Menu */}
      <nav className="flex-1 py-4 px-2 space-y-2">
        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard'); // Logic highlight link active

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white' // Style khi link active
                  : 'hover:bg-gray-700 hover:text-white' // Style khi hover
              }`}
            >
              {/* Thay bằng component Icon thật */}
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* (Tùy chọn) Phần dưới cùng của Sidebar, ví dụ: Nút Đăng xuất */}
      <div className="p-4 border-t border-gray-700">
        {/* <button className="w-full text-left ...">Đăng xuất</button> */}
      </div>
    </aside>
  );
};