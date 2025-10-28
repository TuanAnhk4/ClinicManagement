// src/components/layout/AdminHeader.tsx
'use client'; // Cần thiết nếu có tương tác như dropdown, theme toggle

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext'; // Để lấy thông tin user
// (Tùy chọn) Import icons từ react-icons
// import { FiBell, FiSun, FiMoon, FiChevronDown, FiLogOut } from 'react-icons/fi';

// Props để nhận tiêu đề trang động
interface AdminHeaderProps {
  pageTitle: string;
}

export const AdminHeader = ({ pageTitle }: AdminHeaderProps) => {
  const { user, logout } = useAuth(); // Lấy user và hàm logout từ context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State ví dụ cho theme toggle
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Tiêu đề Trang */}
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

      {/* Các nút bên phải */}
      <div className="flex items-center space-x-4">
        {/* Nút Chuông Thông Báo */}
        <button className="relative text-gray-500 hover:text-gray-700 focus:outline-none">
          {/* <FiBell className="h-5 w-5" /> */} 🔔
          {/* (Tùy chọn) Dấu chấm đỏ báo có thông báo mới */}
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Nút Chuyển Đổi Giao Diện */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {/* {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />} */}
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Menu Người Dùng */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {/* Ảnh đại diện */}
            <div className="w-8 h-8 rounded-full overflow-hidden border">
              {/* Thay bằng ảnh thật */}
              <Image
                src={`https://i.pravatar.cc/150?u=${user?.email || 'admin'}`}
                alt="Admin Avatar"
                width={32}
                height={32}
              />
            </div>
            {/* Tên và Email */}
            <div className="hidden sm:block text-left">
              <span className="block text-sm font-medium text-gray-800">{user?.fullName || 'Admin'}</span>
              <span className="block text-xs text-gray-500">{user?.email || 'admin@example.com'}</span>
            </div>
            {/* Mũi tên Dropdown */}
            {/* <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} /> */} ▼
          </button>

          {/* Nội dung Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Hồ sơ
              </a>
              <button
                onClick={logout} // Gọi hàm logout từ AuthContext
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                role="menuitem"
              >
                {/* <FiLogOut className="inline mr-2 h-4 w-4"/> */} Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};