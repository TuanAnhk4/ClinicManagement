'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Stethoscope } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useUI, useAuth } from '@/hooks';
import { DOCTOR_MENU } from '@/constants/menus'; // 1. Import Menu chuẩn

export const DoctorSidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useUI(); // 2. Hỗ trợ thu gọn
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        // 3. Điều chỉnh chiều rộng
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* --- Logo --- */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
        <Link href="/doctor/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
            {/* Icon khác biệt chút với Admin để dễ nhận biết */}
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          
          <span className={cn(
            "text-xl font-bold text-gray-800 dark:text-white tracking-tight transition-opacity duration-200",
            isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            Doctor
          </span>
        </Link>
      </div>

      {/* --- Menu Items --- */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {DOCTOR_MENU.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/doctor/dashboard');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : ''}
              className={cn(
                "flex items-center px-3 py-3 rounded-lg transition-colors group relative",
                isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                isSidebarCollapsed && "justify-center"
              )}
            >
              <Icon size={22} className={cn("flex-shrink-0", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300")} />
              
              {!isSidebarCollapsed && (
                <span className="ml-3 truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- Footer (Logout) --- */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className={cn(
            "flex items-center w-full px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
            isSidebarCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!isSidebarCollapsed && (
            <span className="ml-3 font-medium">Đăng xuất</span>
          )}
        </button>
      </div>
    </aside>
  );
};