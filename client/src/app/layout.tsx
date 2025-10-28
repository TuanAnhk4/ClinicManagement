import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Import file CSS global
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Lý Phòng Khám', // Tiêu đề chung cho trang web
  description: 'Đồ án chuyên ngành quản lý phòng khám tư nhân', // Mô tả chung
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* AuthProvider bọc toàn bộ ứng dụng */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}