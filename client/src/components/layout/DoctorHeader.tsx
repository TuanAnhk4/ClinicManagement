'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
// (Tùy chọn) Import icons từ react-icons
// import { FiSearch, FiBell, FiChevronDown, FiLogOut } from 'react-icons/fi';

export const DoctorHeader = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    // Header: Nền trắng, đổ bóng nhẹ, chiều cao cố định
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30 border-b border-gray-200">
      {/* Phần Bên Trái: Thanh Tìm Kiếm */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          {/* Thay bằng icon search */}
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search..."
          className="py-2 pl-10 pr-4 w-64 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {/* Phần Bên Phải: Thông Báo & User */}
      <div className="flex items-center space-x-5">
        {/* Nút Chuông Thông Báo */}
        <button className="relative text-gray-500 hover:text-gray-700 focus:outline-none">
          {/* <FiBell className="h-5 w-5" /> */} 🔔
          {/* (Tùy chọn) Dấu chấm đỏ */}
          <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white"></span>
        </button>

        {/* Menu Người Dùng */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {/* Ảnh đại diện */}
            <div className="w-8 h-8 rounded-full overflow-hidden border">
              <Image
                src={`https://i.pravatar.cc/150?u=${user?.email || 'doctor'}`}
                alt="Doctor Avatar"
                width={32}
                height={32}
              />
            </div>
            {/* Tên Người Dùng */}
            <span className="hidden sm:block text-sm font-medium text-gray-800">{user?.fullName || 'Doctor Name'}</span>
            {/* Mũi tên Dropdown */}
            {/* <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} /> */} ▼
          </button>

          {/* Nội dung Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ</a>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};