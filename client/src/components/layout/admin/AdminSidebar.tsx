'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Stethoscope } from 'lucide-react'; // Icon logo & logout

import { cn } from '@/lib/utils';
import { useUI, useAuth } from '@/hooks';
import { ADMIN_MENU } from '@/constants/menus'; // 1. Import cấu hình Menu chuẩn

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useUI(); // 2. Lấy trạng thái thu gọn
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800",
        // 3. Điều chỉnh chiều rộng dựa trên trạng thái
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* --- Logo --- */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          
          {/* Ẩn tên app khi thu gọn */}
          <span className={cn(
            "text-xl font-bold text-white tracking-tight transition-opacity duration-200",
            isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            Admin
          </span>
        </Link>
      </div>

      {/* --- Menu Items --- */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {ADMIN_MENU.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard');
          const Icon = item.icon; // Lấy component icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : ''} // Tooltip khi thu gọn
              className={cn(
                "flex items-center px-3 py-3 rounded-lg transition-colors group relative",
                isActive 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "hover:bg-slate-800 hover:text-white",
                isSidebarCollapsed && "justify-center"
              )}
            >
              <Icon size={22} className={cn("flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              
              {/* Ẩn nhãn khi thu gọn */}
              {!isSidebarCollapsed && (
                <span className="ml-3 font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- Footer (Logout) --- */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className={cn(
            "flex items-center w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors",
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