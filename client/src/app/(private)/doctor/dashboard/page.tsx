'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // 1. Import useAuth
import api from '@/lib/api';
import { Appointment, User } from '@/types'; // Giả sử bạn có User type
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function DoctorDashboardPage() {
  // --- TẤT CẢ HOOKS ĐƯỢC ĐẶT LÊN TRÊN CÙNG ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [view, setView] = useState<'today' | 'all'>('today');

  const router = useRouter();

  // Lấy ra trạng thái xác thực từ AuthContext
  const { isAuthenticated, user, loading: authLoading } = useAuth(); // Lấy cả user nếu cần (ví dụ: chào mừng)

  // useEffect để lấy dữ liệu lịch hẹn
  useEffect(() => {
    // Định nghĩa hàm fetch bên trong
    const fetchAppointments = async () => {
      setError(''); // Reset lỗi khi fetch lại
      try {
        const response = await api.get('/appointments/doctor/me');
        setAppointments(response.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError('Không thể tải lịch hẹn. Vui lòng thử lại.');
      }
    };

    // Chỉ gọi fetchAppointments KHI:
    // 1. Quá trình xác thực ban đầu đã hoàn tất (authLoading === false)
    // 2. Người dùng đã được xác thực (isAuthenticated === true)
    if (!authLoading && isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated, authLoading]); // Dependencies: chạy lại khi trạng thái xác thực thay đổi

  // useMemo để lọc danh sách (vẫn giữ nguyên)
  const filteredAppointments = useMemo(() => {
    if (view === 'today') {
      const today = new Date().toDateString();
      return appointments.filter(
        (app) => new Date(app.appointmentTime).toDateString() === today
      );
    }
    return appointments;
  }, [appointments, view]);
  // --- KẾT THÚC KHU VỰC KHAI BÁO HOOKS ---


  // --- XỬ LÝ TRẠNG THÁI LOADING VÀ LỖI ---
  // Ưu tiên hiển thị trạng thái loading của AuthContext trước
  if (authLoading) {
    return <div className="p-8">Đang xác thực...</div>;
  }

  // Nếu có lỗi fetch dữ liệu
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }
  // --- KẾT THÚC XỬ LÝ LOADING/LỖI ---


  // --- PHẦN JSX RENDER GIAO DIỆN CHÍNH ---
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        {/* Chào mừng bác sĩ (nếu có user) */}
        {user && <h1 className="text-3xl font-bold">Chào mừng, Dr. {user.fullName}!</h1>}
        <p className="text-gray-500">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setView('today')}
          className={`py-2 px-1 font-semibold transition-colors ${
            view === 'today'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Lịch Hẹn Hôm Nay
        </button>
        <button
          onClick={() => setView('all')}
          className={`py-2 px-1 font-semibold transition-colors ${
            view === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Tất Cả Lịch Hẹn
        </button>
      </div>

      {/* Danh sách lịch hẹn */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <Card key={app.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              {/* Nội dung thẻ giữ nguyên */}
              <div className="flex items-center">
                 <span className={`w-3 h-3 rounded-full mr-4 ${
                   app.status === 'CONFIRMED' ? 'bg-blue-500' : 
                   app.status === 'COMPLETED' ? 'bg-gray-400' : 'bg-red-500'
                 }`}></span>
                 
                 <div className="font-semibold text-lg w-40">
                   {view === 'all' && `${new Date(app.appointmentTime).toLocaleDateString('vi-VN')} - `}
                   {new Date(app.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                 </div>

                 <div>
                   <p className="font-bold text-gray-800">{app.patient.fullName}</p>
                   <p className="text-sm text-gray-600">Lý do: {app.reason || 'Không có'}</p>
                 </div>
               </div>
               
               {app.status === 'CONFIRMED' && (
                 <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                 onClick={() => router.push(`/doctor/consultation/${app.id}`)}>
                   Bắt đầu khám
                 </button>
               )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-600 font-semibold">Không có lịch hẹn nào để hiển thị.</p>
        </div>
      )}
    </div>
  );
}