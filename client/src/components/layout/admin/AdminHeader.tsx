'use client';

import React, { useState, useRef } from 'react';
import { Bell, ChevronDown, LogOut, Moon, Sun, User } from 'lucide-react';

// Import Hooks
import { useAuth, useTheme, useOnClickOutside } from '@/hooks';

// Import UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

interface AdminHeaderProps {
  pageTitle: string;
}

export const AdminHeader = ({ pageTitle }: AdminHeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // --- SỬA LỖI Ở ĐÂY ---
  // Khai báo rõ ràng kiểu là HTMLDivElement và khởi tạo là null
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sử dụng hook để đóng dropdown khi click ra ngoài
  // Ép kiểu nhẹ (as RefObject) nếu TypeScript vẫn bắt bẻ, 
  // nhưng thường useRef<HTMLDivElement>(null) là đủ chuẩn.
  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setIsDropdownOpen(false));

  // Hàm lấy chữ cái đầu tên user (VD: Admin -> A)
  const getInitials = (name?: string) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      
      {/* Tiêu đề Trang */}
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {pageTitle}
      </h1>

      {/* Các nút bên phải */}
      <div className="flex items-center space-x-4">
        
        {/* Nút Chuông Thông Báo */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        </button>

        {/* Nút Chuyển Đổi Giao Diện */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Menu Người Dùng (Có Avatar & Dropdown) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-600">
              {/* Dùng UI Avatars làm ảnh mặc định nếu user chưa có ảnh */}
              <AvatarImage 
                src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=random`} 
                alt={user?.fullName} 
              />
              <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
            </Avatar>
            
            <div className="hidden sm:block text-left">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.fullName || 'Admin'}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </span>
            </div>
            
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-100">
              {/* Info mobile only */}
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                <User size={16} />
                Hồ sơ cá nhân
              </button>
              
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};