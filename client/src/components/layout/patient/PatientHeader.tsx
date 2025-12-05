'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Stethoscope } from 'lucide-react';
import { useUI } from '@/hooks'; // Hook quản lý UI
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks';

export const PatientHeader = () => {
  const { toggleSidebar } = useUI();
  const { user } = useAuth();

  // Hàm lấy chữ cái đầu
  const getInitials = (name?: string) => name ? name.charAt(0).toUpperCase() : 'P';

  return (
    // md:hidden -> Ẩn hoàn toàn trên màn hình Desktop
    <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
      
      {/* Nút mở Menu Sidebar */}
      <button 
        onClick={toggleSidebar}
        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Logo (Giữa hoặc Trái) */}
      <Link href="/patient" className="flex items-center gap-2">
        <div className="bg-blue-600 p-1 rounded">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-gray-800 text-lg">HealthCare</span>
      </Link>

      {/* Avatar nhỏ (Bên phải) */}
      <Link href="/patient/profile">
        <Avatar className="h-8 w-8 border border-gray-200">
          <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=random`} />
          <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
};