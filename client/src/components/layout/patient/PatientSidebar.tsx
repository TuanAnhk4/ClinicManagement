'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Stethoscope, X } from 'lucide-react'; // Thêm icon X để đóng trên mobile

import { cn } from '@/lib/utils';
import { useUI, useAuth } from '@/hooks';
import { PATIENT_MENU } from '@/constants/menus'; // 1. Import Menu chuẩn

export const PatientSidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUI(); // 2. Lấy trạng thái đóng mở
  const { logout } = useAuth();

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      
      {/* --- Logo & Header --- */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <Link href="/patient" className="flex items-center gap-2 text-blue-600 hover:opacity-80 transition-opacity">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Stethoscope size={20} className="text-blue-600" />
          </div>
          <span className="text-xl font-bold tracking-tight">HealthCare</span>
        </Link>

        {/* Nút đóng Sidebar (Chỉ hiện trên Mobile để tắt menu) */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* --- Menu Items --- */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {PATIENT_MENU.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/patient');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                // Trên mobile: Tự động đóng menu khi click vào link
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                )} 
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- Footer (Logout) --- */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};