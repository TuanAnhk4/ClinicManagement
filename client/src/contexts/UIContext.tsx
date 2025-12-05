'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage-keys';

import { UIContextType } from '@/types';

// 2. Tạo Context với giá trị mặc định null
export const UIContext = createContext<UIContextType | null>(null);

// 3. Component Global Spinner (Hiển thị khi loading)
const GlobalSpinner = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-xl">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p className="mt-4 text-sm font-medium text-gray-600">Đang xử lý...</p>
    </div>
  </div>
);

// 4. UI Provider
export const UIProvider = ({ children }: { children: ReactNode }) => {
  // --- State: Sidebar ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- State: Global Loading ---
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  // Effect: Khôi phục trạng thái Sidebar từ LocalStorage khi load trang
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    if (savedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Hàm toggle sidebar và lưu vào storage
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(newState));
      return newState;
    });
  };

  // Hàm set trực tiếp (ít dùng hơn toggle)
  const setSidebarCollapsedState = (value: boolean) => {
    setIsSidebarCollapsed(value);
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(value));
  };

  // Các hàm Loading
  const showGlobalLoading = () => setIsGlobalLoading(true);
  const hideGlobalLoading = () => setIsGlobalLoading(false);

  const value = {
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed: setSidebarCollapsedState,
    isGlobalLoading,
    showGlobalLoading,
    hideGlobalLoading,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
      {/* Nếu đang loading thì hiển thị lớp phủ Spinner đè lên trên cùng */}
      {isGlobalLoading && <GlobalSpinner />}
    </UIContext.Provider>
  );
};