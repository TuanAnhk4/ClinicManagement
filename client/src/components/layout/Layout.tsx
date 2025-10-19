import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính, chiếm phần còn lại */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header cố định ở trên */}
        <Header />

        {/* Nội dung trang, có thể cuộn */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children} {/* Đây là nơi nội dung của từng trang sẽ được hiển thị */}
        </main>
      </div>
    </div>
  );
};