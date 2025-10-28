// src/components/layout/DoctorSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// (Tùy chọn) Import icons từ react-icons
// import { FiLayoutDashboard, FiUser, FiMail, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';

// Định nghĩa các mục menu cho Bác sĩ
const doctorMenuItems = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: '📊' }, // Placeholder
  { href: '/doctor/patients', label: 'Bệnh Nhân', icon: '👥' }, // Placeholder (Trang quản lý BN của BS)
  // { href: '/doctor/messages', label: 'Tin Nhắn', icon: '✉️' }, // Placeholder
  { href: '/doctor/schedule', label: 'Lịch Làm Việc', icon: '🗓️' }, // Placeholder (Xem lịch chi tiết)
  { href: '/doctor/documents', label: 'Tài Liệu', icon: '📄' }, // Placeholder
  { href: '/doctor/settings', label: 'Cài Đặt', icon: '⚙️' }, // Placeholder
];

export const DoctorSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    // Sidebar: Nền xanh dương đậm, chiều rộng, flex column
    <aside className="w-64 bg-blue-600 text-blue-100 flex flex-col h-screen sticky top-0">
      {/* Logo/Tên App */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-blue-700">
        <Link href="/doctor/dashboard" className="text-xl font-bold text-white">
          Hospital App {/* Hoặc Logo */}
        </Link>
      </div>

      {/* Phần Menu */}
      <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
        {doctorMenuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm' // Style khi active: Nền trắng, chữ xanh
                  : 'hover:bg-blue-700 hover:text-white' // Style khi hover
              }`}
            >
              {/* Thay bằng component Icon thật */}
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Phần dưới cùng: Nút Đăng xuất */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
        >
          {/* Thay bằng icon thật */}
          <span className="text-lg">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};