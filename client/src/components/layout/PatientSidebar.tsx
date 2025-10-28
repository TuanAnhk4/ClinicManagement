// src/components/layout/PatientSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth để dùng hàm logout
// (Tùy chọn) Import icons từ react-icons
// import { FiHome, FiCalendar, FiList, FiSettings, FiLogOut } from 'react-icons/fi';

// Định nghĩa các mục menu cho Patient
const patientMenuItems = [
  { href: '/patient', label: 'Tổng Quan', icon: '🏠' }, // Trang chủ riêng của Patient
  { href: '/patient/book-appointment', label: 'Đặt Lịch Khám', icon: '🗓️' },
  { href: '/patient/my-appointments', label: 'Lịch Hẹn Của Tôi', icon: '📋' },
  // Thêm các mục khác nếu cần, ví dụ: Hồ sơ, Cài đặt...
  // { href: '/patient/profile', label: 'Hồ Sơ', icon: '👤' },
  // { href: '/patient/settings', label: 'Cài Đặt', icon: '⚙️' },
];

export const PatientSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth(); // Lấy hàm logout

  return (
    // Sidebar: Nền sáng, chiều rộng, flex column, border phải
    <aside className="w-64 bg-white flex flex-col h-screen sticky top-0 border-r border-gray-200">
      {/* Logo/Tên App */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Link href="/patient" className="text-xl font-bold text-blue-600">
          Health Care {/* Hoặc Logo */}
        </Link>
      </div>

      {/* Phần Menu */}
      <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
        {patientMenuItems.map((item) => {
          // Logic highlight link active (Kiểm tra cả trang con)
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/patient');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700' // Style khi link active (nền xanh nhạt)
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Style mặc định và hover
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
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout} // Gọi hàm logout khi nhấn nút
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
        >
          {/* Thay bằng icon thật */}
          <span className="text-lg">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};