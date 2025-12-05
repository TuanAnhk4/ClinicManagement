'use client';

import React, { useState, useRef } from 'react';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  Moon, 
  Search, 
  Sun, 
  User,
  Settings
} from 'lucide-react';

// Import Hooks & Components chuẩn
import { useAuth, useTheme, useOnClickOutside } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

// 1. Định nghĩa Props để sửa lỗi TypeScript bên Layout
interface DoctorHeaderProps {
  pageTitle: string;
}

export const DoctorHeader = ({ pageTitle }: DoctorHeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Ref và Hook để đóng dropdown khi click ra ngoài
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setIsDropdownOpen(false));

  // Hàm lấy chữ cái đầu tên
  const getInitials = (name?: string) => name ? name.charAt(0).toUpperCase() : 'D';

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      
      {/* --- KHU VỰC TRÁI: Tiêu đề & Search --- */}
      <div className="flex items-center gap-8">
        {/* Tiêu đề trang (Lấy từ Layout truyền xuống) */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 min-w-[200px]">
          {pageTitle}
        </h1>

        {/* Thanh tìm kiếm (Optional - Nếu bác sĩ cần tìm bệnh nhân nhanh) */}
        <div className="hidden md:flex relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="search"
            placeholder="Tìm bệnh nhân..."
            className="py-1.5 pl-9 pr-4 w-64 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* --- KHU VỰC PHẢI: Actions & User --- */}
      <div className="flex items-center space-x-4">
        
        {/* Nút Chuông Thông Báo */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        </button>

        {/* Nút Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Avatar xịn */}
            <Avatar className="h-9 w-9 border border-blue-100 dark:border-gray-600">
              <AvatarImage 
                src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`} 
                alt={user?.fullName} 
              />
              <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
            </Avatar>
            
            {/* Thông tin text */}
            <div className="hidden sm:block text-left">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                BS. {user?.fullName || 'Doctor'}
              </span>
              <span className="block text-xs text-blue-600 dark:text-blue-400 font-medium">
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
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Đang đăng nhập với:</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
              </div>
              
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                <User size={16} /> Hồ sơ bác sĩ
              </button>
              
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                <Settings size={16} /> Cài đặt lịch làm việc
              </button>
              
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};